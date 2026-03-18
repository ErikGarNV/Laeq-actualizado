import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/*
  FONTS (index.html <head>)
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
*/

/* ─── TOKENS ─────────────────────────────────────── */
const T = {
  bg:      '#071E30',   /* ← lighter navy (was #020C18) */
  bgCard:  '#0A2640',   /* card surface */
  bgDeep:  '#051525',   /* deep accents */
  brand:   '#02537E',
  active:  '#0A8FC7',
  cyan:    '#1EB8F0',
  white:   '#E8F4FC',
  muted:   'rgba(184,223,240,0.44)',
  dim:     'rgba(184,223,240,0.22)',
};
const SILK = [0.16, 1, 0.3, 1];
const EXPO = [0.76, 0, 0.24, 1];

/* ─── DATA ───────────────────────────────────────── */
const SVC = [
  {
    id: 'gas-reg',
    num: '01',
    title: 'Regulación de\nGas Natural',
    tag: 'Gas Natural',
    short: 'Marco regulatorio y normativo del sector gas natural.',
    detail: 'Análisis integral de regulaciones, contratos de transporte y distribución, tarifas reguladas y procedimientos técnicos ante OSINERGMIN y el MINEM para el sector gas natural peruano.',
    bullets: ['Regulación tarifaria', 'Contratos de transporte', 'Procedimientos ante OSINERGMIN', 'Normativa distribución'],
    kpi: { val: '10+', label: 'Años en regulación' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 8v4l2.5 2.5"/></svg>,
  },
  {
    id: 'contratos-gas',
    num: '02',
    title: 'Contratos de\nGas Natural',
    tag: 'Contratos',
    short: 'Estructuración y negociación de contratos de suministro.',
    detail: 'Diseño, estructuración y negociación de contratos de suministro de gas natural para industrias, generadoras y distribuidoras. Optimización de precios, cláusulas take-or-pay y garantías contractuales.',
    bullets: ['Take-or-pay clauses', 'Negociación comercial', 'Optimización de precios', 'Garantías contractuales'],
    kpi: { val: '95%', label: 'Tasa de éxito' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    id: 'politica',
    num: '03',
    title: 'Planificación y\nPolítica Energética',
    tag: 'Política',
    short: 'Políticas y planes estratégicos para el sector energético.',
    detail: 'Formulación de políticas energéticas, planes de largo plazo y estrategias sectoriales. Experiencia directa en el diseño del Plan Nacional de Electrificación Rural — 150,000 beneficiarios.',
    bullets: ['Plan Nacional de Energía', 'Integración RER / SEIN', 'Políticas sectoriales', 'Electrificación rural'],
    kpi: { val: '150K', label: 'Beneficiarios' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
  },
  {
    id: 'ppa',
    num: '04',
    title: 'Contratos PPA\nde Electricidad',
    tag: 'PPA',
    short: 'Asesoría en Power Purchase Agreements y mercado eléctrico.',
    detail: 'Estructuración de PPAs para proyectos de hasta 500 MW. Análisis de precio, plazo, garantías y riesgos para generadoras, distribuidoras y grandes consumidores. Negociación ante COES y reguladores.',
    bullets: ['Proyectos hasta 500 MW', 'Análisis de riesgo', 'Negociación ante COES', 'Grandes consumidores'],
    kpi: { val: '500MW', label: 'Mayor proyecto PPA' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>,
  },
  {
    id: 'ambiente',
    num: '05',
    title: 'Medio\nAmbiente',
    tag: 'Ambiental',
    short: 'Consultoría ambiental para proyectos energéticos.',
    detail: 'Gestión ambiental integral: EIA, planes de cierre, certificaciones y cumplimiento normativo ante SENACE y MINEM para proyectos de generación, transmisión e hidrocarburos.',
    bullets: ['Estudios de Impacto Ambiental', 'Planes de cierre', 'Certificación SENACE', 'Cumplimiento normativo'],
    kpi: { val: '10+', label: 'Proyectos certificados' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 0 0 4.72 21C7.38 21 10.18 19.68 12 17c.86-1.23 1.5-2.7 2-4 .5 2.5 1.5 4.5 3 5.8"/><path d="M22 2s-5 2-7 6.5S12 15 12 15"/></svg>,
  },
  {
    id: 'combustibles',
    num: '06',
    title: 'Precios de\nCombustibles Líquidos',
    tag: 'Combustibles',
    short: 'Análisis y regulación de precios de combustibles líquidos.',
    detail: 'Monitoreo, análisis y asesoría en fijación de precios de combustibles líquidos. Reducción comprobada del 15% en costos de suministro para PETROPERÚ mediante optimización de cadena.',
    bullets: ['Fijación de precios', 'Cadena de suministro', 'PETROPERÚ: −15% costos', 'Análisis de mercado'],
    kpi: { val: '−15%', label: 'Reducción costos' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    id: 'capacitaciones',
    num: '07',
    title: 'Capacitaciones\nIn-House',
    tag: 'Formación',
    short: 'Programas especializados para empresas del sector.',
    detail: 'Diseño e impartición de programas de formación técnica y regulatoria para equipos corporativos. Más de 500 profesionales capacitados en regulación eléctrica, gas natural, mercados y contratos.',
    bullets: ['Regulación eléctrica', 'Mercados de gas', 'Contratos energéticos', 'Programas in-house'],
    kpi: { val: '500+', label: 'Profesionales' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  },
];

/* ─── SECTION HEADER ─────────────────────────────── */
const Header = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} style={{
      padding: '0 clamp(24px,5vw,80px)',
      marginBottom: 'clamp(52px,7vh,88px)',
    }}>
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: SILK }}
        style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}
      >
        <div style={{ width: 30, height: 1, background: T.cyan }} />
        <span style={{
          fontFamily: '"DM Mono",monospace', fontSize: 10,
          color: T.cyan, textTransform: 'uppercase', letterSpacing: '0.42em',
        }}>Áreas de Práctica</span>
      </motion.div>

      {/* Title — NO overflow:hidden, no clip */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: SILK, delay: 0.1 }}
        style={{
          fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
          fontSize: 'clamp(46px,6.8vw,94px)',
          color: T.white, margin: 0,
          lineHeight: 1,           /* ← was 0.92 which clipped descenders */
          letterSpacing: '-0.025em',
          paddingBottom: '0.08em', /* ← extra room for descenders */
        }}
      >
        Servicios{' '}
        <em style={{ color: T.cyan, fontStyle: 'italic', fontWeight: 600 }}>Estratégicos</em>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: SILK, delay: 0.28 }}
        style={{
          fontFamily: '"DM Sans",sans-serif', fontWeight: 300,
          fontSize: 'clamp(14px,1.15vw,16.5px)',
          color: T.muted, lineHeight: 1.75,
          maxWidth: 500, margin: '18px 0 0',
        }}
      >
        Soluciones integrales para el desarrollo y optimización de mercados
        energéticos, respaldadas por más de una década de experiencia.
      </motion.p>
    </div>
  );
};

