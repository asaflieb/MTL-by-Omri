const MACCABI = 'מכבי תל אביב';

const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HE_DAYS   = ['יום א׳','יום ב׳','יום ג׳','יום ד׳','יום ה׳','יום ו׳','שבת'];

// Escape text for safe use inside HTML attributes (team names contain quotes, e.g. בית"ר)
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Fetch JSON from our API; a non-2xx response throws so callers show their error state
async function getJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.json();
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
  return `<img src="${badgeUrl}" alt="${esc(teamName)}" class="${cls}" onerror="this.classList.add('hidden')">`;
}

// ─── FEATURED CARD ────────────────────────────────────────────────
function renderFeatured(ev) {
  const { day, full, time } = formatDate(
    ev.dateEventLocal || ev.dateEvent,
    ev.strTimeLocal  || ev.strTime
  );
  const kickoffStr = `${ev.dateEvent}T${ev.strTime || '00:00:00'}`;
  return `
    <div class="featured-wrapper">
      <div class="game-card game-card-featured" data-kickoff="${kickoffStr}">
        <div class="featured-label">⚡ המשחק הבא</div>
        <div class="featured-body">
          <div class="featured-datetime">
            <span class="featured-dt-day">${day}</span>
            <span class="featured-dt-date">${full}</span>
          </div>
          <div class="featured-time-row">
            ${time ? `<span class="featured-dt-time">${time}</span>` : ''}
            <div class="featured-countdown" id="featured-countdown">…</div>
          </div>
          <div class="featured-teams">
            <div class="featured-team">
              ${logoImg(ev.strHomeTeamBadge, ev.strHomeTeam, 'lg')}
              <span class="featured-team-name">${ev.strHomeTeam}</span>
            </div>
            <div class="featured-vs">VS</div>
            <div class="featured-team">
              ${logoImg(ev.strAwayTeamBadge, ev.strAwayTeam, 'lg')}
              <span class="featured-team-name">${ev.strAwayTeam}</span>
            </div>
          </div>
          ${ev.strVenue ? `<div class="featured-venue">🏟️ ${ev.strVenue}</div>` : ''}
          <button class="lineup-toggle-btn"
                  data-id="${esc(ev.idEvent)}" data-home="${esc(ev.strHomeTeam)}" data-away="${esc(ev.strAwayTeam)}"
                  onclick="toggleUpcomingLineup(this)">
            הרכבים ▼
          </button>
        </div>
      </div>
      <div class="upcoming-lineup" id="upcoming-lineup-${ev.idEvent}"></div>
    </div>`;
}

async function toggleUpcomingLineup(btn) {
  const { id: eventId } = btn.dataset;
  const el = document.getElementById(`upcoming-lineup-${eventId}`);
  if (!el) return;

  if (el.classList.contains('open')) {
    el.classList.remove('open');
    btn.textContent = 'הרכבים ▼';
    return;
  }

  btn.textContent = 'הרכבים ▲';
  el.classList.add('open');

  // Only the official lineup is final — a predicted one is refetched on every open
  if (el.dataset.confirmed) return;
  if (!el.dataset.loaded)
    el.innerHTML = '<div class="loading-msg-dark" style="text-align:center;padding:20px">⏳ טוען הרכבים…</div>';
  await loadUpcomingLineup(btn, el);
}

const LINEUP_REFRESH_MS = 2 * 60 * 1000;

async function loadUpcomingLineup(btn, el) {
  const { id: eventId, home: homeTeam, away: awayTeam } = btn.dataset;
  try {
    const data = await getJson(`/api/match/${eventId}/lineups-only`);
    if (!data.available) {
      el.innerHTML = '<div class="lineup-unavailable">ההרכב טרם פורסם. בדרך כלל מתפרסם כשעה לפני המשחק.</div>';
    } else {
      const label = data.confirmed
        ? 'הרכב רשמי'
        : 'הרכב משוער (תחזית) · יתעדכן כשיפורסם ההרכב הרשמי';
      el.innerHTML = `<div class="lineup-status-label">${label}</div>` +
        renderPitch(data.home, data.away, homeTeam, awayTeam, []);
      if (data.confirmed) el.dataset.confirmed = '1';
    }
    el.dataset.loaded = '1';
  } catch {
    if (!el.dataset.loaded)
      el.innerHTML = '<div class="error-msg" style="margin:12px">⚠️ שגיאה בטעינת הרכבים</div>';
  }

  // While open and not yet official, keep checking for the official lineup
  clearTimeout(el._refresh);
  if (!el.dataset.confirmed)
    el._refresh = setTimeout(() => {
      if (el.classList.contains('open')) loadUpcomingLineup(btn, el);
    }, LINEUP_REFRESH_MS);
}

