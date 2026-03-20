import React, { useState, useRef, useEffect } from 'react';
import {
  motion, AnimatePresence, useInView,
  useScroll, useTransform, useMotionValue, useSpring,
} from 'framer-motion';

/*
  FONTS — index.html <head>:
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
*/

/* ════════════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════════════ */
const T = {
  bg:     '#071E30',
  bgCard: '#0A2640',
  bgDeep: '#051525',
  brand:  '#02537E',
  active: '#0A8FC7',
  cyan:   '#1EB8F0',
  white:  '#E8F4FC',
  muted:  'rgba(184,223,240,0.44)',
  dim:    'rgba(184,223,240,0.22)',
  text:   'rgba(200,235,248,0.88)',
};
const SILK  = [0.16, 1,    0.3,  1];
const EXPO  = [0.76, 0,    0.24, 1];
const SWOOP = [0.22, 1.12, 0.36, 1]; // slight overshoot

/* ════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════ */
const STATS = [
  { val: 11,  suffix: '+', label: 'Años de\nexperiencia',       tag: 'AÑO FUND. 2014' },
  { val: 100, suffix: '+', label: 'Proyectos\ncompletados',     tag: 'SECTOR ENERGÉTICO' },
  { val: 95,  suffix: '%', label: 'Tasa de\néxito',             tag: 'RESULTADOS' },
  { val: 500, suffix: '+', label: 'Profesionales\ncapacitados', tag: 'IN-HOUSE' },
];

const CLIENTS = [
  'ENGIE Perú','PETROPERÚ','OSINERGMIN','COES','ELECTROPERÚ',
  'Ministerio de Energía y Minas','EGEMSA','Grupo Breca','CHALCO','ENOTRIA',
];

const TEAM = [
  {
    id: 'luis',
    initials: 'LE',
    name: 'Luis Alberto Espinoza Quiñones',
    nameShort: 'Luis Alberto\nEspinoza',
    role: 'Fundador & Director General',
    formation: 'Ing. Mecánico Electricista · UNI  /  MBA · ESAN',
    bio: 'Más de 25 años liderando proyectos en el sector energético peruano. Arquitecto de políticas regulatorias, contratos PPA hasta 500 MW y planes estratégicos de alcance nacional con impacto directo en 150,000 beneficiarios.',
    expertise: [
      { label: 'Regulación eléctrica',    pct: 96 },
      { label: 'Contratos de energía',    pct: 92 },
      { label: 'Planificación energética', pct: 88 },
      { label: 'Gas natural',             pct: 85 },
    ],
    tags: ['Electricidad','Hidrocarburos','Gas Natural','PPA'],
    stat: { val: '25+', label: 'años experiencia' },
    color: T.cyan,
  },
  {
    id: 'alexandra',
    initials: 'AC',
    name: 'Alexandra Ching Espinosa',
    nameShort: 'Alexandra\nChing Espinosa',
    role: 'Directora Legal & Regulatoria',
    formation: 'Abogada · USMP  /  Maestría Finanzas & Derecho Corp. · ESAN',
    bio: '12 años especializados en regulación energética y contratos de gas natural. Referente en controversias ante OSINERGMIN y COES, con más de 27 pericias técnicas que resolvieron disputas de alta complejidad para el sector.',
    expertise: [
      { label: 'Derecho energético',     pct: 97 },
      { label: 'Contratos gas natural',  pct: 94 },
      { label: 'Pericia técnica',        pct: 90 },
      { label: 'Regulación OSINERGMIN',  pct: 88 },
    ],
    tags: ['Regulación','Derecho Energético','Contratos','COES'],
    stat: { val: '27+', label: 'pericias técnicas' },
    color: T.active,
  },
];

