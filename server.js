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