// ─── REGULAR GAME CARD ────────────────────────────────────────────
function renderGameCard(ev) {
  const { day, full, time } = formatDate(
    ev.dateEventLocal || ev.dateEvent,
    ev.strTimeLocal  || ev.strTime
  );
  const location = ev.strHomeTeam === MACCABI ? '🏠 ביתי' : '✈️ חוצות';
  return `
    <div class="game-card">
      <div class="game-date">${day} · ${full}</div>
      <div class="game-teams">
        <div class="team">
          ${logoImg(ev.strHomeTeamBadge, ev.strHomeTeam, 'sm')}
          <span>${ev.strHomeTeam}</span>
        </div>
        <div class="vs">VS</div>
        <div class="team">
          ${logoImg(ev.strAwayTeamBadge, ev.strAwayTeam, 'sm')}
          <span>${ev.strAwayTeam}</span>
        </div>
      </div>
      <div class="game-info">${location}${time ? ' · ' + time : ''}</div>
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
  // In RTL the following cards sit to the left, so the track moves right (+x) to reveal them
  const sign = getComputedStyle(track).direction === 'rtl' ? 1 : -1;
  track.style.transform = `translateX(${sign * slideIdx * cardW}px)`;

  document.getElementById('car-prev').disabled = slideIdx === 0;
  document.getElementById('car-next').disabled = slideIdx >= maxIdx;
}

// Swipe support for touch screens
function bindCarouselSwipe(viewport) {
  let startX = null, startY = null;
  viewport.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    startX = startY = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return; // tap or vertical scroll
    // Dragging content toward the reading direction's end reveals the next card:
    // in RTL that's a swipe to the right
    const rtl = getComputedStyle(viewport).direction === 'rtl';
    carouselNav((dx > 0) === rtl ? 'next' : 'prev');
  });
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
    const viewport = document.querySelector('.carousel-viewport');
    if (viewport) bindCarouselSwipe(viewport);
  }, 0);

  // SVG chevrons: text arrows (‹ ›) get mirrored by the browser in RTL and ended up pointing inward
  const chevron = side => `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="${side === 'right' ? '9 5 16 12 9 19' : '15 5 8 12 15 19'}"
      fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  // RTL: "prev" sits on the right and points right, "next" sits on the left and points left
  return `
    <div class="carousel-wrap">
      <button class="car-btn" id="car-prev" onclick="carouselNav('prev')" aria-label="המשחק הקודם" disabled>${chevron('right')}</button>
      <div class="carousel-viewport">
        <div class="carousel-track" id="carousel-track">
          ${events.map(renderGameCard).join('')}
        </div>
      </div>
      <button class="car-btn" id="car-next" onclick="carouselNav('next')" aria-label="המשחק הבא">${chevron('left')}</button>
    </div>`;
}

// Mobile browsers fire resize when the address bar shows/hides while scrolling —
// only reset the carousel when the width actually changes
let lastCarouselWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth === lastCarouselWidth) return;
  lastCarouselWidth = window.innerWidth;
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
  const isMaccabiHome = ev.strHomeTeam === MACCABI;
  if (home === away) return 'draw';
  return (isMaccabiHome ? home > away : away > home) ? 'win' : 'loss';
}