const VALUES = [
  { num: '01', label: 'Excelencia',
    desc: 'Los más altos estándares de calidad en cada entregable, sin concesiones ni atajos.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
  { num: '02', label: 'Confianza',
    desc: 'Relaciones de largo plazo sustentadas en transparencia absoluta y resultados comprobados.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { num: '03', label: 'Precisión',
    desc: 'Análisis técnico meticuloso y ejecución rigurosa en cada proceso regulatorio.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg> },
  { num: '04', label: 'Innovación',
    desc: 'Soluciones creativas y tecnológicamente avanzadas para desafíos energéticos complejos.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg> },
  { num: '05', label: 'Colaboración',
    desc: 'Integración total con el equipo del cliente para construir soluciones que perduran.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { num: '06', label: 'Resultados',
    desc: 'Orientación permanente a generar valor tangible, medible e impacto real en el sector.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg> },
];

const TIMELINE = [
  { year: '2014', title: 'Fundación',                            desc: 'El Ing. Luis Espinoza Quiñones funda LAEQ & Asociados con foco en desarrollo de mercados energéticos en el Perú.',                           kpi: 'Año 0',          highlight: true  },
  { year: '2015', title: 'Gas Natural & Regulación',             desc: 'Incorporación de servicios en regulación de gas natural, contratos de transporte y distribución ante OSINERGMIN y el MINEM.',                kpi: '2 servicios',    highlight: false },
  { year: '2017', title: 'Plan de Electrificación Rural',        desc: 'Co-diseño del Plan Nacional de Electrificación Rural con el Ministerio de Energía y Minas. Impacto: 150,000 beneficiarios.',               kpi: '150K benefic.',  highlight: true  },
  { year: '2019', title: 'Consolidación del Equipo Directivo',   desc: 'Se incorpora Alexandra Ching Espinosa como Directora Legal & Regulatoria. Superamos los 50 clientes activos.',                             kpi: '50+ clientes',   highlight: false },
  { year: '2021', title: 'PPA & Energías Renovables',            desc: 'Estructuración de PPAs para proyectos hasta 500 MW. Asesoría integral en energía solar y eólica con ENGIE Perú y clientes libres.',         kpi: '500 MW',         highlight: true  },
  { year: '2023', title: 'Pericia Técnica & Controversias',      desc: 'Liderazgo en resolución de controversias: más de 27 pericias técnicas ante OSINERGMIN, COES y tribunales arbitrales.',                       kpi: '27+ pericias',   highlight: false },
  { year: '2025', title: '11 Años · Referente Nacional',         desc: 'Más de 100 proyectos completados, 95% tasa de éxito y 500+ profesionales capacitados. Líderes del sector energético peruano.',               kpi: '100+ proyectos', highlight: true  },
];

/* ════════════════════════════════════════════════════
   CURSOR PERSONALIZADO
════════════════════════════════════════════════════ */
const Cursor = () => {
  const cx = useMotionValue(-200); const cy = useMotionValue(-200);
  const tx = useSpring(cx, { stiffness: 65, damping: 15 });
  const ty = useSpring(cy, { stiffness: 65, damping: 15 });
  const [mode, setMode] = useState('idle'); // idle | hover | drag

  useEffect(() => {
    const mv = e => { cx.set(e.clientX); cy.set(e.clientY); };
    const ov = e => e.target.closest('[data-c]') && setMode('hover');
    const ou = e => e.target.closest('[data-c]') && setMode('idle');
    const md = () => setMode(m => m === 'hover' ? 'drag' : m);
    const mu = () => setMode(m => m === 'drag'  ? 'hover' : 'idle');
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseover', ov);
    window.addEventListener('mouseout',  ou);
    window.addEventListener('mousedown', md);
    window.addEventListener('mouseup',   mu);
    return () => {
      window.removeEventListener('mousemove', mv);
      window.removeEventListener('mouseover', ov);
      window.removeEventListener('mouseout',  ou);
      window.removeEventListener('mousedown', md);
      window.removeEventListener('mouseup',   mu);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <motion.div style={{ position:'fixed', top:0, left:0, pointerEvents:'none', zIndex:9999, x:cx, y:cy, translateX:'-50%', translateY:'-50%' }}>
        <motion.div
          animate={{ scale: mode==='drag' ? 0.3 : mode==='hover' ? 0 : 1 }}
          transition={{ duration:0.18, ease:EXPO }}
          style={{ width:6, height:6, borderRadius:'50%', background:T.cyan }}
        />
      </motion.div>
      {/* Outer ring */}
      <motion.div style={{ position:'fixed', top:0, left:0, pointerEvents:'none', zIndex:9998, x:tx, y:ty, translateX:'-50%', translateY:'-50%' }}>
        <motion.div
          animate={{
            width:  mode==='hover' ? 52 : mode==='drag' ? 18 : 34,
            height: mode==='hover' ? 52 : mode==='drag' ? 18 : 34,
            opacity: mode==='drag' ? 1 : 0.45,
            borderColor: mode==='hover' ? T.cyan : `${T.cyan}88`,
            background: mode==='hover' ? `${T.cyan}0E` : 'transparent',
          }}
          transition={{ duration:0.3, ease:SILK }}
          style={{ borderRadius:'50%', border:`1px solid ${T.cyan}88` }}
        />
      </motion.div>
    </>
  );
};

/* ════════════════════════════════════════════════════
   FLOATING PARTICLES
════════════════════════════════════════════════════ */
const PARTICLE_DATA = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2.2 + 0.5,
  dur: Math.random() * 16 + 10,
  delay: -(Math.random() * 20),
  dx: (Math.random() - 0.5) * 140,
  dy: (Math.random() - 0.5) * 140,
  color: i % 4 === 0 ? T.cyan : i % 4 === 1 ? T.active : i % 4 === 2 ? T.brand : `${T.cyan}66`,
}));

const Particles = () => (
  <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
    {PARTICLE_DATA.map(p => (
      <motion.div key={p.id}
        style={{ position:'absolute', left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size, borderRadius:'50%', background:p.color, opacity:0 }}
        animate={{ x:[0, p.dx, p.dx*-0.4, 0], y:[0, p.dy, p.dy*-0.4, 0], opacity:[0, 0.8, 0.35, 0], scale:[0, 1, 0.6, 0] }}
        transition={{ duration:p.dur, delay:p.delay, repeat:Infinity, ease:'easeInOut' }}
      />
    ))}
  </div>
);

/* ════════════════════════════════════════════════════
   ANIMATED COUNTER
════════════════════════════════════════════════════ */
const Counter = ({ target, suffix, dur = 2.4 }) => {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  useEffect(() => {
    if (!inView) return;
    const steps = 90; let s = 0;
    const t = setInterval(() => {
      s++; setV(Math.round((1 - Math.pow(1 - s/steps, 3)) * target));
      if (s >= steps) clearInterval(t);
    }, (dur * 1000) / steps);
    return () => clearInterval(t);
  }, [inView, target, dur]);
  return <span ref={ref}>{v}{suffix}</span>;
};

/* ════════════════════════════════════════════════════
   WORD-BY-WORD REVEAL
════════════════════════════════════════════════════ */
const WordReveal = ({ text, style, delay=0, inView, tag='h2' }) => {
  const Tag = tag;
  const words = text.split(' ');
  return (
    <Tag style={{ ...style, margin:0 }}>
      {words.map((w, i) => (
        <span key={i} style={{ display:'inline-block', overflow:'hidden', marginRight:'0.24em', verticalAlign:'bottom' }}>
          <motion.span
            style={{ display:'inline-block' }}
            initial={{ y:'110%', opacity:0, skewY:4 }}
            animate={inView ? { y:0, opacity:1, skewY:0 } : {}}
            transition={{ duration:0.82, ease:EXPO, delay: delay + i * 0.065 }}
          >{w}</motion.span>
        </span>
      ))}
    </Tag>
  );
};

/* ════════════════════════════════════════════════════
   SECTION LABEL
════════════════════════════════════════════════════ */
const Label = ({ children, delay=0, inView }) => (
  <motion.div
    initial={{ opacity:0, x:-14 }} animate={inView ? { opacity:1, x:0 } : {}}
    transition={{ duration:0.55, ease:SILK, delay }}
    style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}
  >
    <motion.div
      initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}}
      transition={{ duration:0.45, ease:SILK, delay: delay+0.1 }}
      style={{ width:26, height:1, background:T.cyan, transformOrigin:'left' }}
    />
    <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.44em' }}>{children}</span>
  </motion.div>
);

/* ════════════════════════════════════════════════════
   NOISE + GRID (shared atmosphere)
════════════════════════════════════════════════════ */
const Atmosphere = () => (
  <>
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, opacity:0.022,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize:'200px 200px' }} />
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, opacity:0.35,
      backgroundImage:`linear-gradient(${T.brand}08 1px,transparent 1px),linear-gradient(90deg,${T.brand}08 1px,transparent 1px)`,
      backgroundSize:'72px 72px' }} />
  </>
);

