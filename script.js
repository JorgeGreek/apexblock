/* =====================================================
   APEX BLOCK — Futurist variant · script.js
   ===================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- scroll progress + navbar ---------- */
  const progress = document.getElementById('scrollProgress');
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    navbar.classList.toggle('scrolled', scrollY > 40);
    let current = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - 140) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- hamburger ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      const open = navLinksEl.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinksEl.classList.remove('open'); hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- custom cursor ---------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (dot && ring && finePointer && !reduceMotion) {
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
    (function follow() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`; requestAnimationFrame(follow); })();
    document.querySelectorAll('a, button, .card, .work-card, .step').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
    });
  }

  /* ---------- decentralized mesh canvas ---------- */
  const canvas = document.getElementById('meshCanvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
    const COLORS = ['34,211,238', '167,139,250', '244,114,182'];
    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width * devicePixelRatio; H = canvas.height = r.height * devicePixelRatio;
      canvas.style.width = r.width + 'px'; canvas.style.height = r.height + 'px';
      const count = Math.min(110, Math.floor((r.width * r.height) / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .25 * devicePixelRatio, vy: (Math.random() - .5) * .25 * devicePixelRatio,
        r: (Math.random() * 1.6 + .8) * devicePixelRatio, c: COLORS[Math.floor(Math.random() * 3)],
      }));
    };
    resize();
    addEventListener('resize', resize);
    canvas.parentElement.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * devicePixelRatio; mouse.y = (e.clientY - r.top) * devicePixelRatio;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
    const LINK = 150 * devicePixelRatio, MOUSE = 220 * devicePixelRatio;
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    (function draw() {
      requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < MOUSE) { n.x += dx / d * .6; n.y += dy / d * .6; }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]; const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${a.c},${(1 - d / LINK) * .28})`; ctx.lineWidth = devicePixelRatio * .8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < MOUSE) {
          ctx.strokeStyle = `rgba(255,255,255,${(1 - dm / MOUSE) * .35})`; ctx.lineWidth = devicePixelRatio;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = `rgba(${a.c},.9)`; ctx.shadowColor = `rgba(${a.c},.9)`; ctx.shadowBlur = 8 * devicePixelRatio;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }
    })();
  }

  /* ---------- rotating headline ---------- */
  const rot = document.getElementById('rotator');
  if (rot) {
    let words = (window.ApexI18n && ApexI18n.rotatorWords()) || ['decentralized protocols', 'DeFi systems', 'native mobile dApps', 'ZK rollups', 'trustless wallets', 'tokenized assets'];
    let i = 0;
    // Shrink the word so it never wraps or gets clipped by the single-line mask.
    const fit = () => {
      rot.style.fontSize = '';
      const avail = rot.parentElement.clientWidth;
      const need = rot.scrollWidth;
      if (need > avail) rot.style.fontSize = Math.max(55, Math.floor((avail / need) * 100)) + '%';
    };
    fit();
    addEventListener('resize', fit);
    // Language switch: i18n.js rewrites the word (data-i18n), so restart the cycle with the new list.
    document.addEventListener('apx:langchange', () => {
      words = (window.ApexI18n && ApexI18n.rotatorWords()) || words;
      i = 0; rot.textContent = words[0]; fit();
    });
    if (!reduceMotion) setInterval(() => {
      rot.classList.remove('in'); rot.classList.add('out');
      setTimeout(() => { i = (i + 1) % words.length; rot.textContent = words[i]; fit(); rot.classList.remove('out'); rot.classList.add('in'); }, 350);
    }, 2800);
  }

  /* ---------- live-ish HUD numbers ---------- */
  const fmt = n => n.toLocaleString('en-US');
  const tick = (el, base, jitter, every) => { if (!el || reduceMotion) return; let v = base; setInterval(() => { v += Math.round((Math.random() - .3) * jitter); el.textContent = fmt(v); }, every); };
  tick(document.getElementById('blockTicker'), 21904113, 2, 1200);
  tick(document.getElementById('hudTps'), 4812, 120, 900);
  tick(document.getElementById('hudNodes'), 1204, 4, 2500);

  /* ---------- counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = el => {
    if (el.dataset.done) return; el.dataset.done = '1';
    const target = +el.dataset.count;
    if (reduceMotion) { el.textContent = target; return; }
    const t0 = performance.now(), dur = 1600;
    (function step(t) { const p = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - p, 3); el.textContent = Math.floor(target * e); if (p < 1) requestAnimationFrame(step); })(t0);
  };

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const delay = +(en.target.dataset.delay || 0);
      setTimeout(() => en.target.classList.add('in'), delay);
      en.target.querySelectorAll('[data-count]').forEach(runCounter);
      if (en.target.matches('[data-count]')) runCounter(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  setTimeout(() => document.querySelectorAll('[data-reveal]').forEach(el => { if (el.getBoundingClientRect().top < innerHeight * .9) { el.classList.add('in'); el.querySelectorAll('[data-count]').forEach(runCounter); } }), 150);

  /* ---------- dial + process line ---------- */
  const dial = document.querySelector('.dial');
  if (dial) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { dial.classList.add('on'); o.disconnect(); } }, { threshold: .4 }).observe(dial);
  const stepsFill = document.getElementById('stepsFill');
  if (stepsFill) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { stepsFill.style.width = '100%'; o.disconnect(); } }, { threshold: .3 }).observe(document.getElementById('steps'));

  /* ---------- spotlight + 3D tilt ---------- */
  document.querySelectorAll('.spotlight').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- smooth anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href'); if (href === '#') return;
    const t = document.querySelector(href); if (!t) return;
    e.preventDefault();
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - 88, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  /* ---------- contact form ---------- */
  // Paste your lead endpoint URL here (Google Apps Script web app, Formspree, own API).
  // While it starts with "PASTE_", the form falls back to the visitor's email client.
  const LEADS_ENDPOINT = 'PASTE_YOUR_LEADS_ENDPOINT_URL_HERE';
  const FALLBACK_EMAIL = 'hello@apexblock.tech';
  const form = document.getElementById('contactForm');
  const $ = id => document.getElementById(id);
  const labelOf = s => s.options[s.selectedIndex]?.text || '';
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = $('contactName').value.trim(), email = $('contactEmail').value.trim(), company = $('contactCompany').value.trim();
      const service = $('contactService'), chain = $('contactChain'), budget = $('contactBudget');
      const message = $('contactMessage').value.trim(), consent = $('contactConsent').checked, hp = $('contactCompanyHp').value;
      const checks = [[$('contactName'), !!name], [$('contactEmail'), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)], [service, !!service.value], [chain, !!chain.value], [$('contactMessage'), !!message]];
      let ok = consent;
      checks.forEach(([el, v]) => { el.classList.toggle('invalid', !v); if (!v) ok = false; });
      if (!ok) { const btn = $('contactSubmit'); btn.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 350 }); checks.find(([, v]) => !v)?.[0].focus(); return; }
      $('formSuccess').classList.remove('show'); $('formError').classList.remove('show');
      $('submitText').style.display = 'none'; $('submitLoader').style.display = 'inline-flex';
      const payload = { name, email, company, service: service.value, service_label: labelOf(service), chain: chain.value, chain_label: labelOf(chain), budget: budget.value, budget_label: labelOf(budget), message, website_hp: hp, page: location.href };
      try {
        if (LEADS_ENDPOINT.indexOf('PASTE_') === 0) {
          const subject = encodeURIComponent(`Quote request — ${labelOf(service)} (${labelOf(chain)})`);
          const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company || '-'}\nService: ${labelOf(service)}\nTarget chain: ${labelOf(chain)}\nBudget: ${labelOf(budget) || '-'}\n\n${message}`);
          location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
          $('formSuccess').classList.add('show'); form.reset(); return;
        }
        const res = await fetch(LEADS_ENDPOINT, { method: 'POST', body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok || data.result !== 'success') throw new Error(data.message || 'Bad response');
        $('formSuccess').classList.add('show'); form.reset();
      } catch (err) {
        console.error('Lead submission failed:', err); $('formError').classList.add('show');
      } finally {
        $('submitText').style.display = 'inline-flex'; $('submitLoader').style.display = 'none';
      }
    });
    form.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('input', () => el.classList.remove('invalid')));
  }
});