function renderResult(ev) {
  const oc = outcome(ev);
  const labels = { win: 'ניצחון', draw: 'תיקו', loss: 'הפסד' };
  const d = new Date(ev.dateEvent + 'T00:00:00');
  const dateLabel = `${d.getDate()} ${HE_MONTHS[d.getMonth()]}`;
  return `
    <div class="result-wrapper">
      <div class="result-card ${oc}"
           onclick="toggleMatchDetails('${ev.idEvent}', this)"
           data-home="${esc(ev.strHomeTeam)}"
           data-away="${esc(ev.strAwayTeam)}">
        <div class="result-date">${dateLabel}</div>
        <div class="result-teams">
          <div class="result-team-group">
            ${logoImg(ev.strHomeTeamBadge, ev.strHomeTeam, 'sm')}
            <span class="result-team">${ev.strHomeTeam}</span>
          </div>
          <div class="result-score">
            <span class="score-num">${ev.intHomeScore ?? '?'}</span>
            <span class="score-sep">—</span>
            <span class="score-num">${ev.intAwayScore ?? '?'}</span>
          </div>
          <div class="result-team-group">
            ${logoImg(ev.strAwayTeamBadge, ev.strAwayTeam, 'sm')}
            <span class="result-team">${ev.strAwayTeam}</span>
          </div>
        </div>
        <div class="result-badge ${oc}-badge">${labels[oc]}</div>
        <div class="expand-arrow">▼</div>
      </div>
      <div class="match-details" id="details-${ev.idEvent}"></div>
    </div>`;
}

// ─── MATCH DETAILS: GOALS + LINEUP ───────────────────────────────

function shortName(name, nameHe) {
  return nameHe || name;
}