/* ════════════════════════════════════════════════════
   STAT CARD — 3D tilt + magnetic counter
════════════════════════════════════════════════════ */
const StatCard = ({ s, i, inView }) => {
  const [hov, setHov] = useState(false);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const rX = useSpring(useTransform(my, [-60,60], [8,-8]), { stiffness:240, damping:24 });
  const rY = useSpring(useTransform(mx, [-80,80], [-8,8]), { stiffness:240, damping:24 });

  return (
    <motion.div data-c=""
      initial={{ opacity:0, y:48, scale:0.93 }}
      animate={inView ? { opacity:1, y:0, scale:1 } : {}}
      transition={{ duration:0.75, ease:SILK, delay:0.09*i }}
      onMouseMove={e => { const r=e.currentTarget.getBoundingClientRect(); mx.set(e.clientX-r.left-r.width/2); my.set(e.clientY-r.top-r.height/2); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); mx.set(0); my.set(0); }}
      style={{ perspective:700 }}
    >
      <motion.div style={{
        rotateX:rX, rotateY:rY, transformStyle:'preserve-3d',
        padding:'clamp(28px,3vw,44px) clamp(20px,2.5vw,34px)',
        border:`1px solid ${hov ? T.cyan+'66' : T.brand+'33'}`,
        background: hov
          ? `linear-gradient(145deg,${T.bgCard} 0%,${T.brand}22 100%)`
          : `linear-gradient(145deg,${T.bgCard}bb 0%,${T.bgDeep}99 100%)`,
        position:'relative', overflow:'hidden',
        transition:'border-color 0.3s, background 0.3s',
      }}>
        {/* Glint sweep */}
        <motion.div
          animate={{ x: hov ? '340%' : '-60%', opacity: hov ? 1 : 0 }}
          transition={{ duration:0.58, ease:SILK }}
          style={{ position:'absolute', top:0, left:'-40%', width:'40%', height:'100%',
            background:`linear-gradient(90deg,transparent,${T.cyan}18,transparent)`,
            pointerEvents:'none', transform:'skewX(-16deg)' }}
        />
        {/* Top line */}
        <motion.div
          animate={{ scaleX: hov ? 1 : 0.15, opacity: hov ? 1 : 0.25 }}
          transition={{ duration:0.4, ease:SILK }}
          style={{ position:'absolute', top:0, left:0, right:0, height:1,
            background:`linear-gradient(90deg,${T.cyan},transparent)`, transformOrigin:'left' }}
        />
        {/* Tag */}
        <div style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.active}66`,
          letterSpacing:'0.26em', textTransform:'uppercase', marginBottom:16 }}>{s.tag}</div>
        {/* Value */}
        <div style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
          fontSize:'clamp(46px,6vw,72px)', lineHeight:1,
          color: hov ? T.cyan : T.white, letterSpacing:'-0.04em', transition:'color 0.3s' }}>
          <Counter target={s.val} suffix={s.suffix} />
        </div>
        {/* Label */}
        <div style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.active}77`,
          textTransform:'uppercase', letterSpacing:'0.18em',
          marginTop:12, whiteSpace:'pre-line', lineHeight:1.65 }}>{s.label}</div>
        {/* Bottom accent */}
        <motion.div
          animate={{ scaleX: hov ? 1 : 0, opacity: hov ? 0.5 : 0 }}
          transition={{ duration:0.5, ease:SILK, delay:0.08 }}
          style={{ position:'absolute', bottom:0, left:0, right:0, height:1,
            background:`linear-gradient(90deg,transparent,${T.cyan},transparent)`, transformOrigin:'center' }}
        />
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════
   EXPERTISE BAR
