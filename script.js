// Mobile nav
let navOpen = false;
function toggleNav() {
  navOpen = !navOpen;
  const ul = document.getElementById('navMenu');
  if (navOpen) {
    Object.assign(ul.style, {
      display:'flex', flexDirection:'column', position:'absolute',
      top:'68px', left:'0', right:'0', background:'#0a1a3d',
      padding:'20px 5%', boxShadow:'0 8px 24px rgba(0,0,0,.3)',
      zIndex:'998', gap:'18px'
    });
  } else { ul.style.display = 'none'; }
}

// FAQ accordion
function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(b => {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('show');
  });
  if (!isOpen) { btn.classList.add('open'); ans.classList.add('show'); }
}

// Form submit
function submitForm(e) {
  e.preventDefault();
  alert('Thank you! Our expert will call you within 10 minutes.');
  e.target.reset();
}

// ── REVIEWS CAROUSEL ──
(function() {
  const track    = document.getElementById('revTrack');
  const dotsWrap = document.getElementById('revDots');
  if (!track) return;
  const cards  = Array.from(track.querySelectorAll('.rev-card'));
  const GAP    = 24;
  const VIS    = () => window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  let cur = 0, timer;

  function cw() { return cards[0].getBoundingClientRect().width + GAP; }
  function max() { return Math.max(0, cards.length - VIS()); }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= max(); i++) {
      const d = document.createElement('button');
      d.className = 'rev-dot' + (i === cur ? ' active' : '');
      d.onclick = () => { goTo(i); reset(); };
      dotsWrap.appendChild(d);
    }
  }
  function goTo(i) {
    cur = Math.max(0, Math.min(i, max()));
    track.style.transform = `translateX(-${cur * cw()}px)`;
    dotsWrap.querySelectorAll('.rev-dot').forEach((d,j) => d.classList.toggle('active', j === cur));
  }
  function revSlide(dir) { goTo(cur + dir); reset(); }
  window.revSlide = revSlide;

  function reset() {
    clearInterval(timer);
    timer = setInterval(() => goTo(cur >= max() ? 0 : cur + 1), 4500);
  }

  setTimeout(() => { buildDots(); reset(); }, 100);
  window.addEventListener('resize', () => { buildDots(); goTo(cur); });

  // swipe
  let sx = 0;
  track.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
  track.addEventListener('touchend', e => {
    const diff = sx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) revSlide(diff > 0 ? 1 : -1);
  });
})();

// ── PROCESS STEPS: scroll reveal one by one ──
(function() {
  const steps = document.querySelectorAll('.proc-step');
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      steps.forEach(s => s.classList.add('visible'));
      obs.disconnect();
    }
  }, { threshold: 0.15 });
  if (steps.length) obs.observe(steps[0].closest('section') || steps[0]);
})();

// ── STATS BAR: counter animation ──
(function() {
  const items = document.querySelectorAll('.sb-num[data-target]');
  let done = false;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || done) return;
    done = true;
    items.forEach(el => {
      const target  = parseFloat(el.dataset.target);
      const suffix  = el.dataset.suffix || '';
      const prefix  = el.dataset.prefix || '';
      const display = el.dataset.display;
      if (display) { setTimeout(() => el.textContent = display, 800); return; }
      const dec = target % 1 !== 0 ? 1 : 0;
      const dur = 1800, steps = dur / 16;
      let c = 0, step = target / steps;
      const tick = () => {
        c = Math.min(c + step, target);
        el.textContent = prefix + (dec ? c.toFixed(dec) : Math.round(c)) + suffix;
        if (c < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    obs.disconnect();
  }, { threshold: 0.4 });
  const bar = document.querySelector('.stats-bar');
  if (bar) obs.observe(bar);
})();

// ── ACTIVE NAV on scroll ──
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 80;
  document.querySelectorAll('section[id], div[id]').forEach(s => {
    if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
      document.querySelectorAll('nav ul a').forEach(a => a.style.color = '');
      const lnk = document.querySelector(`nav ul a[href="#${s.id}"]`);
      if (lnk) lnk.style.color = '#f5b942';
    }
  });
});

// ── NAV scroll shadow ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,.4)' : '0 2px 20px rgba(0,0,0,.3)';
});