function renderTimeline(events, homeTeam, awayTeam) {
  if (!events?.length) return '';

  const homeHe = homeTeam;
  const awayHe = awayTeam;

  function cellContent(ev) {
    if (ev.type === 'goal') {
      const name = shortName(ev.player, ev.playerHe);
      const tag  = ev.penalty ? ' (פנ׳)' : ev.ownGoal ? ' (אג)' : '';
      return `<span class="tl-goal">⚽ ${name}${tag}</span>`;
    }
    if (ev.type === 'substitution') {
      const out = shortName(ev.playerOut, ev.playerOutHe);
      const inn = shortName(ev.playerIn,  ev.playerInHe);
      return `<span class="tl-sub"><span class="tl-sub-out">⬇ ${out}</span><span class="tl-sub-in">⬆ ${inn}</span></span>`;
    }
    if (ev.type === 'card') {
      const name = shortName(ev.player, ev.playerHe);
      const icon = ev.cardClass === 'red' ? '🟥' : ev.cardClass === 'yellowRed' ? '🟨🟥' : '🟨';
      return `<span class="tl-card">${icon} ${name}</span>`;
    }
    return '';
  }

  const rows = events.map(ev => {
    const min = ev.addedTime ? `${ev.time}+${ev.addedTime}′` : `${ev.time}′`;
    const cell = cellContent(ev);
    if (!cell) return '';
    const homeCell = ev.isHome  ? `<td class="tl-home">${cell}</td>` : `<td class="tl-home tl-empty"></td>`;
    const awayCell = !ev.isHome ? `<td class="tl-away">${cell}</td>` : `<td class="tl-away tl-empty"></td>`;
    return `<tr>${homeCell}<td class="tl-min-cell">${min}</td>${awayCell}</tr>`;
  }).join('');

  return `<div class="timeline-wrap">
    <table class="timeline">
      <thead>
        <tr>
          <th class="tl-th-home">${homeHe}</th>
          <th class="tl-th-min"></th>
          <th class="tl-th-away">${awayHe}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function playerDot(p, isMaccabi, isMotm, goalCount, subInGoalCount = 0) {
  const name     = shortName(p.name, p.nameHe);
  const subInDisplay = p.subOff?.subInNameHe || p.subOff?.subInName || null;
  const subInAttr    = subInDisplay ? ` data-subin="${esc(subInDisplay)}"` : '';
  const subInPhotoAttr = p.subOff?.subInPhoto ? ` data-subinphoto="${esc(p.subOff.subInPhoto)}"` : '';
  const subInGoalAttr = subInGoalCount > 0 ? ` data-subingoals="${subInGoalCount}"` : '';
  const sub      = p.subOff
    ? `<span class="sub-off-label"${subInAttr}${subInPhotoAttr}${subInGoalAttr}>⬇ ${p.subOff.time}${p.subOff.addedTime ? '+' + p.subOff.addedTime : ''}′</span>`
    : '';
  const goalBadge = goalCount > 0
    ? `<span class="player-goal-badge">${goalCount > 1 ? `⚽×${goalCount}` : '⚽'}</span>`
    : '';
  return `<div class="player-dot ${isMaccabi ? 'maccabi' : 'opponent'}${isMotm ? ' motm' : ''}">
    <div class="player-photo-outer">
      <div class="player-photo-wrap">
        <img class="player-photo" src="${p.photo || ''}" alt="${esc(name)}"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="player-photo-fallback">${p.number || '?'}</div>
      </div>
      ${goalBadge}
    </div>
    <div class="dot-name">${name}${sub}</div>
  </div>`;
}

function parseFormationRows(starters, formationStr) {
  const gk       = starters.filter(p => p.position === 'G');
  const outfield  = starters.filter(p => p.position !== 'G');
  const counts   = (formationStr || '').split('-').map(Number).filter(n => n > 0);
  const total    = counts.reduce((a, b) => a + b, 0);
  let rows;
  if (counts.length && total === outfield.length) {
    let i = 0;
    rows = counts.map(c => { const r = outfield.slice(i, i + c); i += c; return r; });
  } else {
    rows = ['D', 'M', 'F'].map(pos => outfield.filter(p => p.position === pos)).filter(r => r.length);
  }
  return { gk, rows };
}

function renderMotmBanner(home, away) {
  if (!home?.starters?.length || !away?.starters?.length) return '';
  const bestRated = (starters) =>
    starters.reduce((best, p) => (p.rating || 0) > (best?.rating || 0) ? p : best, null);
  const motmHome = bestRated(home.starters);
  const motmAway = bestRated(away.starters);
  const overallMotm = (motmHome?.rating || 0) >= (motmAway?.rating || 0) ? motmHome : motmAway;
  if (!overallMotm || overallMotm.rating < 6) return '';
  const motmName = shortName(overallMotm.name, overallMotm.nameHe);
  return `<div class="motm-banner">
    <span class="motm-star">⭐</span>
    <span class="motm-title">שחקן המשחק</span>
    <span class="motm-name">${motmName}</span>
    <span class="motm-score">${overallMotm.rating.toFixed(1)}</span>
  </div>`;
}

function renderPitch(home, away, homeTeam, awayTeam, events) {
  if (!home?.starters?.length || !away?.starters?.length)
    return '<p class="no-lineup">הרכבים לא זמינים</p>';

  const isMaccabiHome = homeTeam === MACCABI;
  const { gk: hGK, rows: hRows } = parseFormationRows(home.starters, home.formation);
  const { gk: aGK, rows: aRows } = parseFormationRows(away.starters, away.formation);

  // Goal counts per player name (excluding own goals from scorer's count)
  const goalCounts = {};
  for (const g of (events || []).filter(e => e.type === 'goal')) {
    if (!g.ownGoal) {
      goalCounts[g.player] = (goalCounts[g.player] || 0) + 1;
    }
  }

  // Best-rated players for MOTM highlight on pitch
  const bestRated = (starters) =>
    starters.reduce((best, p) => (p.rating || 0) > (best?.rating || 0) ? p : best, null);
  const motmHome = bestRated(home.starters);
  const motmAway = bestRated(away.starters);
  const motmHomeId = motmHome?.rating >= 6 ? motmHome.id : null;
  const motmAwayId = motmAway?.rating >= 6 ? motmAway.id : null;

  const makeRows = (gk, rows, isMaccabi, isHome) => {
    const motmSet = new Set([motmHomeId, motmAwayId].filter(Boolean));
    const ordered = isHome ? [...[...rows].reverse(), gk] : [gk, ...rows];
    return ordered.map(row =>
      `<div class="pitch-row">${row.map(p =>
        playerDot(p, isMaccabi, motmSet.has(p.id), goalCounts[p.name] || 0, goalCounts[p.subOff?.subInName] || 0)
      ).join('')}</div>`
    ).join('');
  };

  const hLabel = home.formation ? `${homeTeam} · ${home.formation}` : homeTeam;
  const aLabel = away.formation ? `${awayTeam} · ${away.formation}` : awayTeam;

  return `<div class="pitch">
    <div class="pitch-team-label">${aLabel}</div>
    <div class="pitch-half">${makeRows(aGK, aRows, !isMaccabiHome, false)}</div>
    <div class="pitch-divider"></div>
    <div class="pitch-half">${makeRows(hGK, hRows, isMaccabiHome, true)}</div>
    <div class="pitch-team-label">${hLabel}</div>
  </div>`;
}

async function toggleMatchDetails(eventId, cardEl) {
  const detailsEl = document.getElementById(`details-${eventId}`);
  if (!detailsEl) return;

  const isOpen = detailsEl.classList.contains('open');
  if (isOpen) {
    detailsEl.classList.remove('open');
    cardEl.querySelector('.expand-arrow')?.classList.remove('rotated');
    return;
  }

  const arrow = cardEl.querySelector('.expand-arrow');

  if (!detailsEl.dataset.loaded) {
    detailsEl.innerHTML = '<div class="loading-msg-dark" style="text-align:center;padding:16px">⏳ טוען הרכבים...</div>';
    detailsEl.classList.add('open');
    try {
      const data = await getJson(`/api/match/${eventId}/details`);
      const homeTeam = cardEl.dataset.home;
      const awayTeam = cardEl.dataset.away;
      const motmHtml     = renderMotmBanner(data.home, data.away);
      const pitchHtml    = renderPitch(data.home, data.away, homeTeam, awayTeam, data.events);
      const timelineHtml = renderTimeline(data.events, homeTeam, awayTeam);
      detailsEl.innerHTML = `
        ${motmHtml}
        <div class="details-body">
          <div class="details-timeline-col">${timelineHtml}</div>
          <div class="details-pitch-col">${pitchHtml}</div>
        </div>`;
      detailsEl.dataset.loaded = '1';
    } catch {
      detailsEl.innerHTML = '<div class="error-msg" style="margin:12px">⚠️ שגיאה בטעינת פרטים</div>';
    }
  } else {
    detailsEl.classList.add('open');
  }

  arrow?.classList.add('rotated');
}

// ─── DATA LOADING ─────────────────────────────────────────────────
function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function loading(id, dark) {
  setHtml(id, `<div class="${dark ? 'loading-msg-dark' : 'loading-msg'}">⏳ טוען...</div>`);
}

function startCountdown() {
  const el = document.getElementById('featured-countdown');
  if (!el) return;
  const kickoff = new Date(el.closest('[data-kickoff]')?.dataset.kickoff);
  if (isNaN(kickoff)) return;

  function update() {
    const diff = kickoff - Date.now();
    if (diff <= 0) {
      el.innerHTML = '<span class="cd-label">היום!</span>';
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    if (days > 0) {
      el.innerHTML =
        `<span class="cd-num">${days}</span><span class="cd-unit">ימים</span>` +
        `<span class="cd-sep">·</span>` +
        `<span class="cd-num">${hours}</span><span class="cd-unit">שעות</span>`;
    } else if (hours > 0) {
      el.innerHTML =
        `<span class="cd-num">${hours}</span><span class="cd-unit">שעות</span>` +
        `<span class="cd-sep">·</span>` +
        `<span class="cd-num">${mins}</span><span class="cd-unit">דקות</span>`;
    } else {
      el.innerHTML = `<span class="cd-num">${mins}</span><span class="cd-unit">דקות</span>`;
    }
  }

  update();
  setInterval(update, 30000);
}

async function loadUpcoming() {
  loading('upcoming-featured');
  setHtml('upcoming-grid', '');
  try {
    const events = await getJson('/api/upcoming');

    if (!Array.isArray(events) || events.length === 0) {
      setHtml('upcoming-featured', '<div class="no-data-msg">אין משחקים קרובים</div>');
      return;
    }
    const [first, ...rest] = events;
    setHtml('upcoming-featured', renderFeatured(first));
    setHtml('upcoming-grid', renderCarousel(rest));
    startCountdown();
  } catch {
    setHtml('upcoming-featured', '<div class="error-msg">⚠️ שגיאה בטעינת משחקים קרובים</div>');
  }
}

async function loadResults() {
  loading('results-list', true);
  try {
    const events = await getJson('/api/results-all');

    if (!Array.isArray(events) || events.length === 0) {
      setHtml('results-list', '<div class="no-data-msg-dark">אין תוצאות</div>');
      return;
    }
    setHtml('results-list', events.map(renderResult).join(''));
  } catch {
    setHtml('results-list', '<div class="error-msg">⚠️ שגיאה בטעינת תוצאות</div>');
  }
}

// ─── STATS TABLES ─────────────────────────────────────────────────
function initials(name) {
  return name.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ['#003FA5','#002878','#1a2a4a','#0d3080','#001f6b'];
function avatarColor(name) {
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function playerRow(player, rank, statKey, statLabel) {
  const medal   = ['gold','silver','bronze'][rank - 1] || '';
  const heName  = player.name;
  const hePos   = heRole(player);
  const bg      = avatarColor(player.name);
  const ini     = initials(player.name);
  const photoUrl = player.photo || '';
  return `
    <tr${rank === 1 ? ' class="rank-1"' : ''}>
      <td><span class="rank ${medal}">${rank}</span></td>
      <td>
        <div class="player-cell">
          <div class="stat-player-photo-wrap">
            <img class="stat-player-photo" src="${photoUrl}" alt="${esc(heName)}"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="player-avatar" style="background:${bg}">${ini}</div>
          </div>
          <div>
            <div class="player-name">${heName}</div>
            <div class="player-pos">${hePos}</div>
          </div>
        </div>
      </td>
      <td><span class="goals-count">${player[statKey]}</span></td>
    </tr>`;
}

async function loadStats() {
  try {
    const players = await getJson('/api/squad');

    const scorers  = [...players].filter(p => p.goals > 0)
                                 .sort((a, b) => b.goals   - a.goals)
                                 .slice(0, 6);
    const assisters = [...players].filter(p => p.assists > 0)
                                  .sort((a, b) => b.assists - a.assists)
                                  .slice(0, 6);

    const sb = document.getElementById('scorers-body');
    const ab = document.getElementById('assisters-body');
    if (sb) sb.innerHTML  = scorers.map((p, i)  => playerRow(p, i + 1, 'goals',   'גולים')).join('');
    if (ab) ab.innerHTML  = assisters.map((p, i) => playerRow(p, i + 1, 'assists', 'בישולים')).join('');
  } catch (e) {
    console.error('stats error:', e);
    const err = '<tr><td colspan="3" style="text-align:center;padding:12px;color:#c00">⚠️ שגיאה בטעינת הנתונים</td></tr>';
    for (const id of ['scorers-body', 'assisters-body']) setHtml(id, err);
  }
}

async function loadStandings() {
  const body = document.getElementById('standings-body');
  if (!body) return;
  try {
    const rows = await getJson('/api/standings');
    body.innerHTML = rows.map(r => {
      const isMaccabi = r.teamName === MACCABI;
      const logo = `<img src="${r.teamLogo}" alt="" class="standings-logo"
        onerror="this.style.visibility='hidden'">`;
      return `<tr class="${isMaccabi ? 'standings-maccabi' : ''}">
        <td><span class="rank">${r.position}</span></td>
        <td><div class="standings-team">${logo}<span>${r.teamName}</span></div></td>
        <td>${r.played}</td>
        <td>${r.wins}</td>
        <td>${r.draws}</td>
        <td>${r.losses}</td>
        <td>${r.gf}:${r.ga}</td>
        <td><strong>${r.points}</strong></td>
      </tr>`;
    }).join('');
  } catch {
    body.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:12px;color:#c00">⚠️ שגיאה בטעינת הטבלה</td></tr>';
  }
}

// ─── PLAYERS ──────────────────────────────────────────────────────
const HE_POS = { G: 'שוער', D: 'הגנה', M: 'קישור', F: 'התקפה' };

function heRole(p) {
  return p.positionName || HE_POS[p.position] || p.position;
}

function tt(icon, label, val) {
  return `<span class="pstat" data-tooltip="${label}">${icon} ${val}</span>`;
}

function playerCardStats(p) {
  const v = x => (x ?? 0);
  if (p.position === 'G')
    return tt('🧤','הצלות',v(p.saves)) + tt('🔒','רשת נקייה',v(p.cleanSheet));
  if (p.position === 'D')
    return tt('👕','הופעות',v(p.appearances)) + tt('⚽','גולים',v(p.goals)) + tt('🎯','בישולים',v(p.assists));
  return tt('⚽','גולים',v(p.goals)) + tt('🎯','בישולים',v(p.assists)) + tt('👟','בעיטות',v(p.totalShots));
}

function renderPlayerCard(p) {
  const name   = p.shortName || p.name;
  const rating = p.rating ? `<div class="player-rating">⭐ ${p.rating}</div>` : '';
  const num    = p.shirtNumber ? `<div class="player-number">#${p.shirtNumber}</div>` : '';
  return `<div class="player-card" onclick="openPlayerModal(${p.id})">
    <img class="player-photo-card"
         src="${p.photo || ''}"
         alt="${esc(name)}" onerror="this.style.display='none'">
    ${num}
    <div class="player-name-card">${name}</div>
    <div class="player-pos-badge">${heRole(p)}</div>
    ${rating}
    <div class="player-card-stats">${playerCardStats(p)}</div>
  </div>`;
}

