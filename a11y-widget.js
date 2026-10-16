/* =====================================================
   APEX BLOCK — Accessibility widget
   a11y-widget.js

   Botón flotante (abajo a la izquierda) que abre un panel de preferencias
   de accesibilidad: tamaño de letra, fuente para dislexia, espaciados,
   contrastes, saturación, guía de lectura, detener animaciones y cursor
   grande. Los ajustes se guardan en localStorage del visitante.

   - El panel vive en un Shadow DOM: los modos que alteran la página
     (contraste, fuentes...) nunca rompen el propio panel.
   - Se carga en <head> SIN defer para aplicar los ajustes guardados antes
     del primer pintado (sin parpadeo); la interfaz se monta al cargar el DOM.
   ===================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'apx-a11y-v1';
  var HOST_TAG = 'apexblock-a11y';
  var FONT_MIN = 80, FONT_MAX = 200, FONT_STEP = 10;
  var DYSLEXIA_CSS = 'https://cdn.jsdelivr.net/npm/@fontsource/opendyslexic/index.css';

  var I18N = {
    en: {
      title: 'Accessibility Menu', open: 'Open accessibility menu', close: 'Close accessibility menu',
      language: 'Language', content: 'Content Adjustments', color: 'Color Adjustments',
      navigation: 'Navigation Adjustments', fontSize: 'Font Size',
      decrease: 'Decrease font size', increase: 'Increase font size',
      highlightTitles: 'Highlight Titles', highlightLinks: 'Highlight Links',
      dyslexiaFont: 'Dyslexia Friendly Font', letterSpacing: 'Letter Spacing',
      lineHeight: 'Line Height', fontWeight: 'Bold Text', alignLeft: 'Align Left',
      darkContrast: 'Dark Contrast', lightContrast: 'Light Contrast', highContrast: 'High Contrast',
      highSaturation: 'High Saturation', lowSaturation: 'Low Saturation', monochrome: 'Monochrome',
      readingGuide: 'Reading Guide', stopAnimations: 'Stop Animations', bigCursor: 'Big Cursor',
      reset: 'Reset Settings'
    },
    el: {
      title: 'Μενού Προσβασιμότητας', open: 'Άνοιγμα μενού προσβασιμότητας', close: 'Κλείσιμο μενού προσβασιμότητας',
      language: 'Γλώσσα', content: 'Προσαρμογές Περιεχομένου', color: 'Προσαρμογές Χρώματος',
      navigation: 'Προσαρμογές Πλοήγησης', fontSize: 'Μέγεθος Γραμματοσειράς',
      decrease: 'Μείωση μεγέθους γραμματοσειράς', increase: 'Αύξηση μεγέθους γραμματοσειράς',
      highlightTitles: 'Επισήμανση Τίτλων', highlightLinks: 'Επισήμανση Συνδέσμων',
      dyslexiaFont: 'Γραμματοσειρά για Δυσλεξία', letterSpacing: 'Διάστημα Γραμμάτων',
      lineHeight: 'Ύψος Γραμμής', fontWeight: 'Έντονο Κείμενο', alignLeft: 'Στοίχιση Αριστερά',
      darkContrast: 'Σκούρη Αντίθεση', lightContrast: 'Ανοιχτή Αντίθεση', highContrast: 'Υψηλή Αντίθεση',
      highSaturation: 'Υψηλός Κορεσμός', lowSaturation: 'Χαμηλός Κορεσμός', monochrome: 'Μονόχρωμο',
      readingGuide: 'Οδηγός Ανάγνωσης', stopAnimations: 'Διακοπή Κινούμενων Εικόνων', bigCursor: 'Μεγάλος Δρομέας',
      reset: 'Επαναφορά Ρυθμίσεων'
    },
    es: {
      title: 'Menú de accesibilidad', open: 'Abrir menú de accesibilidad', close: 'Cerrar menú de accesibilidad',
      language: 'Idioma', content: 'Ajustes de contenido', color: 'Ajustes de color',
      navigation: 'Ajustes de navegación', fontSize: 'Tamaño de letra',
      decrease: 'Reducir tamaño de letra', increase: 'Aumentar tamaño de letra',
      highlightTitles: 'Resaltar títulos', highlightLinks: 'Resaltar enlaces',
      dyslexiaFont: 'Fuente para dislexia', letterSpacing: 'Espaciado de letras',
      lineHeight: 'Altura de línea', fontWeight: 'Texto en negrita', alignLeft: 'Alinear a la izquierda',
      darkContrast: 'Contraste oscuro', lightContrast: 'Contraste claro', highContrast: 'Alto contraste',
      highSaturation: 'Saturación alta', lowSaturation: 'Saturación baja', monochrome: 'Monocromo',
      readingGuide: 'Guía de lectura', stopAnimations: 'Detener animaciones', bigCursor: 'Cursor grande',
      reset: 'Restablecer ajustes'
    }
  };

  // Iconos de 24×24 con trazo currentColor
  var ICONS = {
    person: '<circle cx="12" cy="4.5" r="2.2"/><path d="M4.5 8.5l7.5 1.5 7.5-1.5M12 10v4.5M12 14.5l-3.5 6.5M12 14.5l3.5 6.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/>',
    minus: '<path d="M6 12h12"/>',
    plus: '<path d="M12 6v12M6 12h12"/>',
    fontSize: '<path d="M3 19L8.5 5 14 19M5 14h7M15 19l3.5-9 3.5 9M16 16h5"/>',
    highlightTitles: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 8h6M12 8v8"/>',
    highlightLinks: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    dyslexiaFont: '<path d="M4 18V6h3a6 6 0 0 1 0 12H4zM15 18V6h5M15 12h4"/>',
    letterSpacing: '<path d="M5 13L8 4l3 9M6 10h4M13 4l3 9 3-9M3 19h18M3 19l2-2M3 19l2 2M21 19l-2-2M21 19l-2 2"/>',
    lineHeight: '<path d="M11 6h10M11 12h10M11 18h10M5 4v16M3 6l2-2 2 2M3 18l2 2 2-2"/>',
    fontWeight: '<path d="M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7z"/>',
    alignLeft: '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
    darkContrast: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    lightContrast: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    highContrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
    highSaturation: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
    lowSaturation: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    monochrome: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>',
    readingGuide: '<path d="M3 12h18"/><rect x="3" y="9" width="18" height="6" rx="1.5"/><path d="M6 5h12M6 19h12"/>',
    stopAnimations: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
    bigCursor: '<path d="M5 3l13 9.5-6 1 3.5 6.5-2.6 1.4-3.5-6.6L5 19z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
  };

  var SECTIONS = [
    { key: 'content', items: ['highlightTitles', 'highlightLinks', 'dyslexiaFont', 'letterSpacing', 'lineHeight', 'fontWeight', 'alignLeft'] },
    { key: 'color', items: ['darkContrast', 'lightContrast', 'highContrast', 'highSaturation', 'lowSaturation', 'monochrome'] },
    { key: 'navigation', items: ['readingGuide', 'stopAnimations', 'bigCursor'] }
  ];
  // Opciones mutuamente excluyentes
  var EXCLUSIVE = [
    ['darkContrast', 'lightContrast', 'highContrast'],
    ['highSaturation', 'lowSaturation', 'monochrome']
  ];
  // Opción → clase en <html>
  var HTML_CLASS = {
    highlightTitles: 'apx-titles', highlightLinks: 'apx-links', dyslexiaFont: 'apx-dyslexia',
    letterSpacing: 'apx-spacing', lineHeight: 'apx-lineheight', fontWeight: 'apx-bold',
    alignLeft: 'apx-left', darkContrast: 'apx-dark', lightContrast: 'apx-light',
    stopAnimations: 'apx-noanim', bigCursor: 'apx-cursor'
  };

  /* ---------- Estado ---------- */
  // El idioma del panel sigue al de la web (<html lang>, que fija i18n.js)
  function pageLang() {
    var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return I18N[l] ? l : 'en';
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (s && typeof s === 'object') return s;
    } catch (e) { /* almacenamiento bloqueado: usamos valores por defecto */ }
    return null;
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: state.fontSize, on: state.on })); } catch (e) { /* ignorar */ }
  }
  var saved = load();
  var state = {
    lang: pageLang(),
    fontSize: (saved && saved.fontSize) || 100,
    on: (saved && saved.on) || {}
  };

  /* ---------- Estilos que afectan a la página ---------- */
  var NOT_WIDGET = ':not(' + HOST_TAG + ')';
  var NOT_ICON = ':not(i):not(svg):not(svg *):not([class*="fa-"])';
  var BIG_CURSOR = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath d='M5 3l13 9.5-6 1 3.5 6.5-2.6 1.4-3.5-6.6L5 19z' fill='%23000' stroke='%23fff' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E\") 6 4, auto";
  var BIG_POINTER = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath d='M5 3l13 9.5-6 1 3.5 6.5-2.6 1.4-3.5-6.6L5 19z' fill='%23F97316' stroke='%23000' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E\") 6 4, pointer";

  var PAGE_CSS = [
    // Tamaño de letra: la web usa rem, así que basta con escalar <html>
    'html.apx-fs{font-size:var(--apx-fs)!important}',
    // Resaltar títulos y enlaces (currentColor: siempre contrasta como el texto)
    'html.apx-titles :is(h1,h2,h3,h4,h5,h6){outline:3px solid currentColor!important;outline-offset:4px!important}',
    'html.apx-links a' + NOT_WIDGET + '{text-decoration:underline!important;text-decoration-thickness:2px!important;text-underline-offset:3px!important;outline:2px dashed currentColor!important;outline-offset:2px!important}',
    // Tipografía
    'html.apx-dyslexia body *' + NOT_WIDGET + NOT_ICON + '{font-family:"OpenDyslexic","Comic Sans MS",sans-serif!important}',
    'html.apx-spacing body *' + NOT_WIDGET + '{letter-spacing:.12em!important;word-spacing:.16em!important}',
    'html.apx-lineheight body *' + NOT_WIDGET + '{line-height:1.9!important}',
    'html.apx-bold body *' + NOT_WIDGET + NOT_ICON + '{font-weight:700!important}',
    'html.apx-left body *' + NOT_WIDGET + '{text-align:left!important}',
    // Filtros (alto contraste + saturación) sobre cada hijo de body salvo el widget
    'html.apx-filter body>*' + NOT_WIDGET + '{filter:var(--apx-filter)!important}',
    // Contraste oscuro: negro puro, texto blanco, enlaces amarillos
    'html.apx-dark body{background:#000!important}',
    'html.apx-dark body *' + NOT_WIDGET + ':not(img):not(video){background-color:transparent!important;background-image:none!important;color:#fff!important;border-color:#fff!important;text-shadow:none!important;box-shadow:none!important}',
    'html.apx-dark a' + NOT_WIDGET + ',html.apx-dark a *{color:#FFE600!important}',
    // Contraste claro: blanco puro, texto negro, enlaces azul oscuro
    'html.apx-light body{background:#fff!important}',
    'html.apx-light body *' + NOT_WIDGET + ':not(img):not(video){background-color:transparent!important;background-image:none!important;color:#000!important;border-color:#000!important;text-shadow:none!important;box-shadow:none!important}',
    'html.apx-light a' + NOT_WIDGET + ',html.apx-light a *{color:#0000B3!important}',
    // En ambos contrastes: controles con borde visible y capas superpuestas opacas
    'html:is(.apx-dark,.apx-light) :is(button,.btn,input,select,textarea)' + NOT_WIDGET + '{border:2px solid currentColor!important}',
    'html.apx-dark :is(.navbar,.nav-links,.portfolio-overlay,.flip-card-front,.flip-card-back,.float-badge,.about-metric-card,.portfolio-tag,.phone-mock,.terminal-card,.case-visual){background-color:#000!important}',
    'html.apx-light :is(.navbar,.nav-links,.portfolio-overlay,.flip-card-front,.flip-card-back,.float-badge,.about-metric-card,.portfolio-tag,.phone-mock,.terminal-card,.case-visual){background-color:#fff!important}',
    'html:is(.apx-dark,.apx-light) :is(.cursor-glow,.hero-orb,.hero-particles,.about-orb,.testimonials-orb,.cta-orb-1,.cta-orb-2,.footer-glow){display:none!important}',
    // Detener animaciones (también se aplica si el sistema pide reducir el movimiento)
    'html.apx-noanim *,html.apx-noanim *::before,html.apx-noanim *::after{animation-duration:0s!important;animation-iteration-count:1!important;transition:none!important;scroll-behavior:auto!important}',
    'html.apx-noanim{scroll-behavior:auto!important}',
    'html.apx-noanim :is(.hero-particles,.cursor-glow){display:none!important}',
    '@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0s!important;animation-iteration-count:1!important;transition:none!important;scroll-behavior:auto!important}html{scroll-behavior:auto!important}.hero-particles,.cursor-glow{display:none!important}}',
    // Cursor grande
    'html.apx-cursor,html.apx-cursor *{cursor:' + BIG_CURSOR + '!important}',
    'html.apx-cursor :is(a,button,select,label,[role="button"]),html.apx-cursor :is(a,button,label) *{cursor:' + BIG_POINTER + '!important}'
  ].join('\n');

  function injectPageStyles() {
    if (document.getElementById('apx-a11y-page')) return;
    var st = document.createElement('style');
    st.id = 'apx-a11y-page';
    st.textContent = PAGE_CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function ensureDyslexiaFont() {
    if (document.getElementById('apx-a11y-dyslexia')) return;
    var link = document.createElement('link');
    link.id = 'apx-a11y-dyslexia';
    link.rel = 'stylesheet';
    link.href = DYSLEXIA_CSS;
    document.head.appendChild(link);
  }

  /* ---------- Aplicar ajustes a la página ---------- */
  function applyToPage() {
    var root = document.documentElement;
    Object.keys(HTML_CLASS).forEach(function (k) {
      root.classList.toggle(HTML_CLASS[k], !!state.on[k]);
    });
    if (state.on.dyslexiaFont && document.head) ensureDyslexiaFont();

    // Texto ampliado: la web cambia el menú superior a hamburguesa (ver styles.css)
    root.classList.toggle('apx-fs-up', state.fontSize > 100);
    if (state.fontSize !== 100) {
      root.style.setProperty('--apx-fs', (16 * state.fontSize / 100) + 'px');
      root.classList.add('apx-fs');
    } else {
      root.classList.remove('apx-fs');
      root.style.removeProperty('--apx-fs');
    }

    var filters = [];
    if (state.on.highContrast) filters.push('contrast(1.35)');
    if (state.on.highSaturation) filters.push('saturate(1.7)');
    if (state.on.lowSaturation) filters.push('saturate(0.45)');
    if (state.on.monochrome) filters.push('grayscale(1)');
    if (filters.length) {
      root.style.setProperty('--apx-filter', filters.join(' '));
      root.classList.add('apx-filter');
    } else {
      root.classList.remove('apx-filter');
      root.style.removeProperty('--apx-filter');
    }

    if (guide) guide.hidden = !state.on.readingGuide;
  }

  // Aplicación temprana (antes de pintar) con los ajustes guardados
  injectPageStyles();
  applyToPage();

  /* ---------- Interfaz (Shadow DOM) ---------- */
  var WIDGET_CSS = [
    ':host{all:initial;position:fixed;left:0;bottom:0;z-index:2147483000;font-family:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:16px;line-height:1.4;color:#F5F7FA}',
    '*{box-sizing:border-box;margin:0;padding:0}',
    'svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}',
    '[hidden]{display:none!important}',
    'button,select{font:inherit;color:inherit}',
    ':focus-visible{outline:3px solid #C4B5FD;outline-offset:2px}',
    '.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    // Botón flotante: naranja con icono oscuro (7.0:1) y doble anillo visible sobre cualquier fondo
    '.trigger{position:fixed;left:20px;bottom:20px;width:60px;height:60px;border-radius:50%;border:3px solid #07040F;background:#A78BFA;color:#07040F;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 0 0 2px #F5F7FA,0 6px 24px rgba(0,0,0,.45)}',
    '.trigger svg{width:30px;height:30px;stroke-width:2.2}',
    '.trigger:hover{background:#C4B5FD}',
    '.trigger:focus-visible{outline:3px solid #F5F7FA;outline-offset:4px}',
    // Panel
    '.panel{position:fixed;left:16px;top:16px;bottom:16px;width:400px;max-width:calc(100vw - 32px);display:flex;flex-direction:column;background:#0E0A1C;border:1px solid rgba(255,255,255,.14);border-radius:16px;box-shadow:0 16px 60px rgba(0,0,0,.6);overflow:hidden}',
    '.head{display:flex;align-items:center;gap:10px;padding:14px 14px 14px 18px;background:#140F26;border-bottom:1px solid rgba(255,255,255,.1)}',
    '.head h2{flex:1;font-size:18px;font-weight:700;display:flex;align-items:center;gap:10px;color:#F5F7FA}',
    '.head h2 svg{color:#C4B5FD}',
    '.icon-btn{width:40px;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:#1B1433;display:flex;align-items:center;justify-content:center;cursor:pointer}',
    '.icon-btn:hover{border-color:#C4B5FD;color:#C4B5FD}',
    '.body{flex:1;overflow-y:auto;padding:16px 16px 8px;overscroll-behavior:contain}',
    'h3{font-size:14px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#B4BCC8;margin:6px 2px 12px}',
    '.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}',
    '.tile{position:relative;min-height:96px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:12px 8px;border-radius:12px;background:#140F26;border:2px solid rgba(255,255,255,.12);text-align:center;font-size:13px;font-weight:600;line-height:1.25;cursor:pointer;color:#F5F7FA}',
    '.tile:hover{border-color:rgba(196,181,253,.6)}',
    '.tile[aria-pressed="true"]{background:#1E1240;border-color:#A78BFA;color:#DDD6FE}',
    '.tile .tick{display:none;position:absolute;top:6px;right:6px;width:20px;height:20px;border-radius:50%;background:#A78BFA;color:#07040F;align-items:center;justify-content:center}',
    '.tile .tick svg{width:14px;height:14px;stroke-width:3}',
    '.tile[aria-pressed="true"] .tick{display:flex}',
    '.size{grid-column:span 3;display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;background:#140F26;border:2px solid rgba(255,255,255,.12)}',
    '.size .label{flex:1;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600}',
    '.size .step{width:40px;height:40px;border-radius:50%;border:2px solid #A78BFA;background:#A78BFA;color:#07040F;display:flex;align-items:center;justify-content:center;cursor:pointer}',
    '.size .step svg{stroke-width:2.6}',
    '.size .step:disabled{background:transparent;color:#9AA3B0;border-color:#4B5563;cursor:not-allowed}',
    '.size output{min-width:64px;text-align:center;font-size:15px;font-weight:700;padding:8px 6px;border-radius:999px;background:#0E0A1C;border:1px solid rgba(255,255,255,.18)}',
    '.foot{padding:12px 16px 16px;border-top:1px solid rgba(255,255,255,.1);background:#140F26}',
    '.reset{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:10px;border:2px solid #A78BFA;background:transparent;color:#DDD6FE;font-size:15px;font-weight:700;cursor:pointer}',
    '.reset:hover{background:#1E1240}',
    // Guía de lectura
    '.guide{position:fixed;left:0;right:0;height:12px;margin-top:-6px;background:#C4B5FD;border-top:3px solid #07040F;border-bottom:3px solid #07040F;pointer-events:none;box-shadow:0 0 0 2px rgba(244,244,248,.9)}',
    '@media (max-width:480px){.panel{left:8px;right:8px;top:8px;bottom:8px;width:auto;max-width:none}.grid{grid-template-columns:repeat(2,1fr)}.size{grid-column:span 2}.trigger{left:14px;bottom:14px;width:56px;height:56px}}',
    // Animaciones de apertura/cierre (solo se aplican si el visitante no ha pedido reducir el movimiento: ver motionAllowed)
    '.panel{transform-origin:left bottom}',
    '.panel.anim-in{animation:apx-panel-in .26s cubic-bezier(.2,.8,.2,1)}',
    '.panel.anim-out{animation:apx-panel-out .18s cubic-bezier(.4,0,1,1) forwards}',
    '.trigger.anim-in{animation:apx-pop .24s cubic-bezier(.2,.8,.2,1)}',
    '@keyframes apx-panel-in{from{opacity:0;transform:translateX(-24px) scale(.97)}to{opacity:1;transform:none}}',
    '@keyframes apx-panel-out{from{opacity:1;transform:none}to{opacity:0;transform:translateX(-24px) scale(.97)}}',
    '@keyframes apx-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}'
  ].join('\n');

  function svg(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }

  var host, shadow, trigger, panel, guide, sizeOut, decBtn, incBtn, lastFocus;

  function t(key) { return I18N[state.lang][key]; }

  function render() {
    var sectionsHtml = SECTIONS.map(function (sec) {
      var tiles = sec.items.map(function (key) {
        return '<button type="button" class="tile" data-key="' + key + '" aria-pressed="' + (!!state.on[key]) + '">' +
          '<span class="tick" aria-hidden="true">' + svg('check') + '</span>' +
          svg(key) + '<span>' + t(key) + '</span></button>';
      }).join('');
      var size = sec.key === 'content'
        ? '<div class="size" role="group" aria-labelledby="apx-fs-label">' +
            '<span class="label" id="apx-fs-label">' + svg('fontSize') + t('fontSize') + '</span>' +
            '<button type="button" class="step" data-step="-1" aria-label="' + t('decrease') + '">' + svg('minus') + '</button>' +
            '<output aria-live="polite">' + state.fontSize + '%</output>' +
            '<button type="button" class="step" data-step="1" aria-label="' + t('increase') + '">' + svg('plus') + '</button>' +
          '</div>'
        : '';
      return '<h3 id="apx-sec-' + sec.key + '">' + t(sec.key) + '</h3>' +
        '<div class="grid" role="group" aria-labelledby="apx-sec-' + sec.key + '">' + size + tiles + '</div>';
    }).join('');

    var wasOpen = panel && !panel.hidden;

    shadow.innerHTML =
      '<style>' + WIDGET_CSS + '</style>' +
      '<aside aria-label="' + t('title') + '" lang="' + state.lang + '">' +
        '<button type="button" class="trigger" aria-haspopup="dialog" aria-expanded="false" aria-controls="apx-panel" aria-label="' + t('open') + '">' + svg('person') + '</button>' +
        '<div class="panel" id="apx-panel" role="dialog" aria-modal="true" aria-labelledby="apx-title" hidden>' +
          '<div class="head">' +
            '<h2 id="apx-title">' + svg('person') + t('title') + '</h2>' +
            '<button type="button" class="icon-btn" data-action="reset" aria-label="' + t('reset') + '">' + svg('reset') + '</button>' +
            '<button type="button" class="icon-btn" data-action="close" aria-label="' + t('close') + '">' + svg('close') + '</button>' +
          '</div>' +
          '<div class="body">' +
            sectionsHtml +
          '</div>' +
          '<div class="foot"><button type="button" class="reset" data-action="reset">' + svg('reset') + t('reset') + '</button></div>' +
        '</div>' +
      '</aside>' +
      '<div class="guide" aria-hidden="true" hidden></div>';

    trigger = shadow.querySelector('.trigger');
    panel = shadow.querySelector('.panel');
    guide = shadow.querySelector('.guide');
    sizeOut = shadow.querySelector('output');
    decBtn = shadow.querySelector('[data-step="-1"]');
    incBtn = shadow.querySelector('[data-step="1"]');
    updateSizeButtons();
    guide.hidden = !state.on.readingGuide;

    if (wasOpen) openPanel(null, true); // al cambiar de idioma, sin volver a animar
  }

  function updateSizeButtons() {
    decBtn.disabled = state.fontSize <= FONT_MIN;
    incBtn.disabled = state.fontSize >= FONT_MAX;
    sizeOut.textContent = state.fontSize + '%';
  }

  function toggle(key) {
    var next = !state.on[key];
    EXCLUSIVE.forEach(function (group) {
      if (next && group.indexOf(key) !== -1) group.forEach(function (k) { state.on[k] = false; });
    });
    state.on[key] = next;
    shadow.querySelectorAll('.tile').forEach(function (tile) {
      tile.setAttribute('aria-pressed', String(!!state.on[tile.dataset.key]));
    });
    applyToPage();
    save();
  }

  function setFontSize(delta) {
    state.fontSize = Math.min(FONT_MAX, Math.max(FONT_MIN, state.fontSize + delta * FONT_STEP));
    updateSizeButtons();
    applyToPage();
    save();
  }

  function resetAll() {
    state.on = {};
    state.fontSize = 100;
    shadow.querySelectorAll('.tile').forEach(function (tile) { tile.setAttribute('aria-pressed', 'false'); });
    updateSizeButtons();
    applyToPage();
    save();
  }

  function focusables() {
    return Array.prototype.filter.call(
      panel.querySelectorAll('button,select,[tabindex]:not([tabindex="-1"])'),
      function (el) { return !el.disabled; }
    );
  }

  // El menú respeta la opción "Detener animaciones" y la preferencia del sistema
  function motionAllowed() {
    if (state.on.stopAnimations) return false;
    return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function animate(el, cls, done) {
    el.classList.remove('anim-in', 'anim-out');
    if (!motionAllowed()) { if (done) done(); return; }
    void el.offsetWidth; // reinicia la animación si se repite
    el.classList.add(cls);
    var finished = false;
    function end() {
      if (finished) return;
      finished = true;
      el.removeEventListener('animationend', end);
      el.classList.remove(cls);
      if (done) done();
    }
    el.addEventListener('animationend', end);
    setTimeout(end, 450); // por si animationend no llega (pestaña en segundo plano, etc.)
  }

  var closing = false;

  function openPanel(focusTarget, instant) {
    closing = false;
    lastFocus = lastFocus || trigger;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    trigger.hidden = true;
    if (!instant) animate(panel, 'anim-in');
    (focusTarget || shadow.querySelector('[data-action="close"]')).focus();
  }

  function closePanel() {
    if (closing || panel.hidden) return;
    closing = true;
    trigger.setAttribute('aria-expanded', 'false');
    animate(panel, 'anim-out', function () {
      if (!closing) return; // se volvió a abrir durante la animación de cierre
      closing = false;
      panel.hidden = true;
      trigger.hidden = false;
      animate(trigger, 'anim-in');
      trigger.focus();
      lastFocus = null;
    });
  }

  function onClick(e) {
    var el = e.target.closest('button');
    if (!el) return;
    if (el === trigger) { lastFocus = trigger; openPanel(); return; }
    if (el.dataset.key) { toggle(el.dataset.key); return; }
    if (el.dataset.step) { setFontSize(Number(el.dataset.step)); return; }
    if (el.dataset.action === 'close') { closePanel(); return; }
    if (el.dataset.action === 'reset') { resetAll(); }
  }

  function onKeydown(e) {
    if (panel.hidden || closing) return;
    if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }
    if (e.key !== 'Tab') return;
    // Foco atrapado dentro del diálogo
    var items = focusables();
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    var active = shadow.activeElement;
    if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }

  // Cambio de idioma de la web → se re-renderiza el panel en ese idioma
  function onPageLangChange() {
    var l = pageLang();
    if (l === state.lang || !shadow) return;
    state.lang = l;
    render();
  }

  function onMouseMove(e) {
    if (guide && !guide.hidden) guide.style.top = e.clientY + 'px';
  }

  function mount() {
    if (document.querySelector(HOST_TAG)) return;
    host = document.createElement(HOST_TAG);
    document.body.appendChild(host);
    shadow = host.attachShadow({ mode: 'open' });
    render();
    shadow.addEventListener('click', onClick);
    shadow.addEventListener('keydown', onKeydown);
    document.addEventListener('apx:langchange', onPageLangChange);
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    applyToPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
