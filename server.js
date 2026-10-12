const express = require('express');
const path    = require('path');
const { get365, TTL, MACCABI_ID, LEAGUE_ID, athleteImage, competitorImage } = require('./lib/s365');

const app  = express();
const PORT = 3000;

// ─── Helpers ──────────────────────────────────────────────────────

// Israel-local date ('YYYY-MM-DD') and time ('HH:MM:00') for an ISO timestamp
const IL_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Jerusalem',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
function israelDateTime(iso) {
  const parts = Object.fromEntries(IL_FMT.formatToParts(new Date(iso)).map(p => [p.type, p.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:00`,
  };
}

const FRIENDLY_COMPETITION_ID = 321;

// competitionId → currentSeasonNum, collected from the `competitions` meta of games responses
function seasonMap(...responses) {
  const map = {};
  for (const r of responses) for (const c of (r.competitions || [])) map[c.id] = c.currentSeasonNum;
  return map;
}

function isFriendly(g, seasons) {
  return g.competitionId === FRIENDLY_COMPETITION_ID || !(seasons[g.competitionId] > 0);
}

function isCurrentSeason(g, seasons) {
  return !isFriendly(g, seasons) && g.seasonNum === seasons[g.competitionId];
}

const score = s => (s == null || s < 0 ? null : s);

// 365scores game → frontend shape
function toGame(g, venue = null) {
  const { date, time } = israelDateTime(g.startTime);
  return {
    idEvent:          String(g.id),
    strHomeTeam:      g.homeCompetitor.name,
    strAwayTeam:      g.awayCompetitor.name,
    strHomeTeamBadge: competitorImage(g.homeCompetitor.id),
    strAwayTeamBadge: competitorImage(g.awayCompetitor.id),
    dateEvent:        date,
    strTime:          time,
    strVenue:         venue,
    intHomeScore:     score(g.homeCompetitor.score),
    intAwayScore:     score(g.awayCompetitor.score),
    strStatus:        g.statusText || '',
    strLeague:        g.competitionDisplayName || '',
  };
}

const getGame = (id, ttl) => get365('game', `gameId=${encodeURIComponent(id)}`, ttl).then(d => d.game);

app.use(express.static(path.join(__dirname, 'public')));

// ─── Season label ─────────────────────────────────────────────────
app.get('/api/season', async (req, res) => {
  try {
    const d    = await get365('standings', `competitions=${LEAGUE_ID}`);
    const comp = d.competitions?.find(c => c.id === LEAGUE_ID);
    const name = comp?.seasons?.find(s => s.num === comp.currentSeasonNum)?.name || '';
    // '2026/2027' → '2026/27'
    const label = name.replace(/^(\d{4})\/\d{2}(\d{2})$/, '$1/$2');
    res.json({ label });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Upcoming fixtures ────────────────────────────────────────────
app.get('/api/upcoming', async (req, res) => {
  try {
    const d       = await get365('games/fixtures', `competitors=${MACCABI_ID}`, TTL.short);
    const seasons = seasonMap(d);
    const games   = (d.games || [])
      .filter(g => g.statusGroup !== 4 && !isFriendly(g, seasons))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Venue is only available on the game endpoint — fetch it for the featured (first) game
    const venue = games[0]
      ? await getGame(games[0].id, TTL.medium).then(g => g?.venue?.name || null).catch(() => null)
      : null;

    res.json(games.map((g, i) => toGame(g, i === 0 ? venue : null)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Season results (all official competitions, no friendlies) ───
const MAX_RESULT_PAGES = 8;

app.get('/api/results-all', async (req, res) => {
  try {
    let page = await get365('games/results', `competitors=${MACCABI_ID}`);
    const pages = [page];
    // Pages go back in time; keep going while the page still has current-season games
    while (pages.length < MAX_RESULT_PAGES && page.paging?.previousPage) {
      const seasons = seasonMap(...pages);
      if (!(page.games || []).some(g => isCurrentSeason(g, seasons))) break;
      page = await get365(page.paging.previousPage);
      if (!page.games?.length) break;
      pages.push(page);
    }

    const seasons = seasonMap(...pages);
    const byId    = new Map();
    for (const p of pages) for (const g of (p.games || [])) byId.set(g.id, g);

    const games = [...byId.values()]
      .filter(g => g.statusGroup === 4 && isCurrentSeason(g, seasons))
      .sort((a, b) => b.startTime.localeCompare(a.startTime))
      .map(g => toGame(g));
    res.json(games);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Squad + league season stats ─────────────────────────────────
const POSITION_LETTER = { 1: 'G', 2: 'D', 3: 'M', 4: 'F' };

// highlightStats type ids → our field names
const STAT_TYPES = {
  5:   'appearances',
  1:   'goals',
  2:   'assists',
  54:  'rating',
  3:   'yellowCards',
  4:   'redCards',
  223: 'totalShots',
  35:  'shotsOnTarget',
  222: 'minutesPlayed',
  25:  'cleanSheet',
  26:  'saves',
  29:  'goalsConceded',
};

// '6/6' → 6, '8(3פנ׳)' → 8, '8.0' → 8, '-' → null
function statNumber(v) {
  const m = String(v ?? '').match(/^-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

app.get('/api/squad', async (req, res) => {
  try {
    const sq       = await get365('squads', `competitors=${MACCABI_ID}`);
    const athletes = (sq.squads?.[0]?.athletes || []).filter(a => POSITION_LETTER[a.position?.id]);

    const ids     = athletes.map(a => a.id).join(',');
    const details = ids
      ? await get365('athletes', `athletes=${ids}&fullDetails=true`).catch(() => ({ athletes: [] }))
      : { athletes: [] };
    const detailById = new Map((details.athletes || []).map(a => [a.id, a]));

    const players = athletes.map(a => {
      const league = detailById.get(a.id)?.highlightStats
        ?.find(h => h.competitionId === LEAGUE_ID);
      const stats = {};
      for (const s of (league?.stats || [])) {
        const key = STAT_TYPES[s.type];
        if (key) stats[key] = statNumber(s.value);
      }
      return {
        id:            a.id,
        name:          a.name,
        shortName:     a.shortName || a.name,
        photo:         athleteImage(a.id),
        position:      POSITION_LETTER[a.position.id],
        positionName:  a.formationPosition?.name || a.position?.name || null,
        shirtNumber:   a.jerseyNum > 0 ? a.jerseyNum : null,
        rating:        stats.rating ?? null,
        appearances:   stats.appearances   ?? 0,
        minutesPlayed: stats.minutesPlayed ?? null,
        goals:         stats.goals         ?? 0,
        assists:       stats.assists       ?? 0,
        yellowCards:   stats.yellowCards   ?? null,
        redCards:      stats.redCards      ?? null,
        totalShots:    stats.totalShots    ?? null,
        shotsOnTarget: stats.shotsOnTarget ?? null,
        saves:         stats.saves         ?? null,
        cleanSheet:    stats.cleanSheet    ?? null,
        goalsConceded: stats.goalsConceded ?? null,
      };
    });
    res.json(players);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── League standings ─────────────────────────────────────────────
app.get('/api/standings', async (req, res) => {
  try {
    const d = await get365('standings', `competitions=${LEAGUE_ID}`);
    // After the split there may be several groups — show the largest table
    const table = (d.standings || []).reduce((best, s) =>
      (s.rows?.length || 0) > (best?.rows?.length || 0) ? s : best, null);
    const rows = (table?.rows || []).map(row => ({
      position: row.position,
      teamName: row.competitor.name,
      teamId:   row.competitor.id,
      teamLogo: competitorImage(row.competitor.id),
      played:   row.gamePlayed,
      wins:     row.gamesWon,
      draws:    row.gamesEven,
      losses:   row.gamesLost,
      gf:       row.for,
      ga:       row.against,
      points:   row.points,
    }));
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Match details: events + lineups ─────────────────────────────
const EVENT_GOAL = 1, EVENT_YELLOW = 2, EVENT_RED = 3, EVENT_SUB = 1000;
const GOAL_OWN = 2, GOAL_PENALTY = 3, RED_SECOND_YELLOW = 21;

const STARTING = 1;

function lineupTeam(competitor, membersById, subsOff) {
  const lineup = competitor?.lineups;
  const starters = (lineup?.members || []).filter(m => m.status === STARTING);
  if (!starters.length) return null;

  // Order back-to-front (line), then right-to-left (fieldSide 100 = right) for RTL rows
  starters.sort((a, b) =>
    (a.yardFormation?.line ?? 0) - (b.yardFormation?.line ?? 0) ||
    (b.yardFormation?.fieldSide ?? 0) - (a.yardFormation?.fieldSide ?? 0));

  return {
    formation: lineup.formation || '',
    confirmed: lineup.status === 'מאושר',
    starters: starters.map(m => {
      const mem = membersById[m.id] || {};
      return {
        id:       mem.athleteId ?? m.id,
        name:     mem.name || '?',               // full name — used to match goals/subs
        nameHe:   mem.shortName || mem.name || null, // short display name for the pitch
        photo:    mem.athleteId ? athleteImage(mem.athleteId) : null,
        rating:   m.ranking > 0 ? m.ranking : null,
        position: POSITION_LETTER[m.position?.id] || null,
        number:   mem.jerseyNumber > 0 ? mem.jerseyNumber : null,
        subOff:   subsOff[m.id] || null,
      };
    }),
  };
}

app.get('/api/match/:id/details', async (req, res) => {
  try {
    const g = await getGame(req.params.id, TTL.short);
    if (!g) return res.status(404).json({ error: 'not found' });

    const membersById = Object.fromEntries((g.members || []).map(m => [m.id, m]));
    const nameOf      = id => membersById[id]?.name || '?';
    const homeId      = g.homeCompetitor.id;

    const subsOff = {};
    const events  = [];

    for (const e of (g.events || [])) {
      const base = {
        isHome:    e.competitorId === homeId,
        time:      e.gameTime,
        addedTime: e.addedTime || 0,
      };
      const typeId = e.eventType?.id;
      const subId  = e.eventType?.subTypeId;

      if (typeId === EVENT_GOAL) {
        events.push({
          ...base,
          type:     'goal',
          player:   nameOf(e.playerId),
          playerHe: nameOf(e.playerId),
          ownGoal:  subId === GOAL_OWN,
          penalty:  subId === GOAL_PENALTY,
        });
      } else if (typeId === EVENT_SUB) {
        // playerId = coming on, extraPlayers[0] = going off
        const inId  = e.playerId;
        const outId = e.extraPlayers?.[0];
        if (outId) {
          const inAthleteId = membersById[inId]?.athleteId;
          subsOff[outId] = {
            time:        e.gameTime,
            addedTime:   e.addedTime || 0,
            subInName:   nameOf(inId),
            subInNameHe: nameOf(inId),
            subInPhoto:  inAthleteId ? athleteImage(inAthleteId) : null,
          };
        }
        events.push({
          ...base,
          type:        'substitution',
          playerOut:   nameOf(outId),
          playerOutHe: nameOf(outId),
          playerIn:    nameOf(inId),
          playerInHe:  nameOf(inId),
        });
      } else if (typeId === EVENT_YELLOW || typeId === EVENT_RED) {
        events.push({
          ...base,
          type:      'card',
          player:    nameOf(e.playerId),
          playerHe:  nameOf(e.playerId),
          cardClass: typeId === EVENT_YELLOW ? 'yellow'
                   : subId === RED_SECOND_YELLOW ? 'yellowRed' : 'red',
        });
      }
    }

    events.sort((a, b) => (a.time - b.time) || (a.addedTime - b.addedTime));

    res.json({
      events,
      home: lineupTeam(g.homeCompetitor, membersById, subsOff),
      away: lineupTeam(g.awayCompetitor, membersById, subsOff),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/match/:id/lineups-only', async (req, res) => {
  try {
    const g = await getGame(req.params.id, TTL.short);
    const membersById = Object.fromEntries((g?.members || []).map(m => [m.id, m]));
    const home = lineupTeam(g?.homeCompetitor, membersById, {});
    const away = lineupTeam(g?.awayCompetitor, membersById, {});
    if (!home || !away) return res.json({ available: false });
    res.json({ available: true, home, away });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