// "All" tab starts collapsed to ~3 rows of top-rated players (the full squad is ~4 screens on a phone)
let playersPos      = 'all';
let playersExpanded = false;
const COLLAPSED_ROWS = 3;

function gridColumns(grid) {
  return getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
}

function filterPlayers(pos) {
  if (pos !== playersPos) playersExpanded = false;
  playersPos = pos;
  document.querySelectorAll('.player-tab').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.pos === pos)
  );
  const grid = document.getElementById('players-grid');
  if (!grid || !window._players) return;
  const filtered = pos === 'all' ? window._players : window._players.filter(p => p.position === pos);
  const POS_ORDER = { G: 0, D: 1, M: 2, F: 3 };
  const byPosition = [...filtered].sort((a, b) =>
    (POS_ORDER[a.position] ?? 9) - (POS_ORDER[b.position] ?? 9) ||
    (b.rating ?? 0) - (a.rating ?? 0)
  );

  // Collapse only the "all" tab, and only when it hides at least a full row
  const cols  = gridColumns(grid);
  const limit = cols * COLLAPSED_ROWS;
  const collapsible = pos === 'all' && filtered.length - limit >= cols;
  const collapsed   = collapsible && !playersExpanded;

  const shown = collapsed
    ? [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, limit)
    : byPosition;
  grid.innerHTML = shown.map(renderPlayerCard).join('');

  setHtml('players-note', collapsed ? '⭐ הבולטים העונה לפי דירוג' : '');
  setHtml('players-more', !collapsible ? '' : collapsed
    ? `<button class="players-more-btn" onclick="togglePlayersExpanded()">הצג את כל הסגל (${filtered.length}) ▼</button>`
    : `<button class="players-more-btn" onclick="togglePlayersExpanded()">הצג פחות ▲</button>`);
}

