const MACCABI_EN = 'Maccabi Tel Aviv';

const HE_PLAYERS = {
  // ── מכבי תל אביב ──
  'Dor Peretz':           'דור פרץ',
  'Hélio Varela':         'הליו ורלה',
  'Heitor':               'הייטור',
  'Ben Lederman':         'בנג׳מין לדרמן',
  'Benjamin Lederman':    'בנג׳מין לדרמן',
  'Elad Madmon':          'אלעד מדמון',
  'Sagiv Jehezkel':       'סגיב יחזקאל',
  'Emir Sahiti':          'אמיר סהיטי',
  'Ion Nicolaescu':       'יון ניקולאסקו',
  'Kervin Andrade':       'קרבין אנדראדה',
  'Yonas Malede':         'יונס מלדה',
  'Ilay Ben Simon':       'אילאי בן שמעון',
  'Issouf Sissokho':      'איסוף סיסוקו',
  'Osher Davida':         'אושר דוידה',
  'Ido Shahar':           'עידו שחר',
  'Itamar Noy':           'איתמר נוי',
  'Lotem Asres':          'לותם אסרס',
  'Roee Magor':           'רועי מגור',
  'Mohamed Camara':       'מוחמד קמארה',
  'Roy Revivo':           'רועי רביבו',
  'Tyrese Asante':        'טיריס אסנטה',
  'Raz Shlomo':           'רז שלומו',
  'Kristijan Belić':      'קריסטיאן בליץ׳',
  'Saied Abu Farchi':     'סעיד אבו פרחי',
  'Denny Gropper':        'דני גרופר',
  'Noam Ben Harosh':      'נועם בן הרוש',
  'Itai Ben Hamo':        'איתי בן המו',
  'Amit Kredi':           'עמית קרדי',
  'Eran Zahavi':          'ערן זהבי',
  'Avishay Cohen':        'אבישי כהן',
  'Dan Biton':            'דן ביטון',
  'Daniel Tenenbaum':     'דניאל טננבאום',
  'Hisham Layous':        'הישאם לאיוס',
  'Ofek Melika':          'אופק מליקה',

  // ── שחקנים ישראלים בליגה ──
  'Dolev Haziza':         'דולב חזיזה',
  'Omer Atzili':          'עומר עציל',
  'Guy Melamed':          'גיא מלמד',
  'Naor Sabag':           'נאור שבג',
  'Eylon Almog':          'איילון אלמוג',
  'Niv Eliasi':           'ניב אליאסי',
  'Guy Mizrahi':          'גיא מזרחי',
  'Or Blorian':           'אור בלוריאן',
  'Matan Baltaxa':        'מתן בלטקסה',
  'Eden Shamir':          'עדן שמיר',
  'Ilay Elmkies':         'אילאי אלמקיס',
  'Ilay Tamam':           'אילאי תמם',
  'Omer Abuhav':          'עומר אבוחב',
  'Omer Agvadish':        'עומר אגבדיש',
  'Shon Goldberg':        'שון גולדברג',
  'Kenny Saief':          'קני סאיף',
  'Sali Ginon':           'סאלי גינון',
  'Elad Amir':            'אלעד אמיר',
  'Roy Baranes':          'רועי ברנס',
  'Niv Gotlieb':          'ניב גוטליב',
  'Niv Fliter':           'ניב פליטר',
  'Harel Shalom':         'הראל שלום',
  'Shay Ben David':       'שי בן דוד',
  'Shay Elias':           'שי אליאס',
  'Liran Rotman':         'לירן רוטמן',
  'Liran Sardal':         'לירן סרדל',
  'Lior Gliklich':        'ליאור גליקליך',
  'Yarden Shua':          'ירדן שוע',
  'Yarden Cohen':         'ירדן כהן',
  'Gil Cohen':            'גיל כהן',
  'Gil Itzhak':           'גיל יצחק',
  'Doron Leidner':        'דורון ליידנר',
  'Yoav Gerafi':          'יואב גרפי',
  'Roy Korine':           'רועי קורין',
  'Roi Mishpati':         'רועי משפטי',
  'Matan Beit Yaakov':    'מתן בית יעקב',
  'Ofir Benbenishti':     'אופיר בנבנישתי',
  'Ohad Almagor':         'אוהד אלמגור',
  'Alon Azugi':           'אלון אזוגי',
  'Alon Turgeman':        'אלון תורגמן',
  'Avi Turgeman':         'אבי תורגמן',
  'Oren Biton':           'אורן ביטון',
  'Ovadia Dervish':       'עובדיה דרויש',
  'Shalev Harush':        'שלו חרוש',
  'Shavit Elgabi':        'שביט אלגבי',
  'Stav Torial':          'סתיו טוריאל',
  'Tal Archel':           'טל ארכל',
  'Yair Mordechai':       'יאיר מרדכי',
  'Yarin Levi':           'ירין לוי',
  'Yarin Swisa':          'ירין סוויסה',
  'Yinon Faingezicht':    'ינון פיינגציכט',
  'Yonatan Kay Laish':    'יונתן קיי לייש',
  'Ziv Ben Shimol':       'זיו בן שימול',
  'Ziv Morgan':           'זיו מורגן',
  'Zahi Ahmed':           'זאהי אחמד',
  'Nadav Zamir':          'נדב זמיר',
  'Navot Ratner':         'נבות רטנר',
  'Noam Gil Melamud':     'נועם גיל מלמוד',
  'Ofek Nadir':           'אופק נדיר',
  'Ron Unger':            'רון אונגר',
  'Ronen Peretz':         'רונן פרץ',
  'Roee Levi':            'רועי לוי',
  'Maor Yashilirmak':     'מאור ישילירמק',
  'Michael Ohana':        'מיכאל אוחנה',
  'Mohamad Abu Rumi':     'מוחמד אבו רומי',
  'Mohamad Amer':         'מוחמד עאמר',
  'Mohammed Abu Nil':     'מוחמד אבו ניל',
  'Mor Barami':           'מור בראמי',
  'Muhamad Shaker':       'מוחמד שאקר',
  'Maron Ghantous':       'מרון ע׳נטוס',
  'Adi Menachem Yona':    'עדי מנחם יונה',
  'Ahmad Salman':         'אחמד סלמאן',
  'Amir Chaim Ganah':     'אמיר חיים גנה',
  'Amit Lemkin':          'עמית למקין',
  'Anas Mahamid':         'אנאס מחמיד',
  'Ariel Sharetzky':      'אריאל שרצקי',
  'Assaf Tzur':           'אסף צור',
  'Ayad Habashi':         'איאד חבשי',
  'Bilal Shaheen':        'בילאל שאהין',
  'Daniel Joulani':       'דניאל ג׳ולאני',
  'Eliel Peretz':         'אליאל פרץ',
  'Eliyahu Belilti':      'אליהו בלילתי',
  'Ethane Azoulay':       'אתן אזולאי',
  'Fares Abu Akel':       'פארס אבו עקל',
  'Hassan Hilu':          'חסן חילו',
  'Ido Sharon':           'עידו שרון',
  'Itay Zada':            'איתי זדה',
  'Iyad Khalaili':        'איאד חלאילי',
  'Jubayer Bushnaq':      'ג׳ובייר בושנק',
  'Lisav Naif Eissat':    'ליסב נאיף עיסאת',
  'Abdallah Jaber':       'עבדאללה ג׳אבר',
  'Ali Mohamed':          'עלי מוחמד',
  'Peter Michael':        'פיטר מיכאל',
  'Artur Miranyan':       'ארתור מירניאן',
  'Sandro Altunashvili':  'סנדרו אלטונשווילי',
  'Awka Ashta':           'עוקה אשתא',
};

