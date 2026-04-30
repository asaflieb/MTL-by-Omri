const MACCABI_EN = 'Maccabi Tel Aviv';

const HE_TEAMS = {
  'Maccabi Tel Aviv':      'מכבי תל אביב',
  'Hapoel Beer Sheva':     'הפועל באר שבע',
  'Maccabi Haifa':         'מכבי חיפה',
  'Beitar Jerusalem':      'בית"ר ירושלים',
  'Hapoel Tel Aviv':       'הפועל תל אביב',
  'Hapoel Haifa':          'הפועל חיפה',
  'Bnei Sakhnin':          'בני סכנין',
  'Bnei Yehuda':           'בני יהודה',
  'Ashdod FC':             'מ.ס. אשדוד',
  'FC Ashdod':             'מ.ס. אשדוד',
  'Hapoel Hadera':         'הפועל חדרה',
  'Ironi Kiryat Shmona':   'איר. קרית שמונה',
  'Maccabi Netanya':       'מכבי נתניה',
  'Hapoel Jerusalem':      'הפועל ירושלים',
  'Ironi Tiberias':        'איר. טבריה',
  'Maccabi Petah Tikva':   'מכבי פ"ת',
};

const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HE_DAYS   = ['יום א׳','יום ב׳','יום ג׳','יום ד׳','יום ה׳','יום ו׳','שבת'];

function heTeam(name) {
  return HE_TEAMS[name] || name;
}

function formatDate(dateStr, timeStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day   = HE_DAYS[d.getDay()];
  const month = HE_MONTHS[d.getMonth()];
  const time  = timeStr ? timeStr.slice(0, 5) : null;
  return { day, full: `${d.getDate()} ב${month} ${d.getFullYear()}`, time };
}

function logoImg(badgeUrl, teamName, size) {
  const cls = size === 'lg' ? 'team-logo-lg' : 'team-logo';
  const alt = heTeam(teamName);
  if (badgeUrl) {
    return `<img src="${badgeUrl}" alt="${alt}" class="${cls}" onerror="this.classList.add('hidden')">`;
  }
  return '';
}

function renderFeatured(ev) {
  const { day, full, time } = formatDate(ev.dateEventLocal || ev.dateEvent, ev.strTimeLocal || ev.strTime);
  return `
    <div class="game-card game-card-featured">
      <div class="featured-label">⚡ המשחק הבא</div>
      <div class="featured-body">
        <div class="featured-date">${day} · ${full}${time ? ' · ' + time : ''}</div>
        <div class="featured-teams">
          <div class="featured-team">
            ${logoImg(ev.strHomeTeamBadge, ev.strHomeTeam, 'lg')}
            <span class="featured-team-name">${heTeam(ev.strHomeTeam)}</span>
          </div>
          <div class="featured-vs">VS</div>
          <div class="featured-team">
            ${logoImg(ev.strAwayTeamBadge, ev.strAwayTeam, 'lg')}
            <span class="featured-team-name">${heTeam(ev.strAwayTeam)}</span>
          </div>
        </div>
        ${ev.strVenue ? `<div class="featured-venue">🏟️ ${ev.strVenue}</div>` : ''}
      </div>
    </div>`;
}

function renderGameCard(ev) {
  const { day, full, time } = formatDate(ev.dateEventLocal || ev.dateEvent, ev.strTimeLocal || ev.strTime);
  return `
    <div class="game-card">
      <div class="game-date">${day} · ${full}</div>
      <div class="game-teams">
        <div class="team">
          ${logoImg(ev.strHomeTeamBadge, ev.strHomeTeam, 'sm')}
          <span>${heTeam(ev.strHomeTeam)}</span>
        </div>
        <div class="vs">VS</div>
        <div class="team">
          ${logoImg(ev.strAwayTeamBadge, ev.strAwayTeam, 'sm')}
          <span>${heTeam(ev.strAwayTeam)}</span>
        </div>
      </div>
      <div class="game-info">🏟️ ${ev.strVenue || ''}${time ? ' · ' + time : ''}</div>
    </div>`;
}

function outcome(ev) {
  const home = parseInt(ev.intHomeScore);
  const away = parseInt(ev.intAwayScore);
  if (isNaN(home) || isNaN(away)) return 'draw';
  const maccabiIsHome = ev.strHomeTeam === MACCABI_EN;
  if (home === away) return 'draw';
  if ((maccabiIsHome && home > away) || (!maccabiIsHome && away > home)) return 'win';
  return 'loss';
}

function renderResult(ev) {
  const oc = outcome(ev);
  const labels = { win: 'ניצחון', draw: 'תיקו', loss: 'הפסד' };
  const d = new Date(ev.dateEvent + 'T00:00:00');
  const dateLabel = `${d.getDate()} ${HE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  return `
    <div class="result-card ${oc}">
      <div class="result-date">${dateLabel}</div>
      <div class="result-teams">
        <div class="result-team-group">
          ${logoImg(ev.strHomeTeamBadge, ev.strHomeTeam, 'sm')}
          <span class="result-team">${heTeam(ev.strHomeTeam)}</span>
        </div>
        <div class="result-score">
          <span class="score-num">${ev.intHomeScore ?? '?'}</span>
          <span class="score-sep">—</span>
          <span class="score-num">${ev.intAwayScore ?? '?'}</span>
        </div>
        <div class="result-team-group">
          ${logoImg(ev.strAwayTeamBadge, ev.strAwayTeam, 'sm')}
          <span class="result-team">${heTeam(ev.strAwayTeam)}</span>
        </div>
      </div>
      <div class="result-badge ${oc}-badge">${labels[oc]}</div>
    </div>`;
}

function setHtml(id, html) {
  document.getElementById(id).innerHTML = html;
}

function loading(id) {
  setHtml(id, '<div class="loading-msg">⏳ טוען...</div>');
}

async function loadUpcoming() {
  loading('upcoming-featured');
  document.getElementById('upcoming-grid').innerHTML = '';
  try {
    const res = await fetch('/api/upcoming');
    const events = await res.json();
    if (!Array.isArray(events) || events.length === 0) {
      setHtml('upcoming-featured', '<div class="no-data-msg">אין משחקים קרובים כרגע</div>');
      return;
    }
    const [first, ...rest] = events;
    setHtml('upcoming-featured', renderFeatured(first));
    setHtml('upcoming-grid', rest.map(renderGameCard).join(''));
  } catch {
    setHtml('upcoming-featured', '<div class="error-msg">⚠️ לא ניתן לטעון משחקים קרובים</div>');
  }
}

async function loadResults() {
  loading('results-list');
  try {
    const res = await fetch('/api/results');
    const events = await res.json();
    if (!Array.isArray(events) || events.length === 0) {
      setHtml('results-list', '<div class="no-data-msg">אין תוצאות</div>');
      return;
    }
    setHtml('results-list', events.map(renderResult).join(''));
  } catch {
    setHtml('results-list', '<div class="error-msg">⚠️ לא ניתן לטעון תוצאות</div>');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadUpcoming();
  loadResults();
});