function togglePlayersExpanded() {
  playersExpanded = !playersExpanded;
  filterPlayers(playersPos);
  // After collapsing, the button jumps up — bring the section back into view
  if (!playersExpanded) document.getElementById('players-section')?.scrollIntoView({ behavior: 'smooth' });
}

// Column count changes with width (e.g. rotating a phone) — re-apply the collapse limit
let lastPlayersWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth === lastPlayersWidth || !window._players) return;
  lastPlayersWidth = window.innerWidth;
  filterPlayers(playersPos);
});

function openPlayerModal(id) {
  const p = (window._players || []).find(x => x.id === id);
  if (!p) return;
  const name = p.name;

  // Only stats the data source actually provides (null = not available)
  const statsRows = (p.position === 'G'
    ? [
        { val: p.appearances,   lbl: 'הופעות' },
        { val: p.saves,         lbl: 'הצלות' },
        { val: p.cleanSheet,    lbl: 'רשת נקייה' },
        { val: p.goalsConceded, lbl: 'ספיגות' },
      ]
    : [
        { val: p.appearances,   lbl: 'הופעות' },
        { val: p.minutesPlayed, lbl: 'דקות' },
        { val: p.goals,         lbl: 'גולים' },
        { val: p.assists,       lbl: 'בישולים' },
        { val: p.totalShots,    lbl: 'בעיטות' },
        { val: p.shotsOnTarget, lbl: 'למסגרת' },
        { val: p.yellowCards,   lbl: '🟨' },
        { val: p.redCards,      lbl: '🟥' },
      ]
  ).filter(s => s.val != null);

  const statsHtml = statsRows.map(s =>
    `<div class="modal-stat"><strong>${s.val}</strong><span>${s.lbl}</span></div>`
  ).join('');

  const ratingVal = p.rating ?? '—';
  const numBadge  = p.shirtNumber ? `<div class="modal-shirt">#${p.shirtNumber}</div>` : '';

  document.getElementById('player-modal-content').innerHTML = `
    <div class="modal-hero">
      <img class="modal-photo"
           src="${p.photo || ''}"
           alt="${esc(name)}" onerror="this.src=''; this.classList.add('hidden')">
      ${numBadge}
    </div>
    <div class="modal-body">
      <div class="modal-name">${name}</div>
      <div class="modal-role">${heRole(p)}</div>
      <div class="modal-rating-row">
        <div class="modal-rating-box">
          <span class="modal-rating-val">${ratingVal}</span>
          <span class="modal-rating-lbl">דירוג ליגה</span>
        </div>
      </div>
      <div class="modal-stats">${statsHtml}</div>
    </div>`;

  document.getElementById('player-modal').classList.add('open');
}

