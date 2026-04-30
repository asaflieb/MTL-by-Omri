const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const SPORTSDB = 'https://www.thesportsdb.com/api/v1/json/3';

let teamId = null;

async function resolveTeamId() {
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
    const id = await resolveTeamId();
    const r = await fetch(`${SPORTSDB}/eventsnext.php?id=${id}`);
    const data = await r.json();
    res.json(data.events || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const id = await resolveTeamId();
    const r = await fetch(`${SPORTSDB}/eventslast.php?id=${id}`);
    const data = await r.json();
    res.json(data.events || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