/* ─── DETAIL PANEL (right) ───────────────────────── */
const Detail = ({ s }) => (
  <motion.div
    key={s.id}
    initial={{ opacity: 0, x: 32 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -24 }}
    transition={{ duration: 0.55, ease: SILK }}
    style={{
      height: '100%',
      padding: 'clamp(28px,4vw,52px)',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden',
    }}
  >
    {/* Background glow */}
    <div style={{
      position: 'absolute', top: '-20%', right: '-10%',
      width: '70%', height: '70%', pointerEvents: 'none',
      background: `radial-gradient(ellipse, ${T.brand}28 0%, transparent 65%)`,
    }} />

    {/* Top line */}
    <motion.div
      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
      transition={{ duration: 0.7, ease: SILK }}
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, ${T.cyan} 0%, ${T.brand}55 60%, transparent 100%)`,
        transformOrigin: 'left',
      }}
    />

    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Number + tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{
          fontFamily: '"DM Mono",monospace', fontSize: 9.5,
          color: T.cyan, letterSpacing: '0.28em', textTransform: 'uppercase',
        }}>{s.num}</span>
        <span style={{ width: 20, height: 1, background: T.brand }} />
        <span style={{
          fontFamily: '"DM Mono",monospace', fontSize: 9,
          color: `${T.active}88`, textTransform: 'uppercase', letterSpacing: '0.2em',
        }}>{s.tag}</span>
      </div>

      {/* Icon + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 52, height: 52, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${T.brand}30`,
          border: `1px solid ${T.brand}66`,
          color: T.cyan,
        }}>{s.icon}</div>
        <h3 style={{
          fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
          fontSize: 'clamp(24px,3vw,38px)',
          color: T.white, margin: 0,
          lineHeight: 1.05, letterSpacing: '-0.02em',
          whiteSpace: 'pre-line',
          paddingBottom: '0.06em',
        }}>{s.title}</h3>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `${T.brand}28`, marginBottom: 20 }} />

      {/* Detail */}
      <p style={{
        fontFamily: '"DM Sans",sans-serif', fontWeight: 300,
        fontSize: 'clamp(13.5px,1.05vw,15.5px)',
        color: T.muted, lineHeight: 1.85, margin: '0 0 24px',
      }}>{s.detail}</p>

      {/* Bullets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 28 }}>
        {s.bullets.map(b => (
          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 4, background: T.cyan, borderRadius: '50%', flexShrink: 0 }} />
            <span style={{
              fontFamily: '"DM Sans",sans-serif', fontSize: 12,
              color: T.dim, lineHeight: 1.4,
            }}>{b}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom: KPI + CTA */}
    <div style={{
      position: 'relative', zIndex: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 16,
      paddingTop: 20,
      borderTop: `1px solid ${T.brand}28`,
    }}>
      <div>
        <div style={{
          fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
          fontSize: 'clamp(28px,4vw,48px)',
          color: T.cyan, lineHeight: 1, letterSpacing: '-0.03em',
        }}>{s.kpi.val}</div>
        <div style={{
          fontFamily: '"DM Mono",monospace', fontSize: 9,
          color: `${T.active}77`, textTransform: 'uppercase', letterSpacing: '0.18em',
          marginTop: 4,
        }}>{s.kpi.label}</div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        data-c="consultar"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 28px',
          background: T.cyan, border: 'none', cursor: 'pointer',
          fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
          fontSize: 10.5, color: T.bg,
          textTransform: 'uppercase', letterSpacing: '0.2em',
          transition: 'background .28s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.white}
        onMouseLeave={e => e.currentTarget.style.background = T.cyan}
      >
        Solicitar Consulta
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  </motion.div>
);