const HE_POSITIONS = {
  'F':                  'חלוץ',
  'M':                  'קישורי',
  'D':                  'מגן',
  'G':                  'שוער',
  'Attacker':           'חלוץ',
  'Forward':            'חלוץ',
  'Midfielder':         'קישורי',
  'Defensive Midfield': 'קישורי הגנתי',
  'Attacking Midfield': 'קישורי התקפי',
  'Left Wing':          'כנפי שמאל',
  'Right Wing':         'כנפי ימין',
  'Centre-Back':        'בלם',
  'Goalkeeper':         'שוער',
  'Right Back':         'מגן ימין',
  'Left Back':          'מגן שמאל',
};

const HE_TEAMS = {
  'Maccabi Tel Aviv':              'מכבי תל אביב',
  'Hapoel Beer Sheva':             'הפועל ב"ש',
  "Hapoel Be'er Sheva":            'הפועל ב"ש',
  'Maccabi Haifa':                 'מכבי חיפה',
  'Beitar Jerusalem':              'בית"ר ירושלים',
  'Hapoel Tel Aviv':               'הפועל ת"א',
  'Hapoel Tel-Aviv':               'הפועל ת"א',
  'Hapoel Haifa':                  'הפועל חיפה',
  'Hapoel Petah Tikva':            'הפועל פ"ת',
  'Hapoel Petach Tikva':           'הפועל פ"ת',
  'Maccabi Petah Tikva':           'מכבי פ"ת',
  'Maccabi Petach Tikva':          'מכבי פ"ת',
  'Bnei Sakhnin':                  'בני סכנין',
  'Bnei Yehuda':                   'בני יהודה',
  'Ashdod FC':                     'מ.ס. אשדוד',
  'FC Ashdod':                     'מ.ס. אשדוד',
  'Ashdod SC':                     'מ.ס. אשדוד',
  'Hapoel Hadera':                 'הפועל חדרה',
  'Ironi Kiryat Shmona':           'איר. קרית שמונה',
  'Hapoel Ironi Kiryat Shmona':    'איר. קרית שמונה',
  'Maccabi Netanya':               'מכבי נתניה',
  'Hapoel Jerusalem':              'הפועל ירושלים',
  'Ironi Tiberias':                'איר. טבריה',
  'Ironi Dorot Tiberias':          'איר. טבריה',
  'Maccabi Bney Reine':            'מכבי בני ריינה',
  'Maccabi Yafo':                  'מכבי יפו',
  'Hapoel Rishon Lezion':          'הפועל ראשון לציון',
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
              <span class="featured-team-name">${heTeam(ev.strHomeTeam)}</span>
            </div>
            <div class="featured-vs">VS</div>
            <div class="featured-team">
              ${logoImg(ev.strAwayTeamBadge, ev.strAwayTeam, 'lg')}
              <span class="featured-team-name">${heTeam(ev.strAwayTeam)}</span>
            </div>
          </div>
          ${ev.strVenue ? `<div class="featured-venue">🏟️ ${ev.strVenue}</div>` : ''}
          <button class="lineup-toggle-btn"
                  onclick="toggleUpcomingLineup('${ev.idEvent}','${ev.strHomeTeam}','${ev.strAwayTeam}',this)">
            הרכבים ▼
          </button>
        </div>
      </div>
      <div class="upcoming-lineup" id="upcoming-lineup-${ev.idEvent}"></div>
    </div>`;
}

async function toggleUpcomingLineup(eventId, homeTeam, awayTeam, btn) {
  const el = document.getElementById(`upcoming-lineup-${eventId}`);
  if (!el) return;

  if (el.classList.contains('open')) {
    el.classList.remove('open');
    btn.textContent = 'הרכבים ▼';
    return;
  }

  btn.textContent = 'הרכבים ▲';
  el.classList.add('open');

  if (el.dataset.loaded) return;
  el.innerHTML = '<div class="loading-msg-dark" style="text-align:center;padding:20px">⏳ טוען הרכבים…</div>';

  try {
    const data = await fetch(`/api/match/${eventId}/lineups-only`).then(r => r.json());
    if (!data.available) {
      el.innerHTML = '<div class="lineup-unavailable">ההרכב טרם פורסם</div>';
    } else {
      const label = data.home?.confirmed ? 'הרכב רשמי' : 'הרכב צפוי';
      el.innerHTML = `<div class="lineup-status-label">${label}</div>` +
        renderPitch(data.home, data.away, homeTeam, awayTeam, []);
    }
    el.dataset.loaded = '1';
  } catch {
    el.innerHTML = '<div class="error-msg" style="margin:12px">⚠️ שגיאה בטעינת הרכבים</div>';
  }
}

// ─── REGULAR GAME CARD ────────────────────────────────────────────
function renderGameCard(ev) {
  const { day, full, time } = formatDate(
    ev.dateEventLocal || ev.dateEvent,
    ev.strTimeLocal  || ev.strTime
  );
  const location = ev.strHomeTeam === MACCABI_EN ? '🏠 ביתי' : '✈️ חוצות';
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
    <div class="result-wrapper">
      <div class="result-card ${oc}"
           onclick="toggleMatchDetails('${ev.idEvent}', this)"
           data-home="${ev.strHomeTeam}"
           data-away="${ev.strAwayTeam}">
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
        <div class="expand-arrow">▼</div>
      </div>
      <div class="match-details" id="details-${ev.idEvent}"></div>
    </div>`;
}

