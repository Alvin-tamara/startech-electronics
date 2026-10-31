'use strict';
/* ELECTROHUB - Stage 1: theme, mobile menu, countdown, newsletter, loading states */
const $ = (s, r = document) => r.querySelector(s);
const store = {
  get: (k, d) => { try { const v = localStorage.getItem('eh_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem('eh_' + k, JSON.stringify(v)); } catch {} }
};

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  $('#toasts').append(el);
  setTimeout(() => el.remove(), 2800);
}

/* Dark mode */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#themeBtn').textContent = t === 'dark' ? '☀️' : '🌙';
  $('#themeBtn').setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
applyTheme(store.get('theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
$('#themeBtn').addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(t); store.set('theme', t);
});

/* Mobile menu */
const menuBtn = $('#menuBtn'), nav = $('#mainNav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? '✕' : '☰';
});
nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); menuBtn.textContent = '☰'; menuBtn.setAttribute('aria-expanded', false); } });

/* Flash-sale countdown (resets to 8 hours when it ends) */
function flashEnd() {
  let end = store.get('flashEnd', 0);
  if (end < Date.now()) { end = Date.now() + 8 * 3600e3; store.set('flashEnd', end); }
  return end;
}
function tick() {
  const left = Math.max(0, flashEnd() - Date.now()), p = n => String(n).padStart(2, '0');
  $('#cdH').textContent = p(Math.floor(left / 3600e3));
  $('#cdM').textContent = p(Math.floor(left / 60e3) % 60);
  $('#cdS').textContent = p(Math.floor(left / 1e3) % 60);
}
tick(); setInterval(tick, 1000);

/* Loading skeletons (replaced by products in Stage 2) */
document.querySelectorAll('[data-skeleton]').forEach(g => {
  g.innerHTML = '<div class="skeleton"></div>'.repeat(+g.dataset.skeleton);
});

/* Newsletter */
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('#newsEmail');
  if (!email.checkValidity() || !email.value) { toast('Enter a valid email address.'); email.focus(); return; }
  store.set('newsletter', email.value);
  toast('Subscribed. Check your inbox for this week’s deals.');
  e.target.reset();
});
