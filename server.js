const express = require('express');
const path    = require('path');

const app  = express();
const PORT = 3000;

const SOFASCORE  = 'https://api.sofascore.com/api/v1';
const SC_HEADERS = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' };

const MACCABI_SC_ID = 5198;
const SEASON_START  = '2025-08-01';

let cachedTournamentId = null;
let cachedSeasonId     = null;

async function resolveSofascoreIds() {
  if (cachedTournamentId && cachedSeasonId) return { tid: cachedTournamentId, sid: cachedSeasonId };
  const r = await fetch(`${SOFASCORE}/team/${MACCABI_SC_ID}/events/last/0`, { headers: SC_HEADERS });
  const d = await r.json();
  // Filter specifically for Israeli Premier League (tid 266), not Cup/Europe
  const ev = d.events?.find(e => e.tournament?.uniqueTournament?.id === 266);
  if (!ev) throw new Error('No Premier League events found');
  cachedTournamentId = ev.tournament.uniqueTournament.id;
  cachedSeasonId     = ev.season?.id;
  return { tid: cachedTournamentId, sid: cachedSeasonId };
}

// ─── 365scores Hebrew name lookup ────────────────────────────────
const SCORES365  = 'https://webws.365scores.com/web';
const S365_HEADS = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' };

// Sofascore English team name → Hebrew (for matching against 365scores)
const HE_TEAMS_MAP = {
  'Maccabi Tel Aviv':              'מכבי תל אביב',
  'Hapoel Beer Sheva':             'הפועל באר שבע',
  "Hapoel Be'er Sheva":            'הפועל באר שבע',
  'Maccabi Haifa':                 'מכבי חיפה',
  'Beitar Jerusalem':              'ביתר ירושלים',
  'Hapoel Tel Aviv':               'הפועל תל אביב',
  'Hapoel Tel-Aviv':               'הפועל תל אביב',
  'Hapoel Haifa':                  'הפועל חיפה',
  'Hapoel Petah Tikva':            'הפועל פתח תקווה',
  'Hapoel Petach Tikva':           'הפועל פתח תקווה',
  'Maccabi Petah Tikva':           'מכבי פתח תקווה',
  'Maccabi Petach Tikva':          'מכבי פתח תקווה',
  'Bnei Sakhnin':                  'בני סכנין',
  'Bnei Yehuda':                   'בני יהודה',
  'Ashdod FC':                     'אשדוד',
  'FC Ashdod':                     'אשדוד',
  'Ashdod SC':                     'אשדוד',
  'Hapoel Hadera':                 'הפועל חדרה',
  'Ironi Kiryat Shmona':           'קרית שמונה',
  'Hapoel Ironi Kiryat Shmona':    'קרית שמונה',
  'Maccabi Netanya':               'מכבי נתניה',
  'Hapoel Jerusalem':              'הפועל ירושלים',
  'Ironi Tiberias':                'טבריה',
  'Ironi Dorot Tiberias':          'טבריה',
  'Maccabi Bney Reine':            'מכבי בני ריינה',
  'Maccabi Yafo':                  'מכבי יפו',
  'Hapoel Rishon Lezion':          'ראשון לציון',
};

function normTeam(s) {
  return (s || '').replace(/[."'"״\s-]/g, '');
}

function teamMatch(name365, heKey) {
  const a = normTeam(name365);
  const b = normTeam(heKey);
  if (!b || b.length < 3) return false;
  return a.includes(b) || b.includes(a);
}

