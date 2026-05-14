// ============================================================
// VELOX WRAP STUDIO — main.js
// Shared across all pages
// ============================================================

// ── Supabase ─────────────────────────────────────────────────
const SB_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SB_KEY = 'YOUR_ANON_PUBLIC_KEY';
let sb = null;
try {
  if(window.supabase) sb = supabase.createClient(SB_URL, SB_KEY);
} catch(e){}

// ── Navbar scroll ─────────────────────────────────────────────
const nb = document.getElementById('nb');
if(nb) window.addEventListener('scroll', () => nb.classList.toggle('scrolled', scrollY > 40));

// ── Hamburger ─────────────────────────────────────────────────
const hbg = document.getElementById('hbg');
const mm  = document.getElementById('mm');
if(hbg && mm){
  hbg.addEventListener('click', () => { hbg.classList.toggle('open'); mm.classList.toggle('open'); });
  document.querySelectorAll('.ml').forEach(l => l.addEventListener('click', () => {
    hbg.classList.remove('open'); mm.classList.remove('open');
  }));
}

// ── Active nav link ───────────────────────────────────────────
(()=>{
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if(a.getAttribute('href') === path) a.classList.add('active');
  });
})();

// ── Language switch ───────────────────────────────────────────
let lang = localStorage.getItem('lang') || 'it';
const litEl = document.getElementById('lit');
const lenEl = document.getElementById('len');
function setLang(l){
  lang = l;
  localStorage.setItem('lang', l);
  if(litEl) litEl.classList.toggle('lang-active', l==='it');
  if(lenEl) lenEl.classList.toggle('lang-active', l==='en');
  document.querySelectorAll('[data-it],[data-en]').forEach(el => {
    const v = el.getAttribute('data-'+l); if(!v) return;
    if(v.includes('<br>')) el.innerHTML = v; else el.textContent = v;
  });
}
if(litEl) litEl.addEventListener('click', () => setLang('it'));
if(lenEl) lenEl.addEventListener('click', () => setLang('en'));
setLang(lang);

// ── Scroll Reveal ─────────────────────────────────────────────
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if(e.isIntersecting){
      setTimeout(() => e.target.classList.add('vis'), i * 60);
      ro.unobserve(e.target);
    }
  });
}, {threshold: 0.1});
document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s').forEach(el => ro.observe(el));

// ── Counter animation ─────────────────────────────────────────
function animCounter(el, target, suffix, dur=1400){
  let start = null;
  function step(ts){
    if(!start) start = ts;
    const p = Math.min((ts-start)/dur, 1);
    const ease = 1 - Math.pow(1-p, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const cro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      animCounter(e.target, +e.target.dataset.target, e.target.dataset.suffix||'');
      cro.unobserve(e.target);
    }
  });
}, {threshold:.5});
document.querySelectorAll('.stat-n[data-target]').forEach(el => cro.observe(el));

// ── Timeline dots ─────────────────────────────────────────────
['d1','d2','d3','d4','d5'].forEach((id,i) => {
  const dot = document.getElementById(id);
  if(!dot) return;
  const dro = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting){ setTimeout(()=>dot.classList.add('lit'), 200+i*150); dro.unobserve(dot); }
  },{threshold:.8});
  dro.observe(dot);
});