function closePlayerModal() {
  document.getElementById('player-modal')?.classList.remove('open');
}

async function loadPlayers() {
  try {
    const data = await getJson('/api/squad');
    window._players = data;
    filterPlayers('all');
    document.getElementById('player-tabs')?.addEventListener('click', e => {
      const btn = e.target.closest('.player-tab');
      if (btn) filterPlayers(btn.dataset.pos);
    });
  } catch {
    const g = document.getElementById('players-grid');
    if (g) g.innerHTML = '<div class="error-msg">⚠️ שגיאה בטעינת שחקנים</div>';
  }
}

async function loadSeason() {
  try {
    const { label } = await getJson('/api/season');
    if (!label) throw new Error('no season label');
    document.querySelectorAll('.season-label').forEach(el => { el.textContent = label; });
  } catch {
    // Without a label, "עונה" alone looks broken — hide the badges instead
    document.querySelectorAll('.season-label').forEach(el => {
      el.closest('.season-badge, .badge')?.classList.add('hidden');
    });
  }
}

// ─── QUICK NAV: highlight the section currently under the sticky bar ─
function initQuickNav() {
  const nav   = document.querySelector('.quick-nav');
  const inner = document.querySelector('.quick-nav-inner');
  const links = [...document.querySelectorAll('.quick-nav-link')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href')));
  if (!nav || !links.length) return;

  let current = null;
  function update() {
    const line = nav.getBoundingClientRect().bottom + 16;
    let idx = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= line) idx = i; });
    // At the very bottom the last section may be too short to reach the line
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) idx = links.length - 1;
    const active = links[idx] || null;
    if (active === current) return;
    current?.classList.remove('active');
    active?.classList.add('active');
    current = active;
    // Keep the active chip visible when the bar scrolls sideways (mobile).
    // scrollBy on the bar only — never scrollIntoView, which would interrupt the page's smooth scroll.
    if (active) {
      const a = active.getBoundingClientRect(), box = inner.getBoundingClientRect();
      if (a.left < box.left)   inner.scrollBy({ left: a.left - box.left - 12, behavior: 'smooth' });
      if (a.right > box.right) inner.scrollBy({ left: a.right - box.right + 12, behavior: 'smooth' });
    }
  }

  window.addEventListener('scroll', update, { passive: true }); // cheap: a handful of rect reads
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  initQuickNav();
  loadSeason();
  loadUpcoming();
  loadStandings();
  loadPlayers();
  loadResults();
  loadStats();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePlayerModal();
});