// ─── MATCH DETAILS: GOALS + LINEUP ───────────────────────────────

function shortName(name, nameHe) {
  return nameHe || HE_PLAYERS[name] || name.split(' ').slice(-1)[0];
}

function renderTimeline(events, homeTeam, awayTeam) {
  if (!events?.length) return '';

  const homeHe = heTeam(homeTeam);
  const awayHe = heTeam(awayTeam);

  function eventCell(ev) {
    const min = ev.addedTime ? `${ev.time}+${ev.addedTime}′` : `${ev.time}′`;
    if (ev.type === 'goal') {
      const name = shortName(ev.player, ev.playerHe);
      const tag  = ev.penalty ? ' (פנ׳)' : ev.ownGoal ? ' (אג)' : '';
      return `<span class="tl-goal">⚽ ${name}${tag}</span><span class="tl-min">${min}</span>`;
    }
    if (ev.type === 'substitution') {
      const out = shortName(ev.playerOut, ev.playerOutHe);
      const inn = shortName(ev.playerIn,  ev.playerInHe);
      return `<span class="tl-sub"><span class="tl-sub-out">⬇ ${out}</span><span class="tl-sub-in">⬆ ${inn}</span></span><span class="tl-min">${min}</span>`;
    }
    if (ev.type === 'card') {
      const name  = shortName(ev.player, ev.playerHe);
      const icon  = ev.cardClass === 'red' ? '🟥' : ev.cardClass === 'yellowRed' ? '🟨🟥' : '🟨';
      return `<span class="tl-card">${icon} ${name}</span><span class="tl-min">${min}</span>`;
    }
    return '';
  }

  const rows = events.map(ev => {
    const cell = eventCell(ev);
    const homeCell = ev.isHome  ? `<td class="tl-home">${cell}</td>` : `<td class="tl-home tl-empty"></td>`;
    const awayCell = !ev.isHome ? `<td class="tl-away">${cell}</td>` : `<td class="tl-away tl-empty"></td>`;
    return `<tr>${homeCell}${awayCell}</tr>`;
  }).join('');

  return `<div class="timeline-wrap">
    <table class="timeline">
      <thead><tr><th>${homeHe}</th><th>${awayHe}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function playerDot(p, isMaccabi, isMotm, goalCount) {
  const name     = shortName(p.name, p.nameHe);
  const photoUrl = `https://img.sofascore.com/api/v1/player/${p.id}/image`;
  const isGK     = p.position === 'G';
  const subInDisplay = p.subOff?.subInNameHe || HE_PLAYERS[p.subOff?.subInName] || p.subOff?.subInName || null;
  const subInAttr = subInDisplay ? ` data-subin="${subInDisplay}"` : '';
  const sub      = p.subOff
    ? `<span class="sub-off-label"${subInAttr}>⬇ ${p.subOff.time}${p.subOff.addedTime ? '+' + p.subOff.addedTime : ''}′</span>`
    : '';
  const goalBadge = goalCount > 0
    ? `<span class="player-goal-badge">${goalCount > 1 ? `⚽×${goalCount}` : '⚽'}</span>`
    : '';
  return `<div class="player-dot ${isMaccabi ? 'maccabi' : 'opponent'}${isMotm ? ' motm' : ''}">
    <div class="player-photo-outer">
      <div class="player-photo-wrap">
        <img class="player-photo" src="${photoUrl}" alt="${name}"
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

  const isMaccabiHome = homeTeam === MACCABI_EN;
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
        playerDot(p, isMaccabi, motmSet.has(p.id), goalCounts[p.name] || 0)
      ).join('')}</div>`
    ).join('');
  };

  const hLabel = home.formation ? `${heTeam(homeTeam)} · ${home.formation}` : heTeam(homeTeam);
  const aLabel = away.formation ? `${heTeam(awayTeam)} · ${away.formation}` : heTeam(awayTeam);

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
  document.querySelectorAll('.match-details.open').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.expand-arrow.rotated').forEach(el => el.classList.remove('rotated'));
  if (isOpen) return;

  const arrow = cardEl.querySelector('.expand-arrow');

  if (!detailsEl.dataset.loaded) {
    detailsEl.innerHTML = '<div class="loading-msg-dark" style="text-align:center;padding:16px">⏳ טוען הרכבים...</div>';
    detailsEl.classList.add('open');
    try {
      const data = await fetch(`/api/match/${eventId}/details`).then(r => r.json());
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
    const res    = await fetch('/api/upcoming');
    const events = await res.json();

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
    const res    = await fetch('/api/results-all');
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
  const heName  = HE_PLAYERS[player.name] || player.name;
  const hePos   = HE_POSITIONS[player.position] || player.position;
  const bg      = avatarColor(player.name);
  const ini     = initials(player.name);
  const photoUrl = `https://img.sofascore.com/api/v1/player/${player.id}/image`;
  return `
    <tr${rank === 1 ? ' class="rank-1"' : ''}>
      <td><span class="rank ${medal}">${rank}</span></td>
      <td>
        <div class="player-cell">
          <div class="stat-player-photo-wrap">
            <img class="stat-player-photo" src="${photoUrl}" alt="${heName}"
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
    const res     = await fetch('/api/squad');
    const players = await res.json();

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
  }
}

async function loadStandings() {
  const body = document.getElementById('standings-body');
  if (!body) return;
  try {
    const rows = await fetch('/api/standings').then(r => r.json());
    body.innerHTML = rows.map(r => {
      const isMaccabi = r.teamName === MACCABI_EN;
      const logo = `<img src="https://img.sofascore.com/api/v1/team/${r.teamId}/image"
        class="team-logo" style="width:20px;height:20px;vertical-align:middle;margin-left:6px"
        onerror="this.style.display='none'">`;
      return `<tr class="${isMaccabi ? 'standings-maccabi' : ''}">
        <td><span class="rank">${r.position}</span></td>
        <td class="player-cell">${logo}${heTeam(r.teamName)}</td>
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
const HE_POS_DETAIL = {
  GK: 'שוער', ST: 'חלוץ', SS: 'חלוץ שני',
  RW: 'חלוץ ימין', LW: 'חלוץ שמאל',
  MC: 'קשר מרכזי', ML: 'קשר שמאלי', MR: 'קשר ימני',
  AM: 'קשר התקפי', DM: 'קשר הגנתי',
  DC: 'מגן מרכזי', DL: 'מגן שמאל', DR: 'מגן ימין',
  WL: 'אגף שמאל', WR: 'אגף ימין',
};

function heRole(p) {
  return HE_POS_DETAIL[p.positionDetail] || HE_POS[p.position] || p.position;
}

function tt(icon, label, val) {
  return `<span class="pstat" data-tooltip="${label}">${icon} ${val}</span>`;
}

function playerCardStats(p) {
  const v = x => (x ?? 0);
  if (p.position === 'G')
    return tt('🧤','שמירות',v(p.saves)) + tt('🔒','נקיות',v(p.cleanSheet));
  if (p.position === 'D')
    return tt('🛡','בלימות',v(p.tackles)) + tt('✂️','חטיפות',v(p.interceptions));
  if (p.position === 'F')
    return tt('⚽','גולים',v(p.goals)) + tt('🎯','בישולים',v(p.assists)) + tt('👟','בעיטות',v(p.totalShots));
  return tt('⚽','גולים',v(p.goals)) + tt('🎯','בישולים',v(p.assists)) + tt('🔑','מסירות מפתח',v(p.keyPasses));
}

function renderPlayerCard(p) {
  const name   = HE_PLAYERS[p.name] || p.name.split(' ').slice(-1)[0];
  const rating = p.rating ? `<div class="player-rating">⭐ ${p.rating}</div>` : '';
  const num    = p.shirtNumber ? `<div class="player-number">#${p.shirtNumber}</div>` : '';
  return `<div class="player-card" onclick="openPlayerModal(${p.id})">
    <img class="player-photo-card"
         src="https://img.sofascore.com/api/v1/player/${p.id}/image"
         alt="${name}" onerror="this.style.display='none'">
    ${num}
    <div class="player-name-card">${name}</div>
    <div class="player-pos-badge">${heRole(p)}</div>
    ${rating}
    <div class="player-card-stats">${playerCardStats(p)}</div>
  </div>`;
}

function filterPlayers(pos) {
  document.querySelectorAll('.player-tab').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.pos === pos)
  );
  const grid = document.getElementById('players-grid');
  if (!grid || !window._players) return;
  const filtered = pos === 'all' ? window._players : window._players.filter(p => p.position === pos);
  const POS_ORDER = { G: 0, D: 1, M: 2, F: 3 };
  const sorted = [...filtered].sort((a, b) =>
    (POS_ORDER[a.position] ?? 9) - (POS_ORDER[b.position] ?? 9) ||
    (b.rating ?? 0) - (a.rating ?? 0)
  );
  grid.innerHTML = sorted.map(renderPlayerCard).join('');
}