// ── Before/After Slider ───────────────────────────────────────
const slides = [
  { name:'SPORT COUPÉ', before:'https://images.unsplash.com/photo-1617814065893-00757125efab?w=1400&q=85', after:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=85' },
  { name:'DUCATI PANIGALE', before:'https://images.unsplash.com/photo-1558618047-3c8d53af0c4f?w=1400&q=85', after:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85' },
  { name:'INTERIOR LUXURY', before:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=85', after:'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1400&q=85' },
];
let si=0, pct=50, drag=false;
const bas=document.getElementById('bas'), baft=document.getElementById('baft'),
      bhdl=document.getElementById('bhdl'), bpctEl=document.getElementById('bpct'),
      bnm=document.getElementById('bnm'), bctr=document.getElementById('bctr'),
      bimg=document.getElementById('bimg'), aimg=document.getElementById('aimg');
if(bas){
  function loadSlide(i){
    bimg.style.backgroundImage=`url('${slides[i].before}')`;
    aimg.style.backgroundImage=`url('${slides[i].after}')`;
    bnm.textContent=slides[i].name;
    bctr.textContent=`${i+1} / ${slides.length}`;
    setPct(50);
  }
  function setPct(p){
    pct=Math.max(2,Math.min(98,p));
    baft.style.left=pct+'%'; bhdl.style.left=pct+'%';
    if(bpctEl) bpctEl.textContent=Math.round(pct)+'%';
    aimg.style.width=(100/((100-pct)/100))+'%';
    aimg.style.left=-(pct/(100-pct)*100)+'%';
  }
  function getX(e){ return e.touches?e.touches[0].clientX:e.clientX; }
  bas.addEventListener('mousedown',e=>{drag=true;move(e);});
  bas.addEventListener('touchstart',e=>{drag=true;move(e);},{passive:true});
  window.addEventListener('mousemove',e=>{if(drag)move(e);});
  window.addEventListener('touchmove',e=>{if(drag)move(e);},{passive:true});
  window.addEventListener('mouseup',()=>drag=false);
  window.addEventListener('touchend',()=>drag=false);
  function move(e){ const r=bas.getBoundingClientRect(); setPct(((getX(e)-r.left)/r.width)*100); }
  document.getElementById('bprev')?.addEventListener('click',()=>{si=(si-1+slides.length)%slides.length;loadSlide(si);});
  document.getElementById('bnext')?.addEventListener('click',()=>{si=(si+1)%slides.length;loadSlide(si);});
  loadSlide(0);
}

// ── Contact Form ──────────────────────────────────────────────
const bsub = document.getElementById('bsub');
const fst  = document.getElementById('fst');
if(bsub){
  bsub.addEventListener('click', async () => {
    const nome  = document.getElementById('fn')?.value.trim();
    const email = document.getElementById('fe')?.value.trim();
    const tel   = document.getElementById('ft')?.value.trim();
    const serv  = document.getElementById('fs')?.value;
    const veic  = document.getElementById('fv')?.value.trim();
    const msg   = document.getElementById('fm')?.value.trim();
    if(!nome||!email){
      fst.textContent = lang==='it'?'Nome e email sono obbligatori.':'Name and email are required.';
      fst.className='fst err'; return;
    }
    bsub.disabled=true; bsub.textContent=lang==='it'?'INVIO…':'SENDING…';
    try{
      if(!sb||SB_URL.includes('YOUR_PROJECT')){ await new Promise(r=>setTimeout(r,800)); throw new Error('DEMO'); }
      const {error} = await sb.from('richieste_preventivo').insert([{nome,email,telefono:tel,servizio:serv,veicolo:veic,messaggio:msg}]);
      if(error) throw error;
      fst.textContent = lang==='it'?'✓ Richiesta inviata! Risponderemo entro 24 ore.':'✓ Request sent! We will reply within 24 hours.';
      fst.className='fst ok';
      ['fn','fe','ft','fv','fm'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
      const fs=document.getElementById('fs'); if(fs) fs.value='';
    } catch(err){
      if(err.message==='DEMO'){
        fst.textContent='✓ Demo: form funzionante. Configura Supabase per ricevere veri preventivi.';
        fst.className='fst ok';
      } else {
        fst.textContent=lang==='it'?'✗ Errore. Contattaci su WhatsApp.':'✗ Error. Contact us on WhatsApp.';
        fst.className='fst err';
      }
    } finally {
      bsub.disabled=false;
      bsub.setAttribute('data-it','INVIA RICHIESTA ✈');
      bsub.setAttribute('data-en','SEND REQUEST ✈');
      bsub.textContent=lang==='it'?'INVIA RICHIESTA ✈':'SEND REQUEST ✈';
    }
  });
}
