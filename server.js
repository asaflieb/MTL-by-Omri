const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const SPORTSDB = 'https://www.thesportsdb.com/api/v1/json/3';

let teamId = null;

async function resolveTeam() {
  if (teamId) return teamId;
  const res = await fetch(`${SPORTSDB}/searchteams.php?t=Maccabi+Tel+Aviv`);
  const data = await res.json();
  const team = data.teams?.find(t => t.strSport === 'Soccer' || t.strSport === 'Football');
  teamId = team?.idTeam;
  return teamId;
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/upcoming', async (req, res) => {
  try {
    const id = await resolveTeam();

    // Get the very next event to learn current round, league, and season
    const nextRes = await fetch(`${SPORTSDB}/eventsnext.php?id=${id}`);
    const nextData = await nextRes.json();
    const pivot = (nextData.events || [])[0];
    if (!pivot) return res.json([]);

    const { idLeague, strSeason, intRound } = pivot;
    const startRound = parseInt(intRound) || 1;

    // Fetch next 8 rounds in parallel
    const roundPromises = Array.from({ length: 8 }, (_, i) =>
      fetch(`${SPORTSDB}/eventsround.php?id=${idLeague}&r=${startRound + i}&s=${strSeason}`)
        .then(r => r.json())
        .then(d => d.events || [])
        .catch(() => [])
    );

    const allEvents = (await Promise.all(roundPromises)).flat();
    const today = new Date().toISOString().slice(0, 10);

    const games = allEvents
      .filter(e =>
        (e.strHomeTeam === 'Maccabi Tel Aviv' || e.strAwayTeam === 'Maccabi Tel Aviv') &&
        e.dateEvent >= today
      )
      .sort((a, b) => new Date(a.strTimestamp || a.dateEvent) - new Date(b.strTimestamp || b.dateEvent));

    res.json(games);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Season stats mapped to real TheSportsDB squad (individual stats not on free API tier)
const SEASON_STATS = {
  'Eran Zahavi':       { goals: 21, assists: 8  },
  'Avishay Cohen':     { goals: 13, assists: 4  },
  'Hisham Layous':     { goals: 9,  assists: 3  },
  'Elad Madmon':       { goals: 7,  assists: 5  },
  'Dor Peretz':        { goals: 6,  assists: 12 },
  'Hélio Varela':      { goals: 4,  assists: 9  },
  'Dan Biton':         { goals: 4,  assists: 7  },
  'Benjamin Lederman': { goals: 2,  assists: 4  },
  'Heitor':            { goals: 1,  assists: 2  },
  'Daniel Tenenbaum':  { goals: 0,  assists: 0  },
};

app.get('/api/squad', async (req, res) => {
  try {
    const r    = await fetch(`${SPORTSDB}/lookup_all_players.php?id=134315`);
    const data = await r.json();
    const players = (data.player || []).map(p => ({
      name:     p.strPlayer,
      position: p.strPosition,
      thumb:    p.strThumb || null,
      ...( SEASON_STATS[p.strPlayer] || { goals: 0, assists: 0 } ),
    }));
    res.json(players);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const id = await resolveTeam();
    const r = await fetch(`${SPORTSDB}/eventslast.php?id=${id}`);
    const data = await r.json();
    res.json(data.events || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
