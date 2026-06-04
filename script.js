// FAQ accordion
function toggleFaq(btn) {
  const ans    = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(b => {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('show');
  });
  if (!isOpen) { btn.classList.add('open'); ans.classList.add('show'); }
}

// Mobile nav
let navOpen = false;
function toggleNav() {
  navOpen = !navOpen;
  const ul = document.getElementById('navMenu');
  if (navOpen) {
    Object.assign(ul.style, {
      display:'flex', flexDirection:'column', position:'absolute',
      top:'72px', left:'0', right:'0', background:'#0a1a3d',
      padding:'20px 6%', boxShadow:'0 8px 24px rgba(0,0,0,.3)',
      zIndex:'998', gap:'20px'
    });
  } else {
    ul.style.display = 'none';
  }
}

// Scroll helper
function scrollTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ── REVIEWS CAROUSEL ──
(function() {
  const track    = document.getElementById('revTrack');
  const dotsWrap = document.getElementById('revDots');
  const cards    = Array.from(track.querySelectorAll('.rev-card'));
  const GAP      = 24;
  const VISIBLE  = () => window.innerWidth < 700 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  let cur = 0, autoTimer;

  function cardW() { return cards[0].getBoundingClientRect().width + GAP; }
  function maxIdx() { return Math.max(0, cards.length - VISIBLE()); }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxIdx(); i++) {
      const d = document.createElement('button');
      d.className = 'rev-dot' + (i === cur ? ' active' : '');
      d.onclick = () => { goTo(i); resetAuto(); };
      dotsWrap.appendChild(d);
    }
  }

  function goTo(idx) {
    cur = Math.max(0, Math.min(idx, maxIdx()));
    track.style.transform = `translateX(-${cur * cardW()}px)`;
    dotsWrap.querySelectorAll('.rev-dot').forEach((d,i) => d.classList.toggle('active', i === cur));
  }

  function revMove(dir) { goTo(cur + dir); resetAuto(); }
  window.revMove = revMove;

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(cur >= maxIdx() ? 0 : cur + 1), 4000);
  }

  setTimeout(() => { buildDots(); resetAuto(); }, 100);
  window.addEventListener('resize', () => { buildDots(); goTo(cur); });

  // drag/swipe
  let dragX = 0, dragging = false;
  track.addEventListener('mousedown',  e => { dragging=true; dragX=e.clientX; track.style.transition='none'; });
  track.addEventListener('mousemove',  e => { if(!dragging) return; if(Math.abs(e.clientX-dragX)>50){ dragging=false; track.style.transition=''; revMove(dragX-e.clientX>0?1:-1); } });
  track.addEventListener('mouseup',    () => { dragging=false; track.style.transition=''; });
  track.addEventListener('touchstart', e => { dragX=e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend',   e => { const diff=dragX-e.changedTouches[0].clientX; if(Math.abs(diff)>40) revMove(diff>0?1:-1); });
})();

// ── SCROLL REVEAL: Steps (one by one) ──
(function() {
  const steps = document.querySelectorAll('.step-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach((s, i) => {
          setTimeout(() => s.classList.add('visible'), i * 200);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  if (steps.length) obs.observe(steps[0].closest('section') || steps[0]);
})();

// ── SCROLL REVEAL: Stat cards + counter ──
(function() {
  const cards = document.querySelectorAll('.stat-card');
  let done = false;
  const obs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || done) return;
    done = true;
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('visible');
        const el = card.querySelector('[data-target]');
        if (!el) return;
        const target  = parseFloat(el.dataset.target);
        const suffix  = el.dataset.suffix || '';
        const prefix  = el.dataset.prefix || '';
        const decimal = parseInt(el.dataset.decimal || '0');
        const dur = 1600, fps = 60, steps2 = dur / (1000 / fps);
        let cur = 0, step2 = target / steps2;
        const span = el.querySelector('span');
        const tick = () => {
          cur = Math.min(cur + step2, target);
          const val = decimal ? cur.toFixed(decimal) : Math.round(cur);
          el.childNodes[0].nodeValue = prefix + val;
          if (span) span.textContent = suffix;
          if (cur < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, i * 150);
    });
    obs.disconnect();
  }, { threshold: 0.3 });
  if (cards.length) obs.observe(cards[0].closest('section') || cards[0]);
})();

// ── Active nav link on scroll ──
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 80;
  document.querySelectorAll('section[id]').forEach(s => {
    if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
      document.querySelectorAll('nav ul a').forEach(a => a.style.color = '');
      const lnk = document.querySelector(`nav ul a[href="#${s.id}"]`);
      if (lnk) lnk.style.color = '#f5b942';
    }
  });
});