function openPlayerModal(id) {
  const p = (window._players || []).find(x => x.id === id);
  if (!p) return;
  const name = HE_PLAYERS[p.name] || p.name;
  const v    = x => (x ?? 0);

  let statsRows;
  if (p.position === 'G') {
    statsRows = [
      { val: v(p.appearances),  lbl: 'הופעות' },
      { val: v(p.minutesPlayed),lbl: 'דקות' },
      { val: v(p.saves),        lbl: 'שמירות' },
      { val: v(p.cleanSheet),   lbl: 'נקיות' },
      { val: v(p.goalsConceded),lbl: 'ספיגות' },
      { val: v(p.yellowCards),  lbl: '🟨' },
    ];
  } else if (p.position === 'D') {
    statsRows = [
      { val: v(p.appearances),   lbl: 'הופעות' },
      { val: v(p.minutesPlayed), lbl: 'דקות' },
      { val: v(p.tackles),       lbl: 'בלימות' },
      { val: v(p.interceptions), lbl: 'חטיפות' },
      { val: v(p.goals),         lbl: 'גולים' },
      { val: v(p.yellowCards),   lbl: '🟨' },
    ];
  } else if (p.position === 'F') {
    statsRows = [
      { val: v(p.appearances),   lbl: 'הופעות' },
      { val: v(p.minutesPlayed), lbl: 'דקות' },
      { val: v(p.goals),         lbl: 'גולים' },
      { val: v(p.assists),       lbl: 'בישולים' },
      { val: v(p.totalShots),    lbl: 'בעיטות' },
      { val: v(p.shotsOnTarget), lbl: 'על השער' },
    ];
  } else {
    statsRows = [
      { val: v(p.appearances),        lbl: 'הופעות' },
      { val: v(p.minutesPlayed),      lbl: 'דקות' },
      { val: v(p.goals),              lbl: 'גולים' },
      { val: v(p.assists),            lbl: 'בישולים' },
      { val: v(p.keyPasses),          lbl: 'מסירות מפתח' },
      { val: v(p.tackles),            lbl: 'בלימות' },
    ];
  }

  const statsHtml = statsRows.map(s =>
    `<div class="modal-stat"><strong>${s.val}</strong><span>${s.lbl}</span></div>`
  ).join('');

  const ratingVal = p.rating ?? '—';
  const numBadge  = p.shirtNumber ? `<div class="modal-shirt">#${p.shirtNumber}</div>` : '';

  document.getElementById('player-modal-content').innerHTML = `
    <div class="modal-hero">
      <img class="modal-photo"
           src="https://img.sofascore.com/api/v1/player/${p.id}/image"
           alt="${name}" onerror="this.src=''; this.classList.add('hidden')">
      ${numBadge}
    </div>
    <div class="modal-body">
      <div class="modal-name">${name}</div>
      <div class="modal-role">${heRole(p)}</div>
      <div class="modal-rating-row">
        <div class="modal-rating-box">
          <span class="modal-rating-val">${ratingVal}</span>
          <span class="modal-rating-lbl">דירוג</span>
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
    const data = await fetch('/api/squad').then(r => r.json());
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

document.addEventListener('DOMContentLoaded', () => {
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
  const rect = label.getBoundingClientRect();
  const pop  = document.createElement('div');
  pop.className   = 'sub-popover';
  pop.textContent = `⬆ ${label.dataset.subin}`;
  pop.style.top   = `${rect.bottom + 4}px`;
  pop.style.left  = `${rect.left + rect.width / 2}px`;
  document.body.appendChild(pop);
});