════════════════════════════════════════════════════ */
const ExpertiseBar = ({ label, pct, color, i, trigger }) => {
  const barRef = useRef(null);
  const barInView = useInView(barRef, { once: true });
  const active = trigger || barInView;
  return (
    <div ref={barRef} style={{ marginBottom: 12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
        <span style={{ fontFamily:'"DM Sans",sans-serif', fontSize:11.5, fontWeight:400, color:T.text }}>{label}</span>
        <motion.span
          initial={{ opacity:0 }} animate={active ? { opacity:1 } : {}}
          transition={{ duration:0.4, delay: 0.6 + i*0.1 }}
          style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${color}88`, letterSpacing:'0.1em' }}
        >{pct}%</motion.span>
      </div>
      {/* Track */}
      <div style={{ height:2, background:`${T.brand}28`, position:'relative', overflow:'hidden' }}>
        <motion.div
          initial={{ scaleX:0 }} animate={active ? { scaleX:1 } : {}}
          transition={{ duration:1.1, ease:SILK, delay: 0.55 + i*0.12 }}
          style={{ position:'absolute', top:0, left:0, height:'100%', width:`${pct}%`,
            background:`linear-gradient(90deg,${color}99,${color})`,
            transformOrigin:'left' }}
        />
        {/* Pulse dot at end */}
        <motion.div
          initial={{ opacity:0 }} animate={active ? { opacity:[0,1,0.6,1] } : {}}
          transition={{ duration:0.5, delay: 0.55 + i*0.12 + 1.05 }}
          style={{ position:'absolute', top:'-3px', left:`${pct}%`, marginLeft:-4,
            width:8, height:8, borderRadius:'50%',
            background:color, boxShadow:`0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════
   TEAM CARD — cinematic split reveal
════════════════════════════════════════════════════ */
const TeamCard = ({ m, i, inView }) => {
  const [hov, setHov] = useState(false);
  const [clicked, setClicked] = useState(false);

  /* Mouse-tracking for spotlight glow */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top)  / r.height);
  };

  const glowX = useSpring(useTransform(mouseX, [0,1], ['-20%','120%']), { stiffness:80, damping:20 });
  const glowY = useSpring(useTransform(mouseY, [0,1], ['-20%','120%']), { stiffness:80, damping:20 });

  const expanded = hov || clicked;

  return (
    <motion.div
      data-c=""
      initial={{ opacity:0, y:60, clipPath:'inset(8% 0 8% 0)' }}
      animate={inView ? { opacity:1, y:0, clipPath:'inset(0% 0 0% 0)' } : {}}
      transition={{ duration:1, ease:EXPO, delay: i * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); mouseX.set(0.5); mouseY.set(0.5); }}
      onClick={() => setClicked(c => !c)}
      style={{ position:'relative', cursor:'pointer', userSelect:'none' }}
    >
      {/* ── OUTER BORDER that draws on hover ── */}
      <motion.div
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={{ duration:0.35 }}
        style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:10 }}
      >
        {/* Top */}
        <motion.div animate={{ scaleX: expanded ? 1 : 0 }} transition={{ duration:0.55, ease:SILK }}
          style={{ position:'absolute', top:0, left:0, right:0, height:1,
            background:`linear-gradient(90deg,${m.color},${m.color}44,transparent)`, transformOrigin:'left' }} />
        {/* Bottom */}
        <motion.div animate={{ scaleX: expanded ? 1 : 0 }} transition={{ duration:0.55, ease:SILK, delay:0.06 }}
          style={{ position:'absolute', bottom:0, left:0, right:0, height:1,
            background:`linear-gradient(90deg,transparent,${m.color}44,${m.color})`, transformOrigin:'right' }} />
        {/* Left */}
        <motion.div animate={{ scaleY: expanded ? 1 : 0 }} transition={{ duration:0.45, ease:SILK, delay:0.08 }}
          style={{ position:'absolute', left:0, top:0, bottom:0, width:1,
            background:`linear-gradient(180deg,${m.color},transparent)`, transformOrigin:'top' }} />
        {/* Right */}
        <motion.div animate={{ scaleY: expanded ? 1 : 0 }} transition={{ duration:0.45, ease:SILK, delay:0.08 }}
          style={{ position:'absolute', right:0, top:0, bottom:0, width:1,
            background:`linear-gradient(180deg,transparent,${m.color})`, transformOrigin:'bottom' }} />
      </motion.div>

      {/* ── CARD BODY ── */}
      <motion.div
        animate={{
          background: expanded
            ? `linear-gradient(155deg,${T.bgCard} 0%,${T.brand}18 100%)`
            : `linear-gradient(155deg,${T.bgCard}cc 0%,${T.bgDeep}ee 100%)`,
        }}
        transition={{ duration:0.45 }}
        style={{ position:'relative', overflow:'hidden' }}
      >

        {/* ── Spotlight glow that follows cursor ── */}
        <motion.div
          style={{ position:'absolute', width:'60%', height:'60%', borderRadius:'50%',
            background:`radial-gradient(circle,${m.color}14 0%,transparent 70%)`,
            x: glowX, y: glowY, translateX:'-50%', translateY:'-50%',
            pointerEvents:'none', zIndex:0,
            opacity: expanded ? 1 : 0, transition:'opacity 0.4s' }}
        />

        {/* ── TOP ZONE: name + role + stat ── */}
        <div style={{ padding:'clamp(28px,3.5vw,44px) clamp(28px,3.5vw,44px) 0', position:'relative', zIndex:1 }}>

          {/* Role pill */}
          <motion.div
            animate={{ x: expanded ? 0 : -4, opacity: expanded ? 1 : 0.55 }}
            transition={{ duration:0.38, ease:SILK }}
            style={{ display:'inline-flex', alignItems:'center', gap:8,
              marginBottom:16, padding:'5px 12px',
              border:`1px solid ${m.color}33`,
              background:`${m.color}0C` }}
          >
            {/* Pulsing dot */}
            <motion.div
              animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }}
              transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
              style={{ width:5, height:5, borderRadius:'50%', background:m.color, flexShrink:0 }}
            />
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5,
              color:`${m.color}cc`, textTransform:'uppercase', letterSpacing:'0.28em' }}>{m.role}</span>
          </motion.div>

          {/* Name */}
          <div style={{ overflow:'hidden', marginBottom: 20 }}>
            <motion.h3
              initial={{ y:'100%' }} animate={inView ? { y:0 } : {}}
              transition={{ duration:0.95, ease:EXPO, delay: 0.25 + i*0.18 }}
              style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
                fontSize:'clamp(26px,3.2vw,42px)', color:T.white,
                margin:0, lineHeight:1.0, letterSpacing:'-0.025em',
                whiteSpace:'pre-line', paddingBottom:'0.06em' }}
            >{m.nameShort}</motion.h3>
          </div>

          {/* Formation line */}
          <motion.div
            animate={{ opacity: expanded ? 1 : 0.45, x: expanded ? 0 : -6 }}
            transition={{ duration:0.38, ease:SILK }}
            style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5,
              color:`${T.active}66`, letterSpacing:'0.14em', marginBottom:20,
              textTransform:'uppercase', lineHeight:1.6 }}>{m.formation}</motion.div>

          {/* Divider that expands */}
          <motion.div
            animate={{ scaleX: expanded ? 1 : 0.25, background: expanded ? m.color+'66' : T.brand+'33' }}
            transition={{ duration:0.5, ease:SILK }}
            style={{ height:1, marginBottom:0, transformOrigin:'left' }}
          />
        </div>

        {/* ── EXPANDABLE ZONE ── */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ height:0, opacity:0 }}
              animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }}
              transition={{ duration:0.52, ease:EXPO }}
              style={{ overflow:'hidden', position:'relative', zIndex:1 }}
            >
              <div style={{ padding:'24px clamp(28px,3.5vw,44px) clamp(28px,3.5vw,44px)' }}>
                {/* Bio */}
                <motion.p
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ duration:0.45, ease:SILK, delay:0.12 }}
                  style={{ fontFamily:'"DM Sans",sans-serif', fontSize:13.5, fontWeight:300,
                    color:T.text, lineHeight:1.82, margin:'0 0 26px' }}
                >{m.bio}</motion.p>

                {/* Expertise bars */}
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  transition={{ duration:0.3, delay:0.2 }}
                  style={{ marginBottom:24 }}
                >
                  {m.expertise.map((ex, ei) => (
                    <ExpertiseBar key={ex.label} label={ex.label} pct={ex.pct}
                      color={m.color} i={ei} trigger={expanded} />
                  ))}
                </motion.div>

                {/* Bottom row: tags + stat */}
                <motion.div
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ duration:0.4, ease:SILK, delay:0.3 }}
                  style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}
                >
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {m.tags.map(tag => (
                      <span key={tag} style={{ fontFamily:'"DM Mono",monospace', fontSize:8,
                        textTransform:'uppercase', letterSpacing:'0.16em', padding:'4px 10px',
                        border:`1px solid ${m.color}33`, color:`${m.color}88` }}>{tag}</span>
                    ))}
                  </div>
                  {/* Stat badge */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                    <span style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
                      fontSize:'clamp(28px,3.5vw,42px)', color:m.color,
                      lineHeight:1, letterSpacing:'-0.04em' }}>{m.stat.val}</span>
                    <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8,
                      color:`${m.color}66`, textTransform:'uppercase', letterSpacing:'0.18em',
                      marginTop:2 }}>{m.stat.label}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── COLLAPSED FOOTER: hint ── */}
        <AnimatePresence>
          {!expanded && (
            <motion.div
              key="hint"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.3 }}
              style={{ padding:'0 clamp(28px,3.5vw,44px) clamp(22px,2.5vw,30px)',
                position:'relative', zIndex:1,
                display:'flex', alignItems:'center', justifyContent:'space-between' }}
            >
              {/* Tags preview — first 2 */}
              <div style={{ display:'flex', gap:6, paddingTop:18 }}>
                {m.tags.slice(0,2).map(tag => (
                  <span key={tag} style={{ fontFamily:'"DM Mono",monospace', fontSize:8,
                    textTransform:'uppercase', letterSpacing:'0.14em', padding:'3px 8px',
                    border:`1px solid ${T.brand}28`, color:`${T.active}66` }}>{tag}</span>
                ))}
                <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8,
                  textTransform:'uppercase', letterSpacing:'0.14em', padding:'3px 8px',
                  color:`${T.brand}55` }}>+{m.tags.length - 2} más</span>
              </div>
              {/* Expand hint */}
              <motion.div
                animate={{ y:[0,-3,0] }} transition={{ duration:1.6, repeat:Infinity, ease:'easeInOut' }}
                style={{ display:'flex', alignItems:'center', gap:6, paddingTop:18 }}>
                <span style={{ fontFamily:'"DM Mono",monospace', fontSize:7.5,
                  color:`${T.brand}55`, letterSpacing:'0.22em', textTransform:'uppercase' }}>ver perfil</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke={`${T.brand}55`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════
   VALUE CARD — full hover reveal
════════════════════════════════════════════════════ */
const ValueCard = ({ v, i, inView }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div data-c=""
      initial={{ opacity:0, scale:0.88, y:24 }}
      animate={inView ? { opacity:1, scale:1, y:0 } : {}}
      transition={{ duration:0.65, ease:SWOOP, delay:0.07*i }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ padding:'32px 26px', position:'relative', overflow:'hidden', cursor:'default',
        border:`1px solid ${hov ? T.cyan+'44' : T.brand+'1C'}`,
        background: hov ? `linear-gradient(148deg,${T.brand}1C 0%,${T.bgCard}cc 100%)` : `linear-gradient(148deg,${T.bgCard}77 0%,${T.bgDeep}99 100%)`,
        transition:'border-color 0.38s, background 0.38s' }}
    >
      {/* Left bar */}
      <motion.div animate={{ scaleY: hov ? 1 : 0 }} transition={{ duration:0.32, ease:EXPO }}
        style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:T.cyan, transformOrigin:'bottom' }} />
      {/* Shimmer */}
      <motion.div animate={{ x: hov ? '300%' : '-50%', opacity: hov ? 1 : 0 }} transition={{ duration:0.62, ease:SILK }}
        style={{ position:'absolute', top:0, left:0, width:'42%', height:'100%',
          background:`linear-gradient(90deg,transparent,${T.cyan}0D,transparent)`, pointerEvents:'none', transform:'skewX(-20deg)' }} />

      {/* Num + icon */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
        <motion.span animate={{ color: hov ? T.cyan : `${T.brand}66` }} transition={{ duration:0.3 }}
          style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, letterSpacing:'0.28em' }}>{v.num}</motion.span>
        <motion.div animate={{ color: hov ? T.cyan : T.active, scale: hov ? 1.2 : 1, rotate: hov ? 10 : 0 }}
          transition={{ duration:0.38, ease:SILK }} style={{ lineHeight:0 }}>{v.icon}</motion.div>
      </div>

      <motion.div animate={{ color: hov ? T.white : T.muted }} transition={{ duration:0.3 }}
        style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
          fontSize:'clamp(20px,2.2vw,26px)', letterSpacing:'-0.018em',
          marginBottom:12, lineHeight:1.05, paddingBottom:'0.04em' }}>{v.label}</motion.div>

      <p style={{ fontFamily:'"DM Sans",sans-serif', fontSize:12.5, fontWeight:300,
        color:T.text, margin:0, lineHeight:1.8 }}>{v.desc}</p>

      {/* Bottom fill on hover */}
      <motion.div animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 8 }} transition={{ duration:0.3 }}
        style={{ marginTop:16, display:'flex', alignItems:'center', gap:6 }}>
        <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${T.cyan}55,transparent)` }} />
        <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8, color:`${T.cyan}66`, letterSpacing:'0.2em' }}>LAEQ</span>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════
   TIMELINE ITEM — clickable expand
════════════════════════════════════════════════════ */
const TimelineItem = ({ t, i, total, inView, isActive, onClick }) => {
  const isLast = i === total - 1;
  return (
    <div data-c="" onClick={onClick} style={{ display:'flex', gap:0, cursor:'pointer' }}>
      {/* Dot + line */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:76, flexShrink:0 }}>
        <motion.div
          initial={{ scale:0, opacity:0 }} animate={inView ? { scale:1, opacity:1 } : {}}
          transition={{ duration:0.5, ease:EXPO, delay:0.08*i }}
          whileHover={{ scale:1.12 }}
          style={{ width:56, height:56, borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            background: isActive
              ? `linear-gradient(135deg,${T.cyan} 0%,${T.active} 100%)`
              : t.highlight
                ? `linear-gradient(135deg,${T.brand}99 0%,${T.bgCard} 100%)`
                : T.bgCard,
            border:`2px solid ${isActive ? T.cyan : t.highlight ? T.brand+'77' : T.brand+'28'}`,
            boxShadow: isActive ? `0 0 28px ${T.cyan}55,0 0 60px ${T.cyan}1A` : 'none',
            zIndex:1, transition:'all 0.42s ease' }}>
          <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8,
            color: isActive ? T.bg : t.highlight ? T.white : T.muted,
            fontWeight:500, letterSpacing:'0.04em', transition:'color 0.3s', textAlign:'center', lineHeight:1.2 }}>{t.year}</span>
        </motion.div>
        {!isLast && (
          <motion.div initial={{ scaleY:0 }} animate={inView ? { scaleY:1 } : {}}
            transition={{ duration:0.62, ease:SILK, delay:0.08*i+0.32 }}
            style={{ flex:1, width:1, minHeight:36, transformOrigin:'top',
              background: isActive
                ? `linear-gradient(180deg,${T.cyan}99 0%,${T.brand}44 100%)`
                : `linear-gradient(180deg,${T.brand}44 0%,${T.brand}14 100%)`,
              transition:'background 0.42s' }} />
        )}
      </div>

      {/* Content */}
      <motion.div initial={{ opacity:0, x:22 }} animate={inView ? { opacity:1, x:0 } : {}}
        transition={{ duration:0.62, ease:SILK, delay:0.08*i+0.18 }}
        style={{ flex:1, paddingLeft:20, paddingBottom: isLast ? 0 : 34, paddingTop:10 }}>
        <motion.div
          animate={{ background: isActive ? `linear-gradient(135deg,${T.brand}1E 0%,${T.bgCard}88 100%)` : 'transparent',
            borderColor: isActive ? T.brand+'44' : 'transparent' }}
          transition={{ duration:0.38 }}
          style={{ padding:'14px 18px', border:'1px solid transparent', position:'relative', overflow:'hidden' }}>
          {/* Active top line */}
          <motion.div animate={{ scaleX: isActive ? 1 : 0 }} transition={{ duration:0.38, ease:SILK }}
            style={{ position:'absolute', top:0, left:0, right:0, height:1,
              background:`linear-gradient(90deg,${T.cyan},transparent)`, transformOrigin:'left' }} />

          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
            <h4 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
              fontSize:'clamp(16px,1.75vw,21px)',
              color: isActive ? T.white : t.highlight ? T.muted : T.dim,
              margin:'0 0 4px', letterSpacing:'-0.014em', paddingBottom:'0.04em',
              lineHeight:1.15, transition:'color 0.3s', flex:1 }}>{t.title}</h4>
            <motion.span animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.85 }}
              transition={{ duration:0.3 }}
              style={{ fontFamily:'"DM Mono",monospace', fontSize:8, color:T.bg, background:T.cyan,
                padding:'3px 8px', whiteSpace:'nowrap', flexShrink:0 }}>{t.kpi}</motion.span>
          </div>

          <AnimatePresence>
            {isActive && (
              <motion.p initial={{ height:0, opacity:0, y:-6 }} animate={{ height:'auto', opacity:1, y:0 }}
                exit={{ height:0, opacity:0, y:-4 }} transition={{ duration:0.42, ease:EXPO }}
                style={{ fontFamily:'"DM Sans",sans-serif', fontSize:13, fontWeight:300,
                  color:T.text, margin:0, lineHeight:1.82, overflow:'hidden' }}>{t.desc}</motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ════════════════════════════════════════════════════
   CLIENTS TICKER
════════════════════════════════════════════════════ */
const Ticker = ({ inView }) => {
  const all = [...CLIENTS, ...CLIENTS, ...CLIENTS];
  return (
    <motion.div initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ duration:0.9, delay:0.7 }}
      style={{ overflow:'hidden', borderTop:`1px solid ${T.brand}28`, borderBottom:`1px solid ${T.brand}28`,
        padding:'13px 0', position:'relative',
        background:`linear-gradient(90deg,${T.bgDeep} 0%,${T.bgCard}44 50%,${T.bgDeep} 100%)` }}>
      {/* Fade edges */}
      {['left','right'].map(side => (
        <div key={side} style={{ position:'absolute', [side]:0, top:0, bottom:0, width:90, zIndex:2,
          background:`linear-gradient(${side==='left'?'90deg':'270deg'},${T.bg},transparent)` }} />
      ))}
      <motion.div
        animate={{ x:['0%','-33.33%'] }}
        transition={{ duration:26, ease:'linear', repeat:Infinity }}
        style={{ display:'flex', whiteSpace:'nowrap', width:'max-content' }}>
        {all.map((c,i) => (
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:26, padding:'0 26px' }}>
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9,
              color:`${T.active}66`, textTransform:'uppercase', letterSpacing:'0.24em' }}>{c}</span>
            <span style={{ color:`${T.brand}44`, fontSize:5 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════
   MANIFESTO STRIP (new editorial section)
════════════════════════════════════════════════════ */
const ManifestoStrip = ({ inView }) => {
  const text = "Desarrollo · Mercados · Energéticos · Perú · 2014 — 2025 ·";
  const repeated = Array(4).fill(text).join(' ');
  return (
    <motion.div initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ duration:0.8, delay:0.3 }}
      style={{ overflow:'hidden', padding:'18px 0', borderTop:`1px solid ${T.brand}18`, borderBottom:`1px solid ${T.brand}18`, position:'relative' }}>
      <motion.div
        animate={{ x:['0%','-50%'] }}
        transition={{ duration:18, ease:'linear', repeat:Infinity }}
        style={{ display:'flex', whiteSpace:'nowrap', width:'max-content' }}>
        {[...Array(2)].map((_,ri) => (
          <span key={ri} style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontWeight:300,
            fontSize:'clamp(13px,1.2vw,16px)', color:`${T.brand}55`, letterSpacing:'0.06em',
            paddingRight:'3em' }}>{repeated}</span>
        ))}
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════
   ROOT — NOSOTROS
════════════════════════════════════════════════════ */
const Nosotros = () => {
  const sectionRef = useRef(null);
  const heroRef    = useRef(null);
  const statsRef   = useRef(null);
  const teamRef    = useRef(null);
  const valRef     = useRef(null);
  const tlRef      = useRef(null);

  const ivHero  = useInView(heroRef,  { once:true, margin:'-60px' });
  const ivStats = useInView(statsRef, { once:true, margin:'-60px' });
  const ivTeam  = useInView(teamRef,  { once:true, margin:'-60px' });
  const ivVal   = useInView(valRef,   { once:true, margin:'-60px' });
  const ivTL    = useInView(tlRef,    { once:true, margin:'-60px' });

  const [activeYear, setActiveYear] = useState(0);

  const { scrollYProgress } = useScroll({ target:sectionRef, offset:['start start','end start'] });
  const parallaxY   = useTransform(scrollYProgress, [0,1], ['0%','24%']);
  const heroOpacity = useTransform(scrollYProgress, [0,0.2], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0,0.2], [0, 40]);

  /* Auto-advance timeline */
  useEffect(() => {
    if (!ivTL) return;
    const t = setInterval(() => setActiveYear(p => (p+1) % TIMELINE.length), 3600);
    return () => clearInterval(t);
  }, [ivTL]);

  return (
    <section ref={sectionRef} id="nosotros" style={{ background:T.bg, position:'relative', overflow:'hidden', paddingBottom:'clamp(80px,10vh,120px)' }}>
      <Cursor />
      <Atmosphere />
      <Particles />

      {/* Parallax blobs */}
      <motion.div style={{ y:parallaxY, position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', left:'-12%', top:'2%', width:'54vw', height:'52vh', background:`radial-gradient(ellipse,${T.brand}1E 0%,transparent 65%)` }} />
        <div style={{ position:'absolute', right:'-4%', top:'38%', width:'40vw', height:'44vh', background:`radial-gradient(ellipse,${T.cyan}0C 0%,transparent 65%)` }} />
        <div style={{ position:'absolute', left:'28%', bottom:'6%', width:'36vw', height:'32vh', background:`radial-gradient(ellipse,${T.brand}12 0%,transparent 65%)` }} />
      </motion.div>

      <div style={{ position:'relative', zIndex:1 }}>

        {/* ════ HERO ════════════════════════════════════ */}
        <motion.div ref={heroRef} style={{ opacity:heroOpacity, y:heroY }}>
          {/* Large section number — editorial device */}
          <motion.div
            initial={{ opacity:0 }} animate={ivHero ? { opacity:1 } : {}}
            transition={{ duration:1.2, ease:SILK, delay:0.05 }}
            style={{ position:'absolute', right:'clamp(16px,4vw,60px)', top:'clamp(60px,8vw,100px)',
              fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontStyle:'italic',
              fontSize:'clamp(100px,16vw,200px)', lineHeight:1,
              color:`${T.brand}12`, letterSpacing:'-0.04em', userSelect:'none',
              pointerEvents:'none', paddingBottom:'0.05em' }}>02</motion.div>

          <div style={{ padding:'clamp(80px,10vh,130px) clamp(24px,5vw,80px) 0',
            display:'grid', gridTemplateColumns:'1.15fr 0.85fr',
            gap:'clamp(40px,6vw,96px)', alignItems:'end' }} className="n-hero">
            <div>
              <Label delay={0} inView={ivHero}>Sobre Nosotros</Label>

              {/* Staggered word reveal */}
              <div style={{ overflow:'hidden', marginBottom:4 }}>
                <motion.div initial={{ y:'106%' }} animate={ivHero ? { y:0 } : {}}
                  transition={{ duration:1.08, ease:EXPO, delay:0.14 }}>
                  <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
                    fontSize:'clamp(54px,7.8vw,110px)', color:T.white, margin:0,
                    lineHeight:0.9, letterSpacing:'-0.032em', paddingBottom:'0.08em' }}>Nosotros</h2>
                </motion.div>
              </div>
              <div style={{ overflow:'hidden' }}>
                <motion.div initial={{ y:'106%' }} animate={ivHero ? { y:0 } : {}}
                  transition={{ duration:1.08, ease:EXPO, delay:0.26 }}>
                  <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:600, fontStyle:'italic',
                    fontSize:'clamp(54px,7.8vw,110px)', color:T.cyan, margin:0,
                    lineHeight:0.9, letterSpacing:'-0.032em', paddingBottom:'0.08em' }}>LAEQ.</h2>
                </motion.div>
              </div>

              {/* Animated rule */}
              <motion.div initial={{ scaleX:0, opacity:0 }} animate={ivHero ? { scaleX:1, opacity:1 } : {}}
                transition={{ duration:1.2, ease:SILK, delay:0.55 }}
                style={{ height:1, marginTop:28, transformOrigin:'left',
                  background:`linear-gradient(90deg,${T.cyan} 0%,${T.brand}44 55%,transparent 100%)` }} />

              {/* Founded line */}
              <motion.div initial={{ opacity:0, y:12 }} animate={ivHero ? { opacity:1, y:0 } : {}}
                transition={{ duration:0.7, ease:SILK, delay:0.72 }}
                style={{ display:'flex', alignItems:'center', gap:16, marginTop:20 }}>
                <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:`${T.active}66`,
                  textTransform:'uppercase', letterSpacing:'0.32em' }}>Est.</span>
                <span style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
                  fontSize:'clamp(18px,2vw,26px)', color:`${T.brand}88`, letterSpacing:'-0.02em' }}>Lima, Perú — 2014</span>
              </motion.div>
            </div>

            <div style={{ paddingBottom:4 }}>
              <motion.p initial={{ opacity:0, y:28 }} animate={ivHero ? { opacity:1, y:0 } : {}}
                transition={{ duration:0.9, ease:SILK, delay:0.42 }}
                style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300,
                  fontSize:'clamp(14px,1.2vw,17px)', color:T.text, lineHeight:1.9, margin:'0 0 22px' }}>
                Somos <strong style={{ color:T.white, fontWeight:500 }}>LAEQ & Asociados</strong>, consultora especializada en desarrollo de mercados energéticos del Perú. Fundada en 2014, combinamos rigor técnico, visión estratégica y profundidad regulatoria para transformar desafíos energéticos complejos en resultados de impacto real.
              </motion.p>
              <motion.p initial={{ opacity:0, y:18 }} animate={ivHero ? { opacity:1, y:0 } : {}}
                transition={{ duration:0.85, ease:SILK, delay:0.56 }}
                style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300,
                  fontSize:'clamp(13px,1vw,15px)', color:T.muted, lineHeight:1.88, margin:0 }}>
                Operamos en electricidad, gas natural, hidrocarburos, contratos PPA, planificación energética y pericia técnica, asesorando a las organizaciones más estratégicas del sector público y privado peruano.
              </motion.p>
            </div>
          </div>

          {/* Ticker + manifesto */}
          <div style={{ marginTop:'clamp(48px,6vh,80px)' }}>
            <Ticker inView={ivHero} />
            <ManifestoStrip inView={ivHero} />
          </div>
        </motion.div>

        <div style={{ height:'clamp(64px,8vh,96px)' }} />

        {/* ════ STATS ════════════════════════════════════ */}
        <div ref={statsRef} style={{ padding:'0 clamp(24px,5vw,80px)', marginBottom:'clamp(80px,10vh,120px)' }}>
          {/* Section header */}
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:'clamp(28px,3.5vh,44px)' }}>
            <Label inView={ivStats}>Cifras que respaldan</Label>
            <motion.div initial={{ opacity:0, x:16 }} animate={ivStats ? { opacity:1, x:0 } : {}}
              transition={{ duration:0.6, ease:SILK, delay:0.2 }}
              style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.brand}55`,
                letterSpacing:'0.24em', textTransform:'uppercase' }}>LAEQ & Asociados · Perú</motion.div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:`${T.brand}22` }} className="n-stats">
            {STATS.map((s,i) => <StatCard key={s.label} s={s} i={i} inView={ivStats} />)}
          </div>
        </div>

        {/* ════ TEAM ══════════════════════════════════════ */}
        <div ref={teamRef} style={{ padding:'0 clamp(24px,5vw,80px)', marginBottom:'clamp(80px,10vh,120px)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'0.55fr 1.45fr', gap:'clamp(32px,5vw,80px)', alignItems:'start', marginBottom:'clamp(36px,4vh,56px)' }} className="n-team-header">
            <div>
              <Label inView={ivTeam}>Equipo Directivo</Label>
              <motion.h3 initial={{ opacity:0, y:20 }} animate={ivTeam ? { opacity:1, y:0 } : {}}
                transition={{ duration:0.8, ease:SILK, delay:0.1 }}
                style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
                  fontSize:'clamp(30px,4vw,56px)', color:T.white, margin:0,
                  lineHeight:1.05, letterSpacing:'-0.025em', paddingBottom:'0.06em' }}>
                Las personas<br/>
                <em style={{ color:T.cyan, fontStyle:'italic', fontWeight:600 }}>del resultado.</em>
              </motion.h3>
            </div>
            <motion.p initial={{ opacity:0, y:16 }} animate={ivTeam ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.75, ease:SILK, delay:0.24 }}
              style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300,
                fontSize:'clamp(13px,1vw,15.5px)', color:T.text, lineHeight:1.9,
                margin:0, paddingTop:'clamp(8px,1vh,16px)' }}>
              LAEQ & Asociados está liderado por dos profesionales con décadas de experiencia acumulada en el sector energético peruano, combinando profundidad técnica e ingeniería con precisión jurídica y regulatoria. Cada proyecto lleva la firma personal de su equipo directivo.
            </motion.p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'clamp(16px,2.5vw,32px)' }} className="n-team">
            {TEAM.map((m,i) => <TeamCard key={m.id} m={m} i={i} inView={ivTeam} />)}
          </div>
        </div>

        {/* ════ VALUES ════════════════════════════════════ */}
        <div ref={valRef} style={{ padding:'0 clamp(24px,5vw,80px)', marginBottom:'clamp(80px,10vh,120px)' }}>
          {/* Banner */}
          <motion.div initial={{ opacity:0, y:18 }} animate={ivVal ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.8, ease:SILK }}
            style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(24px,3vw,60px)', alignItems:'center',
              padding:'clamp(36px,4vh,60px) clamp(32px,4vw,64px)',
              border:`1px solid ${T.brand}28`,
              background:`linear-gradient(138deg,${T.bgCard}55 0%,${T.bgDeep}99 100%)`,
              position:'relative', overflow:'hidden', marginBottom:1 }} className="n-val-banner">
            {/* Corner decoration */}
            <div style={{ position:'absolute', top:0, right:0, width:220, height:220, pointerEvents:'none',
              background:`radial-gradient(ellipse at top right,${T.brand}2A 0%,transparent 65%)` }} />
            <motion.div animate={{ scaleY:[0,1,0.4,1] }} transition={{ duration:3, ease:SILK, repeat:Infinity, repeatDelay:3.5 }}
              style={{ position:'absolute', top:0, right:0, width:1, height:72, background:`linear-gradient(180deg,${T.cyan}99 0%,transparent 100%)` }} />
            <motion.div animate={{ scaleX:[0,1,0.4,1] }} transition={{ duration:3, ease:SILK, repeat:Infinity, repeatDelay:3.5 }}
              style={{ position:'absolute', top:0, right:0, width:72, height:1, background:`linear-gradient(270deg,${T.cyan}99 0%,transparent 100%)` }} />
            <div>
              <Label inView={ivVal}>Nuestros Valores</Label>
              <h3 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
                fontSize:'clamp(28px,3.8vw,52px)', color:T.white,
                margin:0, lineHeight:1.05, letterSpacing:'-0.022em', paddingBottom:'0.06em' }}>
                Principios que{' '}
                <em style={{ color:T.cyan, fontStyle:'italic' }}>guían cada decisión.</em>
              </h3>
            </div>
            <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300,
              fontSize:'clamp(13px,1vw,15.5px)', color:T.text, lineHeight:1.9, margin:0 }}>
              Once años forjando reputación en el sector energético peruano nos enseñaron que los resultados sostenibles sólo nacen de principios claros, practicados sin excepción.
            </p>
          </motion.div>
          {/* Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:`${T.brand}14` }} className="n-val">
            {VALUES.map((v,i) => <ValueCard key={v.num} v={v} i={i} inView={ivVal} />)}
          </div>
        </div>

        {/* ════ TIMELINE ══════════════════════════════════ */}
        <div ref={tlRef} style={{ padding:'0 clamp(24px,5vw,80px)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'0.82fr 1.18fr', gap:'clamp(40px,6vw,96px)', alignItems:'start' }} className="n-tl">

            {/* Left — sticky editorial panel */}
            <div style={{ position:'sticky', top:'clamp(32px,5vh,60px)' }} className="n-tl-sticky">
              <Label inView={ivTL}>Nuestra Trayectoria</Label>

              <motion.h3 initial={{ opacity:0, y:26 }} animate={ivTL ? { opacity:1, y:0 } : {}}
                transition={{ duration:0.88, ease:SILK, delay:0.1 }}
                style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
                  fontSize:'clamp(28px,3.8vw,52px)', color:T.white,
                  margin:'0 0 18px', lineHeight:1.04, letterSpacing:'-0.022em', paddingBottom:'0.06em' }}>
                Once años construyendo el mercado{' '}
                <em style={{ color:T.cyan, fontStyle:'italic' }}>energético peruano.</em>
              </motion.h3>

              <motion.p initial={{ opacity:0, y:14 }} animate={ivTL ? { opacity:1, y:0 } : {}}
                transition={{ duration:0.72, ease:SILK, delay:0.22 }}
                style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300,
                  fontSize:'clamp(12.5px,0.98vw,15px)', color:T.text, lineHeight:1.9, margin:'0 0 20px' }}>
                Desde 2014, cada proyecto, cada cliente y cada regulación superada ha sumado a una trayectoria única. Haz clic en cualquier año para leer el detalle.
              </motion.p>

              {/* Progress pills */}
              <motion.div initial={{ opacity:0 }} animate={ivTL ? { opacity:1 } : {}} transition={{ duration:0.6, delay:0.4 }}
                style={{ display:'flex', gap:6, marginBottom:36 }}>
                {TIMELINE.map((_,i) => (
                  <motion.div key={i} data-c="" onClick={() => setActiveYear(i)}
                    animate={{ width: activeYear===i ? 26 : 6, background: activeYear===i ? T.cyan : `${T.brand}44` }}
                    transition={{ duration:0.35, ease:SILK }}
                    style={{ height:5, borderRadius:3, cursor:'pointer' }} />
                ))}
              </motion.div>

              {/* Active milestone callout */}
              <AnimatePresence mode="wait">
                <motion.div key={activeYear}
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                  transition={{ duration:0.38, ease:SILK }}
                  style={{ padding:'18px 20px', border:`1px solid ${T.brand}33`,
                    background:`linear-gradient(135deg,${T.brand}14 0%,${T.bgDeep}88 100%)`,
                    position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:1,
                    background:`linear-gradient(90deg,${T.cyan}77,transparent)` }} />
                  <div style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5,
                    color:`${T.active}77`, letterSpacing:'0.26em', textTransform:'uppercase', marginBottom:6 }}>
                    Hito {String(activeYear+1).padStart(2,'0')} / {String(TIMELINE.length).padStart(2,'0')}
                  </div>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700,
                    fontSize:'clamp(28px,4vw,48px)', color:T.cyan,
                    lineHeight:1, letterSpacing:'-0.04em' }}>{TIMELINE[activeYear].year}</div>
                  <div style={{ fontFamily:'"DM Sans",sans-serif', fontSize:12.5,
                    color:T.muted, marginTop:4, fontWeight:300 }}>{TIMELINE[activeYear].title}</div>
                  <div style={{ fontFamily:'"DM Mono",monospace', fontSize:8, color:T.bg,
                    background:T.cyan, display:'inline-block', padding:'3px 9px', marginTop:10 }}>
                    {TIMELINE[activeYear].kpi}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — timeline list */}
            <div>
              {TIMELINE.map((t,i) => (
                <TimelineItem key={t.year} t={t} i={i} total={TIMELINE.length}
                  inView={ivTL} isActive={activeYear===i} onClick={() => setActiveYear(i)} />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CSS */}
      <style>{`
        * { cursor: none !important; }
        @media (hover: none) { * { cursor: auto !important; } }
        @media (max-width: 960px) {
          .n-hero         { grid-template-columns: 1fr !important; }
          .n-stats        { grid-template-columns: repeat(2,1fr) !important; }
          .n-team-header  { grid-template-columns: 1fr !important; }
          .n-team         { grid-template-columns: 1fr !important; }
          .n-val-banner   { grid-template-columns: 1fr !important; }
          .n-val          { grid-template-columns: repeat(2,1fr) !important; }
          .n-tl           { grid-template-columns: 1fr !important; }
          .n-tl-sticky    { position: static !important; margin-bottom: 32px; }
        }
        @media (max-width: 560px) {
          .n-val { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default Nosotros;
