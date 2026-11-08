(() => {
  const CAUSES = [
    { k: 'iftar', n: 'إفطار صائم', u: 15, unit: 'وجبة', q: [1, 10, 30, 100], daily: true,
      impact: q => `إفطار ${arabicQuantity(q, 'صائم واحد', 'صائمين', 'صائمين', 'صائماً')}`, note: 'تُوزَّع عبر مشاريع قطر الخيرية المعتمدة' },
    { k: 'fitr', n: 'زكاة الفطر', u: 15, unit: 'فرد', q: [1, 3, 5, 8],
      impact: q => `زكاة الفطر عن ${arabicQuantity(q, 'فرد واحد', 'فردين', 'أفراد', 'فرداً')}`, note: 'تُخرج قبل صلاة عيد الفطر' },
    { k: 'sadaqa', n: 'صدقة', free: true, presets: [50, 100, 250, 500], daily: true,
      impact: () => 'مشاريع الخير حيث الحاجة', note: 'صدقة تطوعية تُوزَّع حيث الحاجة' },
    { k: 'basket', n: 'سلة رمضان', u: 200, unit: 'سلة', q: [1, 2, 5, 10], daily: true,
      impact: q => `سلال غذائية تدعم ${arabicQuantity(q, 'أسرة واحدة', 'أسرتين', 'أسر', 'أسرة')}`, note: 'السلة الواحدة تكفي أسرة كاملة' },
    { k: 'kiswa', n: 'كسوة العيد', u: 100, unit: 'كسوة', q: [1, 5, 10, 20],
      impact: q => `كسوة ${arabicQuantity(q, 'يتيم واحد', 'يتيمين', 'أيتام', 'يتيماً')}`, note: 'كسوة جديدة لفرحة العيد' }
  ];

  // Change these shape constants to adjust the FAB moon.
  const STREAK_DAYS = 30;
  const MOON_CYCLE_DAYS = 29.530588853;
  const MOON_RADIUS = 13;
  const CHARITY_LOGO_DATA_URL = 'data:image/png;base64,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';
  // Existing prototype social-proof values; replace with live campaign data when available.
  const IMPACT_FEED = [
    { number: 400, message: 'مستفيد من وجبات الإفطار اليوم' },
    { number: 4, message: 'أسر وصلتها سلال رمضان' },
    { number: 8, message: 'أطفال اكتملت فرحتهم بكسوة العيد' },
    { number: 120, message: 'وجبة إفطار وصلت لصائم' }
  ];
  const COMMUNITY_STARTERS = 55454;
  let impactFeedIndex = 0;
  let impactFeedInitialized = false;

  const MILESTONES = [
    { n: 1, label: 'بداية العطاء' },
    { n: 7, label: 'أسبوع' },
    { n: 15, label: 'نصف الشهر' },
    { n: STREAK_DAYS, label: `${STREAK_DAYS} ليلة` }
  ];


  const RAMADAN_START = new Date('2026-11-05T00:00:00+03:00');
  const DAY = 86400000;
  const DEF_MSG = 'كل عام وأنتم بخير، تقبل الله طاعتكم.';

  const S = { tab: 'iftar', mode: 'once', qty: 30, amount: 100, step: 'form', giftTo: '', giftMsg: '' };

  // shortcut: prototype store is localStorage only; swap for the donations API before launch
  const KEY = 'qcRamadanPrototype';
  const blank = () => ({ nights: [], given: 0, seeds: 0 });
  const loadProgress = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {
        nights: Array.isArray(saved.nights) ? saved.nights.filter(night => typeof night === 'string') : [],
        given: Number.isFinite(saved.given) ? saved.given : 0,
        seeds: Number.isSafeInteger(saved.seeds) && saved.seeds >= 0 ? saved.seeds : 0
      };
    } catch (error) {
      console.error('Unable to read Ramadan giving progress.', error);
      return blank();
    }
  };
  let P = loadProgress();
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(P)); }
    catch (error) { console.error('Unable to save Ramadan giving progress.', error); }
  };
  save();

  const drawer = document.getElementById('ramadanDrawer');
  const body = document.getElementById('drawerBody');
  const footer = document.getElementById('drawerFooter');
  const fab = document.getElementById('ramadanFabBtn');
  if (!drawer || !body || !footer || !fab) return;

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const cur = () => CAUSES.find(c => c.k === S.tab);
  const arabicQuantity = (n, one, two, few, many) => n === 1 ? one : n === 2 ? two : `${n} ${n <= 10 ? few : many}`;
  const base = () => cur().free ? S.amount : S.qty * cur().u;
  const total = () => S.mode === 'daily' && cur().daily ? base() * STREAK_DAYS : base();
  const money = n => n.toLocaleString('en-US') + ' ر.ق';
  const impact = () => cur().impact(cur().free ? S.amount : S.qty);
  const impactLine = () => `يسهم عطاؤك في ${impact()}` +
    (S.mode === 'daily' && cur().daily ? `، طوال ${STREAK_DAYS} ليلة` : '');
  const thankYouMessage = () => `تقبّل الله عطاءك في ${cur().n}.`;
  const ramadanMark = className => `<svg aria-hidden="true" class="${className}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M30 7a17 17 0 1 0 12 27A18 18 0 0 1 30 7Z"/><path d="m36 5 1.2 3.5L41 10l-3.8 1.3L36 15l-1.3-3.7L31 10l3.7-1.5L36 5Z"/></svg>`;
  const charityLogo = className => `<img alt="قطر الخيرية" class="${className}" src="assets/qatar-charity-logo.png"/>`;
  const causeIcon = key => {
    const paths = {
      iftar: '<path d="M3 12h18l-2 7H5l-2-7Zm3-3a6 6 0 0 1 12 0M12 3v2"/>',
      fitr: '<path d="M4 12h4l2-2h5a2 2 0 0 1 2 2h3v6H8l-4-2v-4Zm6-4h5a2 2 0 0 1 2 2M2 12v4"/>',
      sadaqa: '<path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z"/>',
      basket: '<path d="M4 10h16l-1 10H5L4 10Zm3 0 5-7 5 7M9 13v4m6-4v4"/>',
      kiswa: '<path d="m8 4 4 2 4-2 5 4-3 4-2-1v9H8v-9l-2 1-3-4 5-4Z"/>'
    };
    return `<svg aria-hidden="true" class="ramadan-cause-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[key] || paths.sadaqa}</svg>`;
  };
  const nightsGiven = () => new Set(P.nights.filter(night => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(night)) return false;
    const date = new Date(`${night}T12:00:00+03:00`);
    if (!Number.isFinite(date.getTime())) return false;
    const offset = Math.floor((qatarDateValue(date) - qatarDateValue(RAMADAN_START)) / DAY);
    return offset >= 0 && offset < STREAK_DAYS;
  })).size;
  const daysLeft = () => Math.ceil((qatarDateValue(RAMADAN_START) - qatarDateValue(new Date())) / DAY);
  const isRamadan = () => ramadanOffset() >= 0 && ramadanOffset() < STREAK_DAYS;
  const today = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Qatar', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return `${values.year}-${values.month}-${values.day}`;
  };
  const qatarDateValue = date => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Qatar', year: 'numeric', month: 'numeric', day: 'numeric'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day));
  };
  const ramadanOffset = () => Math.floor((qatarDateValue(new Date()) - qatarDateValue(RAMADAN_START)) / DAY);
  const ramadanNight = () => Math.max(0, Math.min(STREAK_DAYS, ramadanOffset() + 1));
  const fabPhase = () => ramadanOffset() < 0 ? 'before' : isRamadan() ? 'during' : 'after';
  const countdownCopy = remaining => {
    const days = daysText(remaining);
    if (remaining === 1) return {
      title: 'غداً أول ليلة',
      badge: days,
      compact: 'رمضان غداً',
      message: 'غداً تبدأ رحلتك بين ليالي الخير',
      header: 'غداً تبدأ ليالي رمضان، وتضيء أول نجمة في مسارك'
    };
    if (remaining <= 7) return {
      title: 'هلال الخير يقترب',
      badge: days,
      compact: 'رمضان يقترب',
      message: `باقي ${days} على رمضان؛ هيّئ قلبك لليالي العطاء`,
      header: `باقي ${days} على رمضان؛ اقتربت ليالي الخير`
    };
    if (remaining <= STREAK_DAYS) return {
      title: 'استعد لليالي الخير',
      badge: days,
      compact: 'رمضان يقترب',
      message: `باقي ${days} على رمضان؛ اجمع بذور الخير`,
      header: `باقي ${days} على رمضان؛ اجمع بذور الخير`
    };
    return {
      title: 'تهيّأ لرمضان',
      badge: days,
      compact: 'تهيّأ لرمضان',
      message: `باقي ${days} على رمضان؛ استعد لليالي الخير`,
      header: `باقي ${days} على رمضان، وأثر الخير يبدأ من اليوم`
    };
  };
  const ramadanMoonCopy = night => {
    const nightLabel = night.toLocaleString('ar-QA');
    if (night <= 6) return {
      title: 'هلال الخير',
      compact: `ليلة ${nightLabel}`,
      header: `ليلة ${nightLabel} · أضئ أولى ليالي عطائك`,
      message: `أضئ مسار الخير في ليلة ${nightLabel}`
    };
    if (night <= 13) return {
      title: 'نور العطاء',
      compact: `ليلة ${nightLabel}`,
      header: `ليلة ${nightLabel} · يكبر نور الهلال وأثر العطاء`,
      message: 'أضف نجمة خير إلى مسارك الليلة'
    };
    if (night <= 17) return {
      title: 'بدر العطاء',
      compact: `ليلة ${nightLabel}`,
      header: `ليلة ${nightLabel} · ليالي البدر فرصة للخير`,
      message: 'نور البدر يكتمل، وأثرك يضيء'
    };
    if (night <= 23) return {
      title: 'ليالي الخير',
      compact: `ليلة ${nightLabel}`,
      header: `ليلة ${nightLabel} · كل ليلة فرصة جديدة للعطاء`,
      message: 'كل ليلة نجمة جديدة في مسارك'
    };
    return {
      title: 'ختامها خير',
      compact: `ليلة ${nightLabel}`,
      header: `ليلة ${nightLabel} · اختمها بأثر طيب`,
      message: 'اختمها بعطاء يزهر أثره'
    };
  };
  const getFabPresentation = () => {
    const phase = fabPhase();
    const day = ramadanNight();
    const given = Math.min(STREAK_DAYS, nightsGiven());
    if (phase === 'before') {
      const remaining = Math.max(1, daysLeft());
      return { phase, ...countdownCopy(remaining) };
    }
    if (phase === 'during') {
      const completedTonight = P.nights.includes(today());
      const moonCopy = ramadanMoonCopy(day);
      return {
        phase, title: moonCopy.title,
        badge: `ليلة ${day.toLocaleString('ar-QA')}`,
        compact: moonCopy.compact,
        message: completedTonight
          ? 'أحسنت، أضأت نجمة الليلة'
          : moonCopy.message,
      };
    }
    return {
      phase, title: 'أثر الخير مستمر',
      badge: `${given} / ${STREAK_DAYS}`,
      compact: 'واصل العطاء',
      message: given >= STREAK_DAYS
        ? 'واصل الخير بعد رمضان'
        : 'واصل الخير كل يوم',
    };
  };

  function animateOnce(element, className) {
    element.classList.remove(className);
    requestAnimationFrame(() => {
      element.classList.add(className);
      const duration = getComputedStyle(element).animationDuration
        .split(',')
        .reduce((longest, value) => {
          const time = parseFloat(value);
          return Math.max(longest, value.trim().endsWith('ms') ? time : time * 1000);
        }, 0);
      window.setTimeout(() => element.classList.remove(className), duration + 20);
    });
  }

  function animateFabLabel(copy) {
    animateOnce(copy, 'is-changing');
  }

  function renderFabPresentation() {
    const state = getFabPresentation();
    const icon = document.getElementById('ramadanFabIcon');
    const artwork = document.getElementById('ramadanFabArtwork');
    const copy = document.getElementById('ramadanFabCopy');
    const title = document.getElementById('ramadanFabTitle');
    const badge = document.getElementById('ramadanFabBadge');
    const message = document.getElementById('ramadanFabMessage');
    const compact = document.getElementById('ramadanFabCompact');
    if (!icon || !artwork || !copy || !title || !badge || !message || !compact) return;

    const stage = moonStage();
    const stageKey = `${state.phase}:${stage.toFixed(2)}`;
    const iconChanged = icon.dataset.stage !== stageKey;
    const changed = iconChanged ||
      title.textContent !== state.title ||
      badge.textContent !== state.badge ||
      message.textContent !== state.message;
    if (iconChanged) {
      artwork.innerHTML = ramadanMoonIcon(stage, 'ramadan-fab__svg ramadan-fab__moon', '#19233a', state.phase === 'before');
      icon.dataset.stage = stageKey;
      icon.dataset.phase = state.phase;
      icon.classList.toggle('is-ramadan-active', state.phase === 'during');
      animateOnce(icon, 'is-changing');
    }
    title.textContent = state.title;
    badge.textContent = state.badge;
    compact.textContent = state.compact;
    message.innerHTML = esc(state.message).replace(
      /الخير/g,
      '<span class="ramadan-fab__highlight">الخير<svg aria-hidden="true" class="ramadan-fab__word-star" viewBox="0 0 20 20"><path d="m10 1.5 2.1 6.4 6.4 2.1-6.4 2.1-2.1 6.4-2.1-6.4-6.4-2.1 6.4-2.1L10 1.5Z"/></svg></span>'
    );
    fab.setAttribute('aria-label', `${state.title} — ${state.badge}. ${state.message}؛ تبرع`);
    if (changed) animateFabLabel(copy);
  }

  const moonShadowOffset = illumination => {
    const targetOverlap = 1 - illumination;
    let low = 0;
    let high = 2;
    // Find the offset between equal discs that matches this illuminated fraction.
    for (let i = 0; i < 24; i += 1) {
      const distance = (low + high) / 2;
      const scaledDistance = distance / 2;
      const overlap = (2 * Math.acos(scaledDistance) - 2 * scaledDistance * Math.sqrt(1 - scaledDistance ** 2)) / Math.PI;
      if (overlap > targetOverlap) low = distance;
      else high = distance;
    }
    return ((low + high) / 2) * MOON_RADIUS;
  };
  const moonShadowPosition = night => {
    const phase = Math.min(Math.max(0, night - 0.5), MOON_CYCLE_DAYS - 0.5) / MOON_CYCLE_DAYS;
    const illumination = (1 - Math.cos(phase * Math.PI * 2)) / 2;
    const direction = phase < 0.5 ? -1 : 1;
    return 20 + direction * moonShadowOffset(illumination);
  };
  const moonStage = () => {
    return ramadanOffset() < 0 ? 4 : Math.min(STREAK_DAYS, ramadanOffset() + 1);
  };
  const ramadanMoonIcon = (stage, className, shadowColor, showStar = false) => `
    <svg aria-hidden="true" class="${className}" data-stage="${stage.toFixed(2)}" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="13" fill="currentColor"/>
      <circle cx="${moonShadowPosition(stage)}" cy="20" r="13" fill="${shadowColor}"/>
      ${showStar ? '<path class="ramadan-moon__star" d="M32 6.5v7m-3.5-3.5h7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>' : ''}
    </svg>`;
  const ramadanDateKey = night => new Date(qatarDateValue(RAMADAN_START) + night * DAY).toISOString().slice(0, 10);
  // Arabic counting: 1, 2, 3–10 and 11+ each take a different form.
  const count = (n, one, two, few, many) => n === 1 ? one : n === 2 ? two : n <= 10 ? `${n} ${few}` : `${n} ${many}`;
  const daysText = n => count(n, 'يوم واحد', 'يومان', 'أيام', 'يوماً');
  // One formal line that reads the giver's own state.
  const headerLine = () => {
    if (ramadanOffset() < 0) return countdownCopy(Math.max(1, daysLeft())).header;
    if (!isRamadan()) return 'انتهى رمضان، جزاك الله خيراً على عطائك';
    return ramadanMoonCopy(ramadanNight()).header;
  };

  const leafIcon = () => '<svg aria-hidden="true" class="ramadan-impact-feed__leaf" viewBox="0 0 24 24"><path d="M20.5 3.5C11 3.2 5.2 6.4 4 12.3c-.8 4 1.6 7.2 5.1 7.2 5.2 0 10.1-6.1 11.4-16Z"/><path d="M3.5 21c3-4.1 6.3-7.2 11-10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>';

  function renderImpactActivity(advance = false) {
    const number = document.getElementById('impactActivityNumber');
    const message = document.getElementById('impactActivityMessage');
    if (!number || !message) return;
    if (advance) impactFeedIndex = (impactFeedIndex + 1) % IMPACT_FEED.length;
    const item = IMPACT_FEED[impactFeedIndex];
    number.textContent = item.number.toLocaleString('ar-QA');
    message.textContent = item.message;
    const row = document.getElementById('impactActivity');
    if (row && (advance || !impactFeedInitialized)) {
      row.classList.remove('is-updating');
      requestAnimationFrame(() => row.classList.add('is-updating'));
    }
    if (row && !advance && impactFeedInitialized) row.classList.remove('is-updating');
    impactFeedInitialized = true;
  }

  function renderHeader() {
    const line = document.getElementById('headerImpact');
    if (line) line.textContent = headerLine();

    renderFabPresentation();
    const waitingForRamadan = ramadanOffset() < 0;
    const challengeHeading = document.getElementById('challengeHeading');
    const challengeCount = document.querySelector('.challenge-starters__number');
    const communityCount = document.getElementById('communityCountNumber');
    const challengeLabel = document.getElementById('challengeLabel');
    const challengeProgress = document.getElementById('challengeProgress');
    const earnedNights = Math.min(STREAK_DAYS, nightsGiven());
    const count = waitingForRamadan ? P.seeds : earnedNights;
    if (communityCount) communityCount.textContent = COMMUNITY_STARTERS.toLocaleString('ar-QA');
    if (challengeHeading) challengeHeading.textContent = waitingForRamadan ? 'بذور الخير' : 'ليالي العطاء';
    if (challengeCount) challengeCount.textContent = count.toLocaleString('ar-QA');
    if (challengeLabel) challengeLabel.textContent = waitingForRamadan ? 'بذرة جمعتها' : `من ${STREAK_DAYS} ليلة`;
    if (challengeProgress) {
      challengeProgress.setAttribute('aria-label', waitingForRamadan ? 'بذور الخير قبل رمضان' : 'تقدّم ليالي عطائك');
    }
    const progress = earnedNights / STREAK_DAYS;
    const headerProgress = document.getElementById('ramadanHeaderProgress');
    if (headerProgress) {
      headerProgress.hidden = waitingForRamadan;
      headerProgress.style.setProperty('--ramadan-progress', String(progress));
      headerProgress.setAttribute('aria-valuenow', String(earnedNights));
      headerProgress.setAttribute('aria-valuetext', `${earnedNights} من ${STREAK_DAYS} ليلة`);
    }
    const headerMoon = document.getElementById('drawerMoon');
    if (headerMoon) {
      headerMoon.innerHTML = ramadanMoonIcon(moonStage(), 'ramadan-drawer__moon-icon', '#131b2e', waitingForRamadan);
    }
  }

  function recordDonation() {
    P.given += total();
    if (ramadanOffset() < 0) P.seeds += 1;
    else if (isRamadan() && !P.nights.includes(today())) P.nights.push(today());
    save();
    renderHeader();
  }

  function renderForm() {
    const c = cur();

    const tabs = CAUSES.map(x => `
      <button type="button" data-tab="${x.k}" aria-pressed="${x.k === S.tab}" class="ramadan-cause-option ${x.k === S.tab ? 'is-selected' : ''}">${x.n}</button>`).join('');

    const mode = c.daily ? `
      <div class="mt-4 grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1">
        <button type="button" data-mode="once" aria-pressed="${S.mode === 'once'}" class="donation-period__option ${S.mode === 'once' ? 'is-selected' : ''}">
          <span>مرة واحدة</span><strong class="donation-period__multiplier">×1</strong>
        </button>
        <button type="button" data-mode="daily" aria-pressed="${S.mode === 'daily'}" class="donation-period__option ${S.mode === 'daily' ? 'is-selected is-monthly' : 'is-monthly'}">
          <span>كل ليالي رمضان</span><strong class="donation-period__multiplier">${STREAK_DAYS} ليلة</strong>
        </button>
      </div>` : '';

    const amount = c.free ? `
      <div class="mt-4 grid grid-cols-4 gap-2">
        ${c.presets.map(a => `<button type="button" data-amt="${a}" class="py-2 rounded-lg text-xs font-weight-bold transition-colors ${S.amount === a
          ? 'bg-pink-50 text-qc-magenta'
          : 'bg-gray-100 text-gray-600'}">${a}</button>`).join('')}
      </div>
      <input id="customAmt" inputmode="numeric" placeholder="مبلغ آخر (ر.ق)" value="${c.presets.includes(S.amount) ? '' : S.amount}" class="mt-3 w-100 h-12 px-4 rounded-xl border border-gray-200 focus:border-qc-magenta focus:outline-none text-sm font-weight-bold"/>
    ` : `
      <div class="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <span class="text-xs font-weight-bold text-gray-700">${S.mode === 'daily' ? 'الكمية لكل ليلة' : 'عدد ' + c.unit}</span>
          <span class="text-xs text-gray-500 font-weight-bold">${c.unit} ${S.mode === 'daily' ? 'لكل ليلة' : 'لكل اختيار'}</span>
        </div>
        <div class="d-flex align-items-center justify-content-between bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
          <button type="button" data-d="-1" aria-label="إنقاص" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 d-flex align-items-center justify-content-center text-gray-700 font-weight-bold text-xl">−</button>
          <div class="text-center">
            <div class="d-flex align-items-baseline justify-content-center gap-1">
              <span class="text-2xl font-black text-gray-900 heading-kufi">${S.qty}</span>
              <span class="text-xs text-gray-500 font-weight-normal">${c.unit}</span>
            </div>
            <span class="text-[11px] text-gray-400">${S.mode === 'daily' ? 'لكل ليلة من رمضان' : c.n}</span>
          </div>
          <button type="button" data-d="1" aria-label="زيادة" class="w-10 h-10 rounded-lg bg-qc-magenta hover:bg-qc-magentaHover d-flex align-items-center justify-content-center text-white font-weight-bold text-xl">+</button>
        </div>
        <div class="mt-3 grid grid-cols-4 gap-2">
          ${c.q.map(q => `<button type="button" data-qty="${q}" class="py-1.5 rounded-lg text-xs font-weight-bold transition-colors ${S.qty === q
            ? 'bg-pink-50 text-qc-magenta'
            : 'bg-gray-100 text-gray-600'}">${q}</button>`).join('')}
        </div>
      </div>`;

    const selectedImpact = `
      <aside class="ramadan-selected-impact mt-3" role="note" aria-label="أثر اختيارك">
        <span class="ramadan-selected-impact__icon" aria-hidden="true">${causeIcon(S.tab)}</span>
        <span class="ramadan-selected-impact__copy">
          <strong>أثر اختيارك</strong>
          <span id="selectedImpactMessage">${esc(impactLine())}</span>
          <small id="selectedImpactNote">${esc(c.note)}</small>
        </span>
      </aside>`;

    const waitingForRamadan = ramadanOffset() < 0;
    const earnedNights = nightsGiven();
    const remaining = Math.max(1, daysLeft());
    const donatedTonight = P.nights.includes(today());
    const currentNight = isRamadan() ? ramadanNight() : STREAK_DAYS;
    let progressVisual;

    if (waitingForRamadan) {
      const visibleSeeds = Math.min(P.seeds, 8);
      const seedIcons = Array.from({ length: Math.max(1, visibleSeeds + 1) }, (_, index) =>
        `<span aria-hidden="true" class="ramadan-seed-collection__seed ${index < visibleSeeds ? 'is-collected' : 'is-next'}"></span>`
      ).join('');
      progressVisual = `
        <section class="ramadan-seed-collection mt-5" id="ramadanSeedCollection" aria-label="بذور الخير قبل رمضان">
          <div class="ramadan-seed-collection__intro">
            <div>
              <span class="ramadan-seed-collection__eyebrow">استعداداً لرمضان</span>
              <h3 class="ramadan-seed-collection__title heading-kufi">اجمع بذور الخير</h3>
            </div>
            <div class="ramadan-seed-collection__count">
              <strong>${P.seeds.toLocaleString('ar-QA')}</strong>
              <span>بذرة</span>
            </div>
          </div>
          <div class="ramadan-seed-collection__seeds">${seedIcons}</div>
          <p class="ramadan-seed-collection__message mb-0">
            ${P.seeds
              ? `كل عطاء مبكر يزرع بذرة خير. تبدأ ليالي رمضان بعد ${daysText(remaining)}.`
              : 'ابدأ ببذرة خير اليوم. يبدأ عدّ الليالي مع أول ليلة من رمضان.'}
          </p>
        </section>`;
    } else {
      const drops = Array.from({ length: STREAK_DAYS }, (_, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / STREAK_DAYS;
        const x = 120 + Math.cos(angle) * 84;
        const y = 120 + Math.sin(angle) * 84;
        const earned = P.nights.includes(ramadanDateKey(index));
        const current = isRamadan() && index === ramadanOffset();
        const missed = index < ramadanOffset() && !earned;
        const classes = `ramadan-streak-orbit__drop${earned ? ' is-earned' : ''}${missed ? ' is-missed' : ''}${current ? ' is-current' : ''}`;
        const rotation = (angle * 180) / Math.PI + 90;
        return `<path class="${classes}" data-night="${index + 1}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotation.toFixed(2)})" d="M0-5.5C1.5-3.2 4.1-.7 4.1 1.5a4.1 4.1 0 1 1-8.2 0C-4.1-.7-1.5-3.2 0-5.5Z"/>`;
      }).join('');
      const treeTiers = [
        'M60 16C56 25 52 32 47 40c5-2 9-2 13 1 4-3 8-3 13-1-5-8-9-15-13-24Z',
        'M60 33C54 42 48 51 42 60c7-3 13-2 18 2 5-4 11-5 18-2-6-9-12-18-18-27Z',
        'M60 50C52 61 43 71 36 82c9-4 17-2 24 2 7-4 15-6 24-2-7-11-16-21-24-32Z'
      ].map((shape, index) =>
        `<path class="ramadan-streak-tree__canopy${earnedNights >= index * 10 + 1 ? ' is-earned' : ''}" data-tree-tier="${index + 1}" d="${shape}"/>`
      ).join('');
      const treeComplete = earnedNights >= STREAK_DAYS;
      const fruits = treeComplete ? `
        <g class="ramadan-streak-tree__fruits">
          <circle cx="45" cy="57" r="3.2"/><circle cx="75" cy="55" r="3.2"/>
          <circle cx="52" cy="72" r="3.2"/><circle cx="69" cy="77" r="3.2"/>
          <circle cx="40" cy="81" r="3.2"/>
        </g>` : '';
      const currentNightNumber = currentNight.toLocaleString('ar-QA');
      const title = !isRamadan()
        ? 'ليالي رمضان في مسارك'
        : earnedNights >= STREAK_DAYS
          ? 'أتممت ليالي العطاء'
          : `ليلة ${ramadanNight().toLocaleString('ar-QA')} من رحلتك`;
      const caption = earnedNights >= STREAK_DAYS
        ? 'أثمرت شجرتك بعد إضاءة ليالي رمضان الثلاثين.'
        : !isRamadan()
          ? 'انتهى رمضان، تقبّل الله عطاءك'
          : donatedTonight
            ? 'نمت شجرتك بعطائك الليلة.'
            : `${ramadanMoonCopy(currentNight).message}. ${earnedNights.toLocaleString('ar-QA')} من ${STREAK_DAYS} ليلة مضيئة`;
      progressVisual = `
        <section class="ramadan-streak mt-5" aria-label="رحلتك في ليالي رمضان">
          <div class="ramadan-streak__heading">
            <div>
              <span class="ramadan-streak__eyebrow">${!isRamadan() ? 'رحلتك الرمضانية' : 'ليالي رمضان'}</span>
              <h3 class="ramadan-streak__title heading-kufi" id="streakLabel">${title}</h3>
            </div>
            <span class="ramadan-streak__count" id="streakCount">${earnedNights.toLocaleString('ar-QA')} من ${STREAK_DAYS}</span>
          </div>
          <div class="ramadan-streak-orbit mt-3" id="ramadanStreakOrbit" role="img" aria-label="ليلة ${currentNightNumber} من ${STREAK_DAYS}. أتممت ${earnedNights.toLocaleString('ar-QA')} ليلة، ونمت ${earnedNights.toLocaleString('ar-QA')} ورقة من ٣٠">
            <svg aria-hidden="true" class="ramadan-streak-orbit__art" viewBox="0 0 240 240">
              <circle class="ramadan-streak-orbit__track" cx="120" cy="120" r="84"/>
              ${drops}
            </svg>
            <div class="ramadan-streak-orbit__center${treeComplete ? ' is-complete' : ''}">
              <svg aria-hidden="true" class="ramadan-streak-tree" viewBox="20 12 80 105">
                ${treeTiers}
                <path class="ramadan-streak-tree__trunk" d="M60 80V110"/>
                ${fruits}
              </svg>
              <strong>${earnedNights.toLocaleString('ar-QA')}</strong>
              <span>من ${STREAK_DAYS.toLocaleString('ar-QA')} ليلة</span>
            </div>
          </div>
          <p class="ramadan-streak__milestone mb-0 mt-2">${caption}</p>
        </section>`;
    }

    body.innerHTML = `
      <div class="ramadan-cause-grid">${tabs}</div>
      ${mode}
      ${amount}
      ${selectedImpact}
      ${progressVisual}`;

    footer.innerHTML = `
      <div class="ramadan-drawer__footer p-6 pt-4 border-top border-gray-100 bg-white space-y-3">
        <button type="button" data-step="pay" class="ramadan-primary-action w-100 py-3.5 px-4 rounded-xl font-weight-bold text-base d-flex align-items-center justify-content-center gap-2 heading-kufi">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          <span>${S.mode === 'daily' ? 'ابدأ العطاء اليومي' : 'متابعة الدفع'}</span>
          <strong class="ramadan-primary-action__amount" id="footCtaAmount">${money(total())}</strong>
        </button>
        <div class="ramadan-impact-feed" id="impactActivity" role="status" aria-label="أثر مجتمع العطاء" aria-live="polite" aria-atomic="true">
          <span class="ramadan-impact-feed__entry">
            ${leafIcon()}
            <strong class="ramadan-impact-feed__number" id="impactActivityNumber"></strong>
            <span class="ramadan-impact-feed__message" id="impactActivityMessage"></span>
          </span>
        </div>
        ${S.mode === 'daily' && c.daily
          ? `<p class="ramadan-commitment-note mb-0" role="note">إجمالي عطاء ${STREAK_DAYS} ليلة · يُدفع مرة واحدة</p>`
          : ''}
      </div>`;
    renderImpactActivity();
  }

  function animatePeriodSelection() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const selected = body.querySelector('.donation-period__option.is-selected');
    if (!selected) return;
    selected.classList.remove('is-changing');
    void selected.offsetWidth;
    selected.classList.add('is-changing');
    const clearAnimation = () => selected.classList.remove('is-changing');
    selected.addEventListener('animationend', clearAnimation, { once: true });
    selected.addEventListener('animationcancel', clearAnimation, { once: true });
  }

  const renderStepHeading = (step, eyebrow, title) => `
    <div class="ramadan-step-heading">
      <button type="button" data-step="${step}" aria-label="رجوع" class="ramadan-step-heading__back">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
      </button>
      <div>
        <span class="ramadan-step-heading__eyebrow">${eyebrow}</span>
        <h3 class="ramadan-step-heading__title heading-kufi">${title}</h3>
      </div>
    </div>`;

  function renderPay() {
    const c = cur();
    const line = c.free ? c.n : `${c.n} — ${S.qty} ${c.unit}`;

    body.innerHTML = `
      ${renderStepHeading('form', 'خطوتك الأخيرة', 'اختر طريقة الدفع')}
      <div class="ramadan-checkout-steps" aria-label="خطوات التبرع">
        <span class="is-complete"><i aria-hidden="true"></i>اختيار العطاء</span>
        <span class="is-active"><i aria-hidden="true"></i>الدفع</span>
      </div>
      <div class="ramadan-payment-summary mt-4 rounded-2xl border border-gray-200 text-sm divide-y divide-gray-100">
        <div class="ramadan-payment-summary__cause">${causeIcon(S.tab)}<span>${line}${S.mode === 'daily' ? ` × ${STREAK_DAYS} يوماً` : ''}</span></div>
        <div class="ramadan-payment-summary__total d-flex justify-content-between p-3"><span class="font-weight-bold">إجمالي عطائك</span><span class="font-black text-qc-magenta">${money(total())}</span></div>
      </div>
      <p class="ramadan-payment-notice mt-3" role="note">بوابة الدفع غير مفعّلة في هذا النموذج؛ لا تُدخل بيانات بطاقة حقيقية.</p>
      <div class="ramadan-payment-methods mt-4">
        <button type="button" data-pay="apple" class="ramadan-payment-method ramadan-payment-method--apple">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M16.7 12.8c0-2 1.6-3 1.7-3.1a3.7 3.7 0 0 0-2.9-1.6c-1.2-.1-2.4.7-3.1.7-.6 0-1.6-.7-2.7-.6A4.1 4.1 0 0 0 6.3 10c-1.5 2.5-.4 6.2 1.1 8.2.7 1 1.6 2 2.6 2 1 0 1.4-.6 2.6-.6s1.6.6 2.7.6c1.1 0 1.8-1 2.5-2a9 9 0 0 0 1.1-2.3 3.5 3.5 0 0 1-2.2-3.1ZM14.7 6.8a3.5 3.5 0 0 0 .8-2.5 3.6 3.6 0 0 0-2.3 1.2 3.3 3.3 0 0 0-.8 2.4 3 3 0 0 0 2.3-1.1Z"/></svg>
          <span>Apple Pay</span>
        </button>
        <button type="button" data-pay="google" class="ramadan-payment-method ramadan-payment-method--google">
          <svg aria-hidden="true" viewBox="0 0 48 48"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3C9.2 39.5 16 44 24 44Z"/><path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4 16 4 9.2 8.5 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"/></svg>
          <span>Google Pay</span>
        </button>
      </div>
      <div class="ramadan-payment-divider"><span>أو باستخدام بطاقة</span></div>
      <section class="ramadan-card-form" aria-label="الدفع بالبطاقة">
        <div class="ramadan-card-form__heading">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M3 10h18m-14 5h4"/></svg>
          <h4>بيانات البطاقة</h4>
        </div>
        <div class="ramadan-card-form__fields">
          <label for="cardNo">رقم البطاقة</label>
          <input id="cardNo" inputmode="numeric" autocomplete="cc-number" maxlength="19" placeholder="0000 0000 0000 0000" class="w-100 h-12 px-4 rounded-xl border border-gray-200 focus:border-qc-magenta focus:outline-none text-sm tracking-widest"/>
          <div class="grid grid-cols-2 gap-3 mt-3">
            <div><label for="cardExp">تاريخ الانتهاء</label><input id="cardExp" autocomplete="cc-exp" maxlength="5" placeholder="MM/YY" class="w-100 h-12 px-4 rounded-xl border border-gray-200 focus:border-qc-magenta focus:outline-none text-sm"/></div>
            <div><label for="cardCvv">رمز الأمان</label><input id="cardCvv" inputmode="numeric" autocomplete="cc-csc" maxlength="4" placeholder="CVV" class="w-100 h-12 px-4 rounded-xl border border-gray-200 focus:border-qc-magenta focus:outline-none text-sm"/></div>
          </div>
        </div>
      </section>
      `;

    footer.innerHTML = `
      <div class="ramadan-payment-footer">
        <p id="payError" class="d-none text-xs font-weight-bold text-qc-magenta" role="alert">تحقق من بيانات البطاقة ثم أعد المحاولة.</p>
        <button type="button" data-pay="card" class="ramadan-primary-action ramadan-payment-submit w-100 rounded-xl font-weight-bold text-base heading-kufi"><span>تبرّع</span><strong>${money(total())}</strong></button>
      </div>`;
  }

  function renderGift() {
    const to = S.giftTo.trim();
    const msg = S.giftMsg.trim() || DEF_MSG;

    body.innerHTML = `
      ${renderStepHeading('done', 'شارك أثر عطائك', 'بطاقة إهداء')}
      <p class="ramadan-gift-intro">أهدِ أثراً طيباً لمن تحب</p>
      <div class="ramadan-gift-card mt-4">
        <span class="ramadan-gift-card__moon" aria-hidden="true">${ramadanMoonIcon(moonStage(), 'ramadan-gift-card__moon-icon', '#18243a', true)}</span>
        <div class="ramadan-gift-card__brand">${charityLogo('ramadan-gift-card__logo')}</div>
        <div class="ramadan-gift-card__eyebrow">هدية من ليالي رمضان</div>
        <div class="ramadan-gift-card__recipient"><span>إلى</span> <strong id="giftToName">${esc(to || 'من تحب')}</strong></div>
        <div class="ramadan-gift-card__cause">${esc(cur().n)}</div>
        <p class="ramadan-gift-card__message" id="giftMsgText">${esc(msg)}</p>
        <div class="ramadan-gift-card__impact">${esc(impactLine())}</div>
      </div>
      <label for="giftTo" class="d-block text-xs font-weight-bold text-gray-700 mt-4 mb-1.5">اسم المُهدى إليه</label>
      <input id="giftTo" value="${esc(S.giftTo)}" placeholder="مثال: أمي" class="w-100 h-12 px-4 rounded-xl border border-gray-200 focus:border-qc-magenta focus:outline-none text-sm"/>
      <label for="giftMsg" class="d-block text-xs font-weight-bold text-gray-700 mt-3 mb-1.5">رسالتك</label>
      <input id="giftMsg" value="${esc(S.giftMsg)}" placeholder="${DEF_MSG}" class="w-100 h-12 px-4 rounded-xl border border-gray-200 focus:border-qc-magenta focus:outline-none text-sm"/>
      <button type="button" data-send="wa" class="mt-4 w-100 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white font-weight-bold text-base d-flex align-items-center justify-content-center gap-2 transition-colors">
        <svg class="w-5 h-5 fill-current" viewbox="0 0 24 24"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1s-.5-.1-.7.2-.7.9-.9 1.1-.4.2-.7 0a8.2 8.2 0 01-2.4-1.5 9 9 0 01-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 00-.9.4 3.6 3.6 0 00-1.1 2.6 6.2 6.2 0 001.3 3.3 13.9 13.9 0 005.4 4.7c2.1.8 2.1.6 2.5.6a3.3 3.3 0 002.2-1.5 2.7 2.7 0 00.2-1.5c-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2z"></path></svg>
        إرسال عبر واتساب
      </button>
      <p id="shareError" class="ramadan-share-error" role="alert" hidden></p>
      <button type="button" data-send="img" class="mt-2 w-100 py-3 rounded-xl bg-gray-100 text-gray-700 font-weight-bold text-sm hover:bg-gray-200 transition-colors">تنزيل البطاقة</button>`;

    footer.innerHTML = '';
  }

  function renderDone() {
    const earnedNights = nightsGiven();
    const streakMessage = ramadanOffset() < 0
      ? `بارك الله في عطائك المبكر. جمعت ${P.seeds.toLocaleString('ar-QA')} من بذور الخير، وتبدأ لياليك مع رمضان`
      : earnedNights >= STREAK_DAYS
        ? 'أتممت ليالي رمضان، بارك الله فيك'
        : `${earnedNights.toLocaleString('ar-QA')} من ${STREAK_DAYS} ليلة عطاء`;
    body.innerHTML = `
      <div class="ramadan-thanks">
        <div class="ramadan-thanks__hero">
          <span class="ramadan-thanks__icon">${ramadanMark('ramadan-thanks__crescent')}</span>
          <div class="ramadan-thanks__copy">
            <h3 class="ramadan-thanks__title heading-kufi">جزاك الله خيراً</h3>
            <p class="ramadan-thanks__message">${esc(thankYouMessage())}</p>
          </div>
          <span class="ramadan-thanks__sparkle" aria-hidden="true">✦</span>
        </div>
        <div class="ramadan-thanks__impact">
          <div class="ramadan-thanks__impact-heading">${causeIcon(S.tab)}<span>أثر اختيارك</span></div>
          <p class="ramadan-thanks__cause">${esc(impactLine())}</p>
          <strong class="ramadan-thanks__amount">${money(total())}</strong>
          <div class="ramadan-thanks__challenge">
            <span class="ramadan-thanks__challenge-icon" aria-hidden="true">${ramadanMark('')}</span>
            <span id="doneStreak">${streakMessage}</span>
          </div>
        </div>
        <div class="mt-4 d-flex gap-2">
          <button type="button" data-share class="ramadan-secondary-action flex-fill font-weight-bold py-3 rounded-xl">شارك أثرك</button>
          <button type="button" data-share="wa" aria-label="واتساب" class="w-12 rounded-xl bg-[#25D366] text-white d-flex align-items-center justify-content-center hover:bg-[#1fb855] transition-colors">
            <svg class="w-5 h-5 fill-current" viewbox="0 0 24 24"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1s-.5-.1-.7.2-.7.9-.9 1.1-.4.2-.7 0a8.2 8.2 0 01-2.4-1.5 9 9 0 01-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 00-.9.4 3.6 3.6 0 00-1.1 2.6 6.2 6.2 0 001.3 3.3 13.9 13.9 0 005.4 4.7c2.1.8 2.1.6 2.5.6a3.3 3.3 0 002.2-1.5 2.7 2.7 0 00.2-1.5c-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2z"></path></svg>
          </button>
        </div>
        <button type="button" data-step="gift" class="ramadan-secondary-action mt-2 w-100 font-weight-bold py-3 rounded-xl">أرسل بطاقة إهداء</button>
        <button type="button" data-step="form" class="mt-3 text-xs text-gray-500 underline">تبرّع مرة أخرى</button>
        <p id="shareError" class="ramadan-share-error" role="alert" hidden></p>
      </div>`;

    footer.innerHTML = '';
  }

  let renderedStep = null;

  function render() {
    const scrollRegion = body.parentElement;
    const scrollTop = scrollRegion.scrollTop;
    const preserveScroll = renderedStep === S.step;
    const activeElement = document.activeElement;
    const focusKey = ['tab', 'mode', 'qty', 'd', 'amt'].find(key =>
      activeElement && activeElement.hasAttribute(`data-${key}`)
    );
    const focusValue = focusKey && activeElement.dataset[focusKey];
    ({ form: renderForm, pay: renderPay, gift: renderGift, done: renderDone })[S.step]();
    scrollRegion.scrollTop = preserveScroll ? scrollTop : 0;
    if (preserveScroll && focusKey) {
      Array.from(body.querySelectorAll(`[data-${focusKey}]`))
        .find(element => element.dataset[focusKey] === focusValue)
        ?.focus({ preventScroll: true });
    }
    renderedStep = S.step;
  }

  function updateTotals() {
    const cta = $('#footCtaAmount'); if (cta) cta.textContent = money(total());
    const t = $('#impactText'); if (t) t.textContent = impactLine();
    const activityMessage = $('#selectedImpactMessage'); if (activityMessage) activityMessage.textContent = impactLine();
    const activityNote = $('#selectedImpactNote'); if (activityNote) activityNote.textContent = cur().note;
  }

  function pay(method) {
    // shortcut: payment is simulated in the browser; wire a gateway before going live
    if (method !== 'card') {
      recordDonation();
      S.step = 'done';
      render();
      return;
    }
    const no = ($('#cardNo').value || '').replace(/\D/g, '');
    const exp = ($('#cardExp').value || '').trim();
    const cvv = ($('#cardCvv').value || '').trim();
    const ok = no.length === 16 && /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp) && /^\d{3,4}$/.test(cvv);
    if (!ok) { $('#payError').classList.remove('d-none'); return; }
    recordDonation();
    S.step = 'done';
    render();
  }

  const storyText = opts => opts && opts.name
    ? `إهداء إلى ${opts.name}: ${opts.msg || DEF_MSG} ${impactLine()}`
    : `${thankYouMessage()} ${impactLine()}`;
  const giftText = () => `بطاقة إهداء من قطر الخيرية\nإلى ${S.giftTo.trim() || 'من تحب'}\n${S.giftMsg.trim() || DEF_MSG}\n${impactLine()}`;
  const wa = t => window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');

  function wrap(x, text, cx, y, maxW, lh) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (x.measureText(t).width > maxW && line) { lines.push(line); line = w; }
      else line = t;
    }
    if (line) lines.push(line);
    const startY = y - (lines.length - 1) * lh / 2;
    lines.forEach((l, i) => x.fillText(l, cx, startY + i * lh));
  }

  async function storyBlob(opts = {}) {
    const gift = opts.purpose === 'gift';
    const recipient = String(opts.name || '').trim();
    const message = String(opts.msg || DEF_MSG).trim();
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const logo = new Image();
    logo.src = CHARITY_LOGO_DATA_URL;
    await logo.decode();
    const W = 1080, H = 1350;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const x = cv.getContext('2d');
    const sky = x.createLinearGradient(0, 0, W, H);
    sky.addColorStop(0, '#11192b');
    sky.addColorStop(.58, '#1a2640');
    sky.addColorStop(1, '#22223b');
    x.fillStyle = sky;
    x.fillRect(0, 0, W, H);
    x.direction = 'rtl';
    x.textAlign = 'center';
    const F = (px, w) => `${w} ${px}px "Noto Kufi Arabic", "Almarai", system-ui, sans-serif`;

    const drawStar = (cx, cy, r) => {
      x.beginPath();
      x.moveTo(cx, cy - r);
      x.quadraticCurveTo(cx + r * .12, cy - r * .12, cx + r, cy);
      x.quadraticCurveTo(cx + r * .12, cy + r * .12, cx, cy + r);
      x.quadraticCurveTo(cx - r * .12, cy + r * .12, cx - r, cy);
      x.quadraticCurveTo(cx - r * .12, cy - r * .12, cx, cy - r);
      x.fill();
    };
    const drawLogo = () => {
      const width = 222;
      const height = width * logo.naturalHeight / logo.naturalWidth;
      x.filter = 'brightness(0) saturate(100%) invert(83%) sepia(22%) saturate(683%) hue-rotate(2deg) brightness(90%) contrast(87%)';
      x.drawImage(logo, (W - width) / 2, 76, width, height);
      x.filter = 'none';
    };
    const drawMoon = (cx, cy, radius) => {
      x.fillStyle = '#e6c27a';
      x.beginPath();
      x.arc(cx, cy, radius, 0, Math.PI * 2);
      x.fill();
      const shadowShift = Math.max(-radius * 1.6, Math.min(radius * 1.6,
        (moonShadowPosition(moonStage()) - 20) / MOON_RADIUS * radius));
      x.fillStyle = '#18223a';
      x.beginPath();
      x.arc(cx + shadowShift, cy - 5, radius, 0, Math.PI * 2);
      x.fill();
    };
    const drawRule = y => {
      x.strokeStyle = 'rgba(230,194,122,.45)';
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(330, y);
      x.lineTo(750, y);
      x.stroke();
    };

    x.fillStyle = 'rgba(255,255,255,.62)';
    [[165,260,2.2],[770,250,1.6],[835,330,2]].forEach(([cx,cy,r]) => drawStar(cx,cy,r));
    drawLogo();
    drawMoon(900, 190, 58);

    x.fillStyle = 'rgba(255,250,240,.035)';
    x.strokeStyle = 'rgba(230,194,122,.5)';
    x.lineWidth = 2;
    x.beginPath();
    x.roundRect(90, 350, 900, 520, 34);
    x.fill();
    x.stroke();

    if (gift) {
      x.fillStyle = '#e6c27a';
      x.font = F(32, 700);
      x.fillText(`إلى ${recipient || 'من تحب'}`, W / 2, 445, 820);
      x.fillStyle = '#fffaf0';
      x.font = F(64, 800);
      x.fillText('هدية من القلب', W / 2, 555);
      x.fillStyle = '#e6c27a';
      x.font = F(34, 600);
      wrap(x, message, W / 2, 700, 760, 56);
    } else {
      x.fillStyle = '#e6c27a';
      x.font = F(30, 700);
      x.fillText('عطاء رمضان', W / 2, 445);
      x.fillStyle = '#fffaf0';
      x.font = F(68, 800);
      x.fillText('جزاك الله خيراً', W / 2, 555);
      x.fillStyle = '#e6c27a';
      x.font = F(34, 600);
      wrap(x, thankYouMessage(), W / 2, 700, 760, 56);
    }
    drawRule(960);
    x.fillStyle = '#e6c27a';
    x.font = F(26, 600);
    x.fillText('العطاء', W / 2, 1015);
    x.fillStyle = '#fffaf0';
    x.font = F(38, 700);
    x.fillText(cur().n, W / 2, 1075, 850);
    x.fillStyle = '#e6c27a';
    x.font = F(34, 700);
    wrap(x, impactLine(), W / 2, 1170, 850, 50);
    return new Promise((resolve, reject) => {
      try {
        cv.toBlob(blob => blob
          ? resolve(blob)
          : reject(new Error('The browser could not export the share image.')), 'image/png');
      } catch (error) {
        reject(error);
      }
    });
  }

  async function shareStory(opts) {
    const filename = 'qatar-charity-ramadan-impact.png';
    const blob = await storyBlob({ ...(opts || {}), purpose: 'share' });
    const file = new File([blob], filename, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: storyText(opts) }); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    download(blob, filename);
  }

  function showShareError(error) {
    console.error('Unable to prepare the Ramadan share image.', error);
    const message = $('#shareError');
    if (message) {
      message.textContent = 'تعذّر تجهيز الصورة للمشاركة. حاول مرة أخرى.';
      message.hidden = false;
    }
  }

  async function handleShare(opts, downloadOnly = false) {
    const message = $('#shareError');
    if (message) message.hidden = true;
    try {
      if (downloadOnly) {
        const blob = await storyBlob({ ...(opts || {}), purpose: 'gift' });
        download(blob, 'qatar-charity-ramadan-gift.png');
      } else {
        await shareStory(opts);
      }
    } catch (error) {
      showShareError(error);
    }
  }

  function download(blob, filename = 'qatar-charity-ramadan-impact.png') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function openDrawer() {
    S.step = 'form';
    body.parentElement.scrollTop = 0;
    render();
    renderHeader();
    drawer.classList.remove('d-none');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('closeDrawerBtn').focus();
  }

  function closeDrawer() {
    drawer.classList.add('d-none');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    fab.focus();
  }

  drawer.addEventListener('click', e => {
    const el = e.target.closest('[data-tab],[data-mode],[data-qty],[data-d],[data-amt],[data-step],[data-pay],[data-share],[data-send]');
    if (!el) return;
    const d = el.dataset;

    if (d.tab) {
      S.tab = d.tab;
      S.mode = 'once';
      S.qty = d.tab === 'iftar' ? 30 : 1;
      S.amount = 100;
      render();
    } else if (d.mode) {
      const changed = S.mode !== d.mode;
      S.mode = d.mode;
      render();
      if (changed) animatePeriodSelection();
    } else if (d.qty) {
      S.qty = +d.qty;
      render();
    } else if (d.d) {
      S.qty = Math.max(1, S.qty + (+d.d));
      render();
    } else if (d.amt) {
      S.amount = +d.amt;
      render();
    } else if (d.step) {
      S.step = d.step;
      render();
    } else if (d.pay) {
      pay(d.pay);
    } else if (d.send === 'wa') {
      wa(giftText());
    } else if (d.send === 'img') {
      handleShare({ purpose: 'gift', name: S.giftTo.trim(), msg: S.giftMsg.trim() || DEF_MSG }, true);
    } else if ('share' in d) {
      if (d.share === 'wa') wa(storyText());
      else handleShare();
    }
  });

  drawer.addEventListener('input', e => {
    if (e.target.id === 'customAmt') {
      S.amount = Math.max(0, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0);
      updateTotals();
    }
    if (e.target.id === 'cardNo') {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }
    if (e.target.id === 'cardExp') {
      const v = e.target.value.replace(/\D/g, '').slice(0, 4);
      e.target.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
    }
    if (e.target.id === 'giftTo') {
      S.giftTo = e.target.value;
      const n = $('#giftToName'); if (n) n.textContent = S.giftTo.trim() || 'من تحب';
    }
    if (e.target.id === 'giftMsg') {
      S.giftMsg = e.target.value;
      const m = $('#giftMsgText'); if (m) m.textContent = S.giftMsg.trim() || DEF_MSG;
    }
  });

  document.getElementById('closeDrawerBtn').addEventListener('click', closeDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (drawer.classList.contains('d-none')) return;
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = Array.from(drawer.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !drawer.contains(active))) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && (active === last || !drawer.contains(active))) {
      e.preventDefault();
      first?.focus();
    }
  });

  fab.addEventListener('click', openDrawer);
  document.querySelectorAll('[data-open-drawer]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    openDrawer();
  }));

  const siteMenuToggle = document.getElementById('siteMenuToggle');
  const siteNavigation = document.getElementById('siteNavigation');
  if (siteMenuToggle && siteNavigation) {
    siteMenuToggle.addEventListener('click', () => {
      const expanded = siteMenuToggle.getAttribute('aria-expanded') === 'true';
      siteMenuToggle.setAttribute('aria-expanded', String(!expanded));
      siteMenuToggle.setAttribute('aria-label', expanded ? 'فتح القائمة' : 'إغلاق القائمة');
      siteNavigation.classList.toggle('is-open', !expanded);
    });
    siteNavigation.addEventListener('click', event => {
      if (!event.target.closest('a')) return;
      siteMenuToggle.setAttribute('aria-expanded', 'false');
      siteMenuToggle.setAttribute('aria-label', 'فتح القائمة');
      siteNavigation.classList.remove('is-open');
    });
  }

  renderHeader();
  window.setInterval(() => renderImpactActivity(true), 5200);
  let renderedDate = today();
  setInterval(() => {
    renderHeader();
    const currentDate = today();
    if (currentDate !== renderedDate) {
      renderedDate = currentDate;
      if (drawer.getAttribute('aria-hidden') === 'false' && S.step === 'form') render();
    }
  }, 60000);
})();