// Returns { nameMap, ratingMap } — both keyed by 'side-jerseyNumber'
async function get365Data(startTimestamp, homeEn, awayEn) {
  try {
    const homeHe = HE_TEAMS_MAP[homeEn];
    const awayHe = HE_TEAMS_MAP[awayEn];
    if (!homeHe || !awayHe) return null;

    const d  = new Date(startTimestamp * 1000);
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dateStr = `${dd}/${mm}/${d.getUTCFullYear()}`;

    const r = await fetch(
      `${SCORES365}/games/?appTypeId=5&langId=2&startDate=${dateStr}&endDate=${dateStr}&sports=1`,
      { headers: S365_HEADS }
    );
    const gamesData = await r.json();

    const game365 = (gamesData.games || []).find(g => {
      const h = g.homeCompetitor?.name || '';
      const a = g.awayCompetitor?.name || '';
      return (teamMatch(h, homeHe) && teamMatch(a, awayHe)) ||
             (teamMatch(h, awayHe) && teamMatch(a, homeHe));
    });
    if (!game365) return null;

    const gr = await fetch(
      `${SCORES365}/game/?appTypeId=5&langId=2&gameId=${game365.id}`,
      { headers: S365_HEADS }
    );
    const gameData = await gr.json();
    const gGame   = gameData.game;
    const members = gGame?.members || [];

    const swapped = !teamMatch(game365.homeCompetitor?.name || '', homeHe);
    const homeId  = game365.homeCompetitor?.id;
    const byId    = Object.fromEntries(members.map(m => [m.id, m]));

    const nameMap   = {};
    const ratingMap = {};

    for (const m of members) {
      if (m.jerseyNumber == null || m.jerseyNumber < 0) continue;
      const isHome365 = m.competitorId === homeId;
      const side = swapped ? (isHome365 ? 'away' : 'home') : (isHome365 ? 'home' : 'away');
      nameMap[`${side}-${m.jerseyNumber}`] = m.name;
    }

    for (const [lineSide, lineArr] of [
      [swapped ? 'away' : 'home', gGame?.homeCompetitor?.lineups?.members || []],
      [swapped ? 'home' : 'away', gGame?.awayCompetitor?.lineups?.members || []],
    ]) {
      for (const lm of lineArr) {
        if (lm.status !== 1 || !(lm.ranking > 0)) continue;
        const mem = byId[lm.id];
        if (!mem || mem.jerseyNumber == null || mem.jerseyNumber < 0) continue;
        ratingMap[`${lineSide}-${mem.jerseyNumber}`] = lm.ranking;
      }
    }

    return { nameMap, ratingMap };
  } catch {
    return null;
  }
}

// ─── Sofascore event → frontend shape ────────────────────────────
function scToGame(ev) {
  const ts     = ev.startTimestamp * 1000;
  const d      = new Date(ts);
  const month  = d.getUTCMonth();
  const offset = (month >= 2 && month <= 9) ? 3 : 2;
  const local  = new Date(ts + offset * 3600 * 1000);
  const pad    = n => String(n).padStart(2, '0');
  return {
    idEvent:          String(ev.id),
    strHomeTeam:      ev.homeTeam.name,
    strAwayTeam:      ev.awayTeam.name,
    strHomeTeamBadge: `https://img.sofascore.com/api/v1/team/${ev.homeTeam.id}/image`,
    strAwayTeamBadge: `https://img.sofascore.com/api/v1/team/${ev.awayTeam.id}/image`,
    dateEvent:        local.toISOString().slice(0, 10),
    strTime:          `${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:00`,
    strVenue:         ev.venue?.name || null,
    intHomeScore:     ev.homeScore?.current ?? null,
    intAwayScore:     ev.awayScore?.current ?? null,
    strStatus:        ev.status?.type || '',
    strLeague:        ev.tournament?.name || '',
  };
}

app.use(express.static(path.join(__dirname, 'public')));