// Sub-in popover
document.addEventListener('click', e => {
  document.querySelectorAll('.sub-popover').forEach(el => el.remove());
  const label = e.target.closest('.sub-off-label[data-subin]');
  if (!label) return;
  e.stopPropagation();
  const rect      = label.getBoundingClientRect();
  const name      = label.dataset.subin;
  const photo     = label.dataset.subinphoto;
  const goals     = parseInt(label.dataset.subingoals || '0', 10);
  const goalBadge = goals > 0
    ? `<span class="sub-pop-goal">${goals > 1 ? `⚽×${goals}` : '⚽'}</span>`
    : '';
  const photoHtml = photo
    ? `<div class="sub-pop-photo-wrap">
         <img class="sub-pop-photo" src="${esc(photo)}"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
         <div class="sub-pop-fallback">${name.charAt(0)}</div>
       </div>`
    : '';
  const pop = document.createElement('div');
  pop.className = 'sub-popover';
  pop.innerHTML = `
    <div class="sub-pop-inner">
      ${photoHtml}
      <div class="sub-pop-info">
        <div class="sub-pop-label">⬆ מחליף</div>
        <div class="sub-pop-name">${name}${goalBadge}</div>
      </div>
    </div>`;
  pop.style.top  = `${rect.bottom + 6}px`;
  pop.style.left = `${rect.left + rect.width / 2}px`;
  document.body.appendChild(pop);
});
