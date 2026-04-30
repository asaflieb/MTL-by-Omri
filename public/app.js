const MACCABI_EN = 'Maccabi Tel Aviv';

const HE_TEAMS = {
  'Maccabi Tel Aviv':    'מכבי תל אביב',
  'Hapoel Beer Sheva':   'הפועל ב"ש',
  "Hapoel Be'er Sheva":  'הפועל ב"ש',
  'Maccabi Haifa':       'מכבי חיפה',
  'Beitar Jerusalem':    'בית"ר ירושלים',
  'Hapoel Tel Aviv':     'הפועל ת"א',
  'Hapoel Tel-Aviv':     'הפועל ת"א',
  'Hapoel Haifa':        'הפועל חיפה',
  'Hapoel Petah Tikva':  'הפועל פ"ת',
  'Maccabi Petah Tikva': 'מכבי פ"ת',
  'Bnei Sakhnin':        'בני סכנין',
  'Bnei Yehuda':         'בני יהודה',
  'Ashdod FC':           'מ.ס. אשדוד',
  'FC Ashdod':           'מ.ס. אשדוד',
  'Hapoel Hadera':       'הפועל חדרה',
  'Ironi Kiryat Shmona': 'איר. קרית שמונה',
  'Maccabi Netanya':     'מכבי נתניה',
  'Hapoel Jerusalem':    'הפועל ירושלים',
  'Ironi Tiberias':      'איר. טבריה',
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
  return { day, full: `${d.getDate()} ב${month}`, time };
}

function logoImg(badgeUrl, teamName, size) {
  if (!badgeUrl) return '';
  const cls = size === 'lg' ? 'team-logo-lg' : 'team-logo';
  return `<img src="${badgeUrl}" alt="${heTeam(teamName)}" class="${cls}" onerror="this.classList.add('hidden')">`;
}

// ─── FEATURED CARD ────────────────────────────────────────────────
function renderFeatured(ev) {
  const { day, full, time } = formatDate(
    ev.dateEventLocal || ev.dateEvent,
    ev.strTimeLocal  || ev.strTime
  );
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

// ─── REGULAR GAME CARD ────────────────────────────────────────────
function renderGameCard(ev) {
  const { day, full, time } = formatDate(
    ev.dateEventLocal || ev.dateEvent,
    ev.strTimeLocal  || ev.strTime
  );
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

// ─── CAROUSEL ────────────────────────────────────────────────────
let slideIdx = 0;

function getVisible() {
  return window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1;
}

function carouselNav(dir) {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  const cards = [...track.querySelectorAll('.game-card')];
  if (!cards.length) return;

  const visible = getVisible();
  const maxIdx  = Math.max(0, cards.length - visible);

  slideIdx = dir === 'next'
    ? Math.min(slideIdx + 1, maxIdx)
    : Math.max(slideIdx - 1, 0);

  const cardW = cards[0].getBoundingClientRect().width + 20;
  track.style.transform = `translateX(-${slideIdx * cardW}px)`;

  document.getElementById('car-prev').disabled = slideIdx === 0;
  document.getElementById('car-next').disabled = slideIdx >= maxIdx;
}

function renderCarousel(events) {
  if (!events.length) return '';
  slideIdx = 0;

  setTimeout(() => {
    const track = document.getElementById('carousel-track');
    const next  = document.getElementById('car-next');
    if (track && next) {
      next.disabled = track.querySelectorAll('.game-card').length <= getVisible();
    }
  }, 0);

  return `
    <div class="carousel-wrap">
      <button class="car-btn" id="car-prev" onclick="carouselNav('prev')" disabled>›</button>
      <div class="carousel-viewport">
        <div class="carousel-track" id="carousel-track">
          ${events.map(renderGameCard).join('')}
        </div>
      </div>
      <button class="car-btn" id="car-next" onclick="carouselNav('next')">‹</button>
    </div>`;
}

window.addEventListener('resize', () => {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  slideIdx = 0;
  track.style.transform = 'translateX(0)';
  const cards = track.querySelectorAll('.game-card');
  const prev  = document.getElementById('car-prev');
  const next  = document.getElementById('car-next');
  if (prev) prev.disabled = true;
  if (next) next.disabled = cards.length <= getVisible();
});

// ─── RESULTS CARD ─────────────────────────────────────────────────
function outcome(ev) {
  const home = parseInt(ev.intHomeScore);
  const away = parseInt(ev.intAwayScore);
  if (isNaN(home) || isNaN(away)) return 'draw';
  const isMaccabiHome = ev.strHomeTeam === MACCABI_EN;
  if (home === away) return 'draw';
  return (isMaccabiHome ? home > away : away > home) ? 'win' : 'loss';
}

function renderResult(ev) {
  const oc = outcome(ev);
  const labels = { win: 'ניצחון', draw: 'תיקו', loss: 'הפסד' };
  const d = new Date(ev.dateEvent + 'T00:00:00');
  const dateLabel = `${d.getDate()} ${HE_MONTHS[d.getMonth()]}`;
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

// ─── DATA LOADING ─────────────────────────────────────────────────
function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function loading(id, dark) {
  setHtml(id, `<div class="${dark ? 'loading-msg-dark' : 'loading-msg'}">⏳ טוען...</div>`);
}

async function loadUpcoming() {
  loading('upcoming-featured');
  setHtml('upcoming-grid', '');
  try {
    const res    = await fetch('/api/upcoming');
    const events = await res.json();

    if (!Array.isArray(events) || events.length === 0) {
      setHtml('upcoming-featured', '<div class="no-data-msg">אין משחקים קרובים</div>');
      return;
    }
    const [first, ...rest] = events;
    setHtml('upcoming-featured', renderFeatured(first));
    setHtml('upcoming-grid', renderCarousel(rest));
  } catch {
    setHtml('upcoming-featured', '<div class="error-msg">⚠️ שגיאה בטעינת משחקים קרובים</div>');
  }
}

async function loadResults() {
  loading('results-list', true);
  try {
    const res    = await fetch('/api/results');
    const events = await res.json();

    if (!Array.isArray(events) || events.length === 0) {
      setHtml('results-list', '<div class="no-data-msg-dark">אין תוצאות</div>');
      return;
    }
    setHtml('results-list', events.map(renderResult).join(''));
  } catch {
    setHtml('results-list', '<div class="error-msg">⚠️ שגיאה בטעינת תוצאות</div>');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadUpcoming();
  loadResults();
});
