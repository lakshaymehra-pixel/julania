// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scrollTopBtn').style.display = window.scrollY > 300 ? 'flex' : 'none';
});

// Hamburger / Mobile Nav
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openNav() {
  hamburger.style.display = 'none';
  navLinks.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  hamburger.style.display = '';
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => navLinks.classList.contains('open') ? closeNav() : openNav());
navOverlay.addEventListener('click', closeNav);
document.getElementById('navCloseBtn').addEventListener('click', closeNav);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

// Hero visible
setTimeout(() => document.getElementById('heroContainer').classList.add('visible'), 100);

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-icon').innerHTML = '<i class="fa fa-plus"></i>';
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.querySelector('.faq-icon').innerHTML = '<i class="fa fa-minus"></i>';
    }
  });
});

// Scroll to top
document.getElementById('scrollTopBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Contact form
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you! Your application has been submitted. Our team will contact you shortly.');
  e.target.reset();
});

// Chatbot
const cbWindow = document.getElementById('cbWindow');
const cbFab = document.getElementById('cbFab');
const cbCloseFab = document.getElementById('cbCloseFab');
const cbMessages = document.getElementById('cbMessages');
const cbInput = document.getElementById('cbInput');

const botReplies = {
  'check loan eligibility': 'To check eligibility, you need: ✅ Salaried employee ✅ Age 21–58 ✅ Monthly salary ₹15,000+ ✅ CIBIL score 650+. Want to apply now?',
  'interest rates': 'Our interest rates start from 12% per annum. The exact rate depends on your credit profile, loan amount, and tenure. No hidden charges!',
  'required documents': 'You only need: 📄 Aadhaar Card, 📄 PAN Card, 📄 Last 3 months salary slips, 📄 6-month bank statement. Everything digital!',
  'apply for loan': 'Great! You can apply directly on our website. Click the "Apply Now" button or fill the contact form. Our team will reach out within 2 hours!',
  'cibil score': 'We require a minimum CIBIL score of 650. However, we also consider income stability and employment history. Contact us to know more!',
};

function addMsg(text, isUser) {
  const div = document.createElement('div');
  div.className = 'cb-msg' + (isUser ? ' user' : '');
  div.innerHTML = isUser
    ? `<div class="cb-msg-avatar user-av"><i class="fa fa-user"></i></div><div class="cb-bubble">${text}</div>`
    : `<div class="cb-msg-avatar">JF</div><div class="cb-bubble">${text}</div>`;
  cbMessages.appendChild(div);
  cbMessages.scrollTop = cbMessages.scrollHeight;
}

function botReply(msg) {
  const key = msg.toLowerCase().trim();
  const reply = botReplies[key] || 'Thanks for your message! Our team will get back to you shortly. You can also call us at +91 98765 43210.';
  setTimeout(() => addMsg(reply, false), 800);
}

function sendChip(text) { addMsg(text, true); botReply(text); }

document.getElementById('cbSendBtn').addEventListener('click', () => {
  const val = cbInput.value.trim();
  if (!val) return;
  addMsg(val, true);
  botReply(val);
  cbInput.value = '';
});
cbInput.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('cbSendBtn').click(); });

document.getElementById('cbOpenBtn').addEventListener('click', () => {
  cbWindow.style.display = 'flex';
  cbFab.style.display = 'none';
  cbCloseFab.style.display = 'flex';
});
function closeChat() {
  cbWindow.style.display = 'none';
  cbFab.style.display = 'flex';
  cbCloseFab.style.display = 'none';
}
document.getElementById('cbCloseBtn').addEventListener('click', closeChat);
document.getElementById('cbCloseFab').addEventListener('click', closeChat);

// Testimonials slider
const testiGrid = document.getElementById('testiGrid');
const tcDots = document.getElementById('tcDots');
const cards = testiGrid.querySelectorAll('.testi-card');
let current = 0;

function getPerPage() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function buildDots() {
  tcDots.innerHTML = '';
  const perPage = getPerPage();
  const total = Math.ceil(cards.length / perPage);
  for (let i = 0; i < total; i++) {
    const d = document.createElement('span');
    d.className = 'tc-dot' + (i === current ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    tcDots.appendChild(d);
  }
}

function goTo(idx) {
  const perPage = getPerPage();
  const total = Math.ceil(cards.length / perPage);
  current = Math.max(0, Math.min(idx, total - 1));
  const cardWidth = testiGrid.parentElement.offsetWidth;
  testiGrid.style.transform = `translateX(-${current * cardWidth}px)`;
  tcDots.querySelectorAll('.tc-dot').forEach((d, i) => d.classList.toggle('active', i === current));
}

document.getElementById('tcPrev').addEventListener('click', () => goTo(current - 1));
document.getElementById('tcNext').addEventListener('click', () => goTo(current + 1));
window.addEventListener('resize', () => { current = 0; buildDots(); goTo(0); });

// Touch swipe for testimonials
let tsX = 0;
testiGrid.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; });
testiGrid.addEventListener('touchend', e => {
  const diff = tsX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
});

buildDots();
goTo(0);

// Footer accordion (mobile only)
document.querySelectorAll('.footer-col h4').forEach(h4 => {
  h4.style.cursor = 'pointer';
  h4.addEventListener('click', () => {
    if (window.innerWidth > 768) return;
    const col = h4.closest('.footer-col');
    const isOpen = col.classList.contains('open');
    // Close all
    document.querySelectorAll('.footer-col').forEach(c => c.classList.remove('open'));
    // Open clicked if was closed
    if (!isOpen) col.classList.add('open');
  });
});

// Animate on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = 'fadeInUp 0.6s ease forwards';
      e.target.style.opacity = '1';
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.stat-card,.why-card,.testi-card,.process-step').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});