/* ─── SERVICE ITEM (left list) ───────────────────── */
const Item = ({ s, isActive, onHover, onClick }) => (
  <div
    onClick={onClick}
    onMouseEnter={onHover}
    data-c=""
    style={{
      display: 'flex', alignItems: 'center',
      gap: 16, padding: '18px 0',
      borderBottom: `1px solid ${isActive ? T.brand + '55' : 'rgba(2,83,126,0.18)'}`,
      cursor: 'pointer', transition: 'border-color .3s',
      position: 'relative',
    }}
  >
    {/* Active bar */}
    <motion.div
      animate={{ scaleY: isActive ? 1 : 0 }}
      transition={{ duration: 0.3, ease: EXPO }}
      style={{
        position: 'absolute', left: -24, top: 0, bottom: 0,
        width: 2, background: T.cyan, transformOrigin: 'top',
      }}
    />

    {/* Num */}
    <span style={{
      fontFamily: '"DM Mono",monospace', fontSize: 10,
      color: isActive ? T.cyan : `${T.brand}77`,
      minWidth: 24, flexShrink: 0, transition: 'color .3s',
    }}>{s.num}</span>

    {/* Icon */}
    <div style={{
      flexShrink: 0, color: isActive ? T.cyan : T.muted,
      lineHeight: 0, transition: 'color .3s',
    }}>{s.icon}</div>

    {/* Title */}
    <motion.span
      animate={{ x: isActive ? 6 : 0 }}
      transition={{ duration: 0.3, ease: SILK }}
      style={{
        fontFamily: '"Cormorant Garamond",serif', fontWeight: 600,
        fontSize: 'clamp(16px,1.9vw,22px)',
        lineHeight: 1.1, letterSpacing: '-0.015em',
        color: isActive ? T.white : T.muted,
        transition: 'color .3s',
        whiteSpace: 'pre-line', flex: 1,
        paddingBottom: '0.05em',
      }}
    >{s.title}</motion.span>

    {/* Arrow */}
    <motion.div
      animate={{ rotate: isActive ? 0 : -90, color: isActive ? T.cyan : `${T.brand}55` }}
      transition={{ duration: 0.3, ease: EXPO }}
      style={{ flexShrink: 0, lineHeight: 0 }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </motion.div>
  </div>
);

/* ─── MOBILE CARD (stacked on small screens) ─────── */
const MobileCard = ({ s, isActive, onToggle }) => (
  <div style={{
    border: `1px solid ${isActive ? T.brand + '66' : T.brand + '22'}`,
    background: isActive ? `${T.brand}10` : 'transparent',
    marginBottom: 12, transition: 'all .3s',
  }}>
    {/* Header */}
    <div
      onClick={onToggle} data-c=""
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 20px', cursor: 'pointer',
      }}
    >
      <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 9.5, color: T.cyan, minWidth: 22 }}>{s.num}</span>
      <div style={{ color: isActive ? T.cyan : T.muted, lineHeight: 0, flexShrink: 0 }}>{s.icon}</div>
      <span style={{
        fontFamily: '"Cormorant Garamond",serif', fontWeight: 600,
        fontSize: 18, color: isActive ? T.white : T.muted,
        flex: 1, lineHeight: 1.1,
        whiteSpace: 'pre-line',
        paddingBottom: '0.04em',
      }}>{s.title}</span>
      <motion.div
        animate={{ rotate: isActive ? 45 : 0 }}
        transition={{ duration: 0.3, ease: EXPO }}
        style={{ color: isActive ? T.cyan : `${T.brand}66`, lineHeight: 0 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.div>
    </div>

    {/* Expanded */}
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
          transition={{ duration: 0.45, ease: EXPO }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${T.brand}28` }}>
            <p style={{
              fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 13.5,
              color: T.muted, lineHeight: 1.8, margin: '16px 0',
            }}>{s.detail}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {s.bullets.map(b => (
                <span key={b} style={{
                  fontFamily: '"DM Mono",monospace', fontSize: 9,
                  color: T.active, border: `1px solid ${T.active}44`,
                  padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.14em',
                }}>{b}</span>
              ))}
            </div>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px',
                background: T.cyan, border: 'none', cursor: 'pointer',
                fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
                fontSize: 10, color: T.bg,
                textTransform: 'uppercase', letterSpacing: '0.18em',
              }}
            >
              Solicitar Consulta →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* ─── SERVICES ROOT ──────────────────────────────── */
const Services = () => {
  const [active, setActive] = useState(SVC[0].id);
  const activeData = SVC.find(s => s.id === active);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      id="servicios"
      style={{
        background: T.bg,
        paddingTop: 'clamp(80px,10vh,120px)',
        paddingBottom: 'clamp(80px,10vh,120px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.45,
        backgroundImage: `
          linear-gradient(${T.brand}09 1px, transparent 1px),
          linear-gradient(90deg, ${T.brand}09 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
      }} />

      {/* Noise */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '220px 220px',
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', left: '40%', top: '10%',
        width: '45vw', height: '55vh', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse, ${T.brand}18 0%, transparent 60%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── SECTION HEADER ── */}
        <Header />

        {/* ── DESKTOP / TABLET: Split-screen ── */}
        <div className="svc-desktop" style={{
          display: 'flex',
          gap: 0,
          maxWidth: '100%',
        }}>
          {/* LEFT: sticky list */}
          <div style={{
            width: '44%', flexShrink: 0,
            padding: '0 clamp(24px,5vw,80px)',
            /* Sticky container */
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            maxHeight: '100vh',
            overflowY: 'auto',
            paddingTop: 4, paddingBottom: 4,
          }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: SILK }}
              style={{ paddingLeft: 24 }} /* room for the active bar */
            >
              {SVC.map(s => (
                <Item
                  key={s.id}
                  s={s}
                  isActive={active === s.id}
                  onHover={() => setActive(s.id)}
                  onClick={() => setActive(s.id)}
                />
              ))}
            </motion.div>
          </div>

          {/* RIGHT: detail panel */}
          <div style={{ flex: 1, minHeight: 520, position: 'relative' }}>
            {/* border divider */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 1,
              background: `linear-gradient(180deg, transparent 0%, ${T.brand}44 20%, ${T.brand}44 80%, transparent 100%)`,
            }} />

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: SILK, delay: 0.15 }}
              style={{
                background: `linear-gradient(135deg, ${T.bgCard} 0%, ${T.bg} 100%)`,
                border: `1px solid ${T.brand}30`,
                marginLeft: 0,
                minHeight: 520,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <AnimatePresence mode="wait">
                {activeData && <Detail key={activeData.id} s={activeData} />}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* ── MOBILE: stacked cards ── */}
        <div className="svc-mobile" style={{
          display: 'none',
          padding: '0 clamp(20px,4vw,32px)',
        }}>
          {SVC.map(s => (
            <MobileCard
              key={s.id}
              s={s}
              isActive={active === s.id}
              onToggle={() => setActive(active === s.id ? null : s.id)}
            />
          ))}
        </div>

        {/* ── BOTTOM CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: SILK, delay: 0.4 }}
          style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            gap: 20,
            padding: 'clamp(40px,5vh,64px) clamp(24px,5vw,80px) 0',
            borderTop: `1px solid ${T.brand}22`,
            marginTop: 'clamp(40px,5vh,64px)',
          }}
        >
          <div>
            <p style={{
              fontFamily: '"Cormorant Garamond",serif', fontStyle: 'italic', fontWeight: 600,
              fontSize: 'clamp(20px,2.5vw,28px)',
              color: T.muted, margin: 0, letterSpacing: '-0.01em',
              paddingBottom: '0.06em',
            }}>¿Tienes una necesidad específica?</p>
            <p style={{
              fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 13,
              color: T.dim, margin: '5px 0 0',
            }}>Diseñamos soluciones a medida para cada desafío del sector energético.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            data-c="consultar"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 32px',
              background: 'transparent',
              border: `1px solid ${T.brand}`,
              cursor: 'pointer',
              fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
              fontSize: 10.5, color: T.cyan,
              textTransform: 'uppercase', letterSpacing: '0.2em',
              transition: 'all .3s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = T.bg; e.currentTarget.style.borderColor = T.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.cyan; e.currentTarget.style.borderColor = T.brand; }}
          >
            Agendar Consulta Estratégica
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>

      </div>

      <style>{`
        .svc-desktop { display: flex !important; }
        .svc-mobile  { display: none  !important; }
        @media (max-width: 768px) {
          .svc-desktop { display: none  !important; }
          .svc-mobile  { display: block !important; }
        }
      `}</style>
    </section>
  );
};

export default Services;