// ─── Upcoming fixtures ────────────────────────────────────────────
app.get('/api/upcoming', async (req, res) => {
  try {
    const r = await fetch(`${SOFASCORE}/team/${MACCABI_SC_ID}/events/next/0`, { headers: SC_HEADERS });
    const d = await r.json();
    const games = (d.events || [])
      .filter(ev => ev.status?.type !== 'finished')
      .map(scToGame)
      .sort((a, b) => new Date(a.dateEvent + 'T' + a.strTime) - new Date(b.dateEvent + 'T' + b.strTime));
    res.json(games);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Season results ───────────────────────────────────────────────
app.get('/api/results-all', async (req, res) => {
  try {
    const [p0, p1] = await Promise.all([
      fetch(`${SOFASCORE}/team/${MACCABI_SC_ID}/events/last/0`, { headers: SC_HEADERS }).then(r => r.json()),
      fetch(`${SOFASCORE}/team/${MACCABI_SC_ID}/events/last/1`, { headers: SC_HEADERS }).then(r => r.json()),
    ]);
    const games = [...(p0.events || []), ...(p1.events || [])]
      .filter(ev =>
        ev.status?.type === 'finished' &&
        new Date(ev.startTimestamp * 1000).toISOString().slice(0, 10) >= SEASON_START
      )
      .map(scToGame)
      .sort((a, b) => new Date(b.dateEvent) - new Date(a.dateEvent));
    res.json(games);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Squad stats ──────────────────────────────────────────────────
app.get('/api/squad', async (req, res) => {
  try {
    const { tid, sid } = await resolveSofascoreIds();
    const squadRes  = await fetch(`${SOFASCORE}/team/${MACCABI_SC_ID}/players`, { headers: SC_HEADERS });
    const squadData = await squadRes.json();
    const squad = squadData.players || [];

    const players = await Promise.all(
      squad.map(async ({ player: p }) => {
        try {
          const r = await fetch(
            `${SOFASCORE}/player/${p.id}/unique-tournament/${tid}/season/${sid}/statistics/overall`,
            { headers: SC_HEADERS }
          );
          const d = await r.json();
          const s = d.statistics || {};
          return {
            id:           p.id,
            name:         p.name,
            position:     p.position,
            positionDetail: (p.positionsDetailed?.[0]) ?? null,
            shirtNumber:  p.shirtNumber ?? null,
            rating:       s.rating      ? +s.rating.toFixed(2) : null,
            appearances:  s.appearances  ?? 0,
            minutesPlayed:s.minutesPlayed ?? 0,
            goals:        s.goals         ?? 0,
            assists:      s.assists       ?? 0,
            apps:         s.appearances   ?? 0,
            yellowCards:  s.yellowCards   ?? 0,
            redCards:     s.redCards      ?? 0,
            saves:        s.saves         ?? 0,
            cleanSheet:   s.cleanSheet    ?? 0,
            goalsConceded:s.goalsConceded ?? 0,
            tackles:      s.tackles       ?? 0,
            interceptions:s.interceptions ?? 0,
            totalShots:   s.totalShots    ?? 0,
            shotsOnTarget:s.shotsOnTarget ?? 0,
            keyPasses:    s.keyPasses     ?? 0,
            successfulDribbles: s.successfulDribbles ?? 0,
          };
        } catch {
          return { id: p.id, name: p.name, position: p.position,
                   positionDetail: p.positionsDetailed?.[0] ?? null,
                   shirtNumber: p.shirtNumber ?? null, rating: null,
                   appearances: 0, minutesPlayed: 0, goals: 0, assists: 0, apps: 0,
                   yellowCards: 0, redCards: 0, saves: 0, cleanSheet: 0, goalsConceded: 0,
                   tackles: 0, interceptions: 0, totalShots: 0, shotsOnTarget: 0,
                   keyPasses: 0, successfulDribbles: 0 };
        }
      })
    );
    res.json(players);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── League standings ─────────────────────────────────────────────
app.get('/api/standings', async (req, res) => {
  try {
    const { tid, sid } = await resolveSofascoreIds();
    const r = await fetch(`${SOFASCORE}/unique-tournament/${tid}/season/${sid}/standings/total`, { headers: SC_HEADERS });
    const d = await r.json();
    // Group 0 = Championship Round (6), Group 1 = Relegation Round (8), Group 2 = Full league (14)
    const allGroups  = d.standings || [];
    const fullGroup  = allGroups.find(g => g.rows?.length >= 14) || allGroups[0];
    const rows = (fullGroup?.rows || []).map(row => ({
      position: row.position,
      teamName: row.team.name,
      teamId:   row.team.id,
      played:   row.matches,
      wins:     row.wins,
      draws:    row.draws,
      losses:   row.losses,
      gf:       row.scoresFor,
      ga:       row.scoresAgainst,
      points:   row.points,
    }));
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Match details: goals + lineups ──────────────────────────────
app.get('/api/match/:id/lineups-only', async (req, res) => {
  try {
    const { id } = req.params;
    const linR = await fetch(`${SOFASCORE}/event/${id}/lineups`, { headers: SC_HEADERS }).then(r => r.json());
    if (linR.error) return res.status(404).json({ available: false });

    const processTeam = team => team ? {
      formation: team.formation || '',
      confirmed: team.confirmed ?? false,
      starters: (team.players || [])
        .filter(p => !p.substitute)
        .map(p => ({
          id:       p.player.id,
          name:     p.player.name,
          nameHe:   null,
          rating:   null,
          position: p.position,
          number:   p.shirtNumber,
          subOff:   null,
        })),
    } : null;

    res.json({
      available: true,
      home: processTeam(linR.home),
      away: processTeam(linR.away),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/match/:id/details', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch Sofascore data + event metadata in parallel
    const [incR, linR, evR] = await Promise.all([
      fetch(`${SOFASCORE}/event/${id}/incidents`, { headers: SC_HEADERS }).then(r => r.json()),
      fetch(`${SOFASCORE}/event/${id}/lineups`,   { headers: SC_HEADERS }).then(r => r.json()),
      fetch(`${SOFASCORE}/event/${id}`,           { headers: SC_HEADERS }).then(r => r.json()),
    ]);

    // Build Hebrew names + ratings from 365scores (fails gracefully)
    const ev      = evR.event;
    const data365 = ev
      ? await get365Data(ev.startTimestamp, ev.homeTeam.name, ev.awayTeam.name)
      : null;

    // Hebrew name lookup for all players (starters + substitutes) by player id
    const playerHeMap = {};
    for (const [side, team] of [['home', linR.home], ['away', linR.away]]) {
      for (const p of (team?.players || [])) {
        const nameHe = data365?.nameMap?.[`${side}-${p.shirtNumber}`] || null;
        if (nameHe) playerHeMap[p.player.id] = nameHe;
      }
    }

    const subsOff = {};
    const events  = [];

    for (const i of (incR.incidents || [])) {
      if (i.incidentType === 'goal') {
        const ev = {
          type:      'goal',
          isHome:    i.isHome,
          time:      i.time,
          addedTime: i.addedTime || 0,
          player:    i.player?.name || '?',
          playerHe:  i.player?.id ? (playerHeMap[i.player.id] || null) : null,
          ownGoal:   i.incidentClass === 'ownGoal',
          penalty:   i.incidentClass === 'penalty',
        };
        events.push(ev);
      } else if (i.incidentType === 'substitution') {
        const subData = {
          time:        i.time,
          addedTime:   i.addedTime || 0,
          subInName:   i.playerIn?.name || null,
          subInNameHe: i.playerIn?.id ? (playerHeMap[i.playerIn.id] || null) : null,
        };
        if (i.playerOut?.id) subsOff[i.playerOut.id] = subData;
        events.push({
          type:        'substitution',
          isHome:      i.isHome,
          time:        i.time,
          addedTime:   i.addedTime || 0,
          playerOut:   i.playerOut?.name || '?',
          playerOutHe: i.playerOut?.id ? (playerHeMap[i.playerOut.id] || null) : null,
          playerIn:    i.playerIn?.name  || '?',
          playerInHe:  i.playerIn?.id  ? (playerHeMap[i.playerIn.id]  || null) : null,
        });
      } else if (i.incidentType === 'card') {
        events.push({
          type:      'card',
          isHome:    i.isHome,
          time:      i.time,
          addedTime: i.addedTime || 0,
          player:    i.player?.name || '?',
          playerHe:  i.player?.id ? (playerHeMap[i.player.id] || null) : null,
          cardClass: i.incidentClass, // 'yellow' | 'red' | 'yellowRed'
        });
      }
    }

    events.sort((a, b) => (a.time - b.time) || (a.addedTime - b.addedTime));

    const processTeam = (team, side) => team ? {
      formation: team.formation || '',
      starters: (team.players || [])
        .filter(p => !p.substitute)
        .map(p => ({
          id:       p.player.id,
          name:     p.player.name,
          nameHe:   data365?.nameMap?.[`${side}-${p.shirtNumber}`]   || null,
          rating:   data365?.ratingMap?.[`${side}-${p.shirtNumber}`] || null,
          position: p.position,
          number:   p.shirtNumber,
          subOff:   subsOff[p.player.id] || null,
        })),
    } : null;

    res.json({
      events,
      home: processTeam(linR.home, 'home'),
      away: processTeam(linR.away, 'away'),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
