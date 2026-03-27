import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/*
  FONTS (index.html <head>)
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
*/

/* ─── TOKENS — WHITE/BLUE PALETTE ────────────────────
   Consonante con Hero.jsx: porcelana + azul LAEQ.
   Card: blanco puro elevado. Acento: azul eléctrico.
*/
const T = {
  bg:       '#F4F7FB',           /* porcelana — fondo sección */
  bgCard:   '#FFFFFF',           /* card elevada */
  bgDeep:   '#EAF0F8',           /* azul-white — detalle panel */
  brand:    '#02537E',
  active:   '#0A8FC7',
  cyan:     '#0077B6',           /* acento principal */
  cyanLight:'#1EB8F0',
  ink:      '#0D1F2D',           /* texto principal */
  white:    '#FFFFFF',
  muted:    'rgba(2,83,126,0.58)',
  dim:      'rgba(2,83,126,0.30)',
  line:     'rgba(2,83,126,0.13)',
  lineStrong:'rgba(2,83,126,0.26)',
};

const SILK = [0.16, 1, 0.3, 1];
const EXPO = [0.76, 0, 0.24, 1];

/* ─── DATA ───────────────────────────────────────── */
const SVC = [
  {
    id: 'mercado-energia',
    num: '01',
    title: 'Estudios de mercado\nde la energía',
    tag: 'Mercado',
    short: 'Análisis de mercado, precios y normativa energética.',
    detail: 'Análisis del mercado de la energía, análisis prospectivo de precios de la energía en base a modelos PERSEO y modelos probabilísticos propios. Análisis de inversiones y retorno de capital. Análisis legal y regulatorio de normativa del mercado de la energía.',
    bullets: ['Precios de energía a mediano y largo plazo', 'Estudios de mercado energético', 'Precios SPOT', 'Inversión y retorno'],
    kpi: { val: '20+', label: 'Proyectos de mercado' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l3-3 4 4 8-8 3 3"/><path d="M3 21h18"/></svg>,
  },
  {
    id: 'energeticos',
    num: '02',
    title: 'Proyectos\nMinero - Energéticos',
    tag: 'Proyectos',
    short: 'Análisis y asesoría integral para proyectos minero-energéticos.',
    detail: 'Análisis regulatorio, técnico, legal, económico y financiero de proyectos minero - energéticos. Asesoría integral para consulta pública, permisos y ejecución en el sector. Seguimiento de concesiones y obligaciones contractuales.',
    bullets: ['Análisis legal', 'Modelos financieros', 'Permisos y concesiones', 'Gestión de riesgos'],
    kpi: { val: '10+', label: 'Proyectos asesorados' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  },
  {
    id: 'politica',
    num: '03',
    title: 'Planificación y\nPolítica Energética',
    tag: 'Política',
    short: 'Políticas y planes estratégicos para el sector energético.',
    detail: 'Formulación de políticas energéticas y planificación de largo plazo, con foco en seguridad energética, sostenibilidad y desarrollo de mercado. Experiencia en diseño de planes nacionales y gestión de consultas públicas.',
    bullets: ['Planes de energía', 'Políticas públicas', 'Seguridad energética', 'Transición energética'],
    kpi: { val: '150K', label: 'Beneficiarios' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
  },
  {
    id: 'ppa',
    num: '04',
    title: 'Contratos de Suministro\nde Electricidad (PPA)',
    tag: 'PPA',
    short: 'Asesoría en Power Purchase Agreements y mercado eléctrico.',
    detail: 'Estructuración de PPAs (Contratos de Suministro Eléctrico). Liderazgo en concurso y análisis de precio, plazos, garantías y riesgos para clientes libres versus generadoras/distribuidoras.',
    bullets: ['Estructuración de PPA', 'Análisis de precios', 'Evaluación de riesgos', 'Cláusulas de garantía'],
    kpi: { val: '100+', label: 'Contratos asesorados' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>,
  },
  {
    id: 'gas-reg',
    num: '05',
    title: 'Regulación de\nGas Natural',
    tag: 'Gas',
    short: 'Marco regulatorio y normativo del sector gas natural.',
    detail: 'Análisis integral en procedimientos tarifarios, asesoría en procesos regulatorios de supervisión, fiscalización y Procedimientos Administrativos Sancionadores (PAS). Asesoría en contratos de transporte y distribución de gas natural.',
    bullets: ['Regulación tarifaria', 'Procedimientos PAS', 'Monitoreo regulatorio', 'Normativa sectorial'],
    kpi: { val: '10+', label: 'Años en regulación' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 8v4l2.5 2.5"/></svg>,
  },
  {
    id: 'contratos-gas',
    num: '06',
    title: 'Contratos de\nGas Natural',
    tag: 'Contratos',
    short: 'Estructuración y negociación de contratos de suministro.',
    detail: 'Diseño, estructuración y negociación de contratos de suministro de gas natural para industrias, generadoras y distribuidoras. Optimización de precios, cláusulas take-or-pay y garantías contractuales.',
    bullets: ['Negociación comercial', 'Take-or-pay', 'Cláusulas de garantía', 'Modelos de precio'],
    kpi: { val: '99%', label: 'Tasa de éxito' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    id: 'ambiente',
    num: '07',
    title:'Pericia Técnica –\nSolución de Controversias',
    tag: 'Pericia',
    short: 'Resolución de controversias técnicas en el sector energético.',
    detail: 'Pericia técnica en disputas regulatorias y comerciales. Asesoría en arbitraje, procedimientos administrativos y soluciones alternativas de controversias para proyectos energéticos.',
    bullets: ['Pericias expertas', 'Arbitraje', 'Controversias regulatorias', 'Soluciones técnicas'],
    kpi: { val: '27+', label: 'Pericias técnicas' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  },
  {
    id: 'combustibles',
    num: '08',
    title: 'Precios de\nCombustibles Líquidos',
    tag: 'Precios',
    short: 'Análisis y regulación de precios de combustibles líquidos.',
    detail: 'Monitoreo, análisis y asesoría en fijación de precios de combustibles líquidos. Evaluaciones económico-financieras de proyectos y proyecciones de estructura de costos para optimizar competitividad.',
    bullets: ['Fijación de precios', 'Análisis de costos', 'Proyecciones', 'Cumplimiento normativo'],
    kpi: { val: '−15%', label: 'Optimización Costos' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    id: 'capacitaciones',
    num: '09',
    title: 'Capacitaciones\nIn-House',
    tag: 'Formación',
    short: 'Programas de capacitación técnica y regulatoria para equipos internos.',
    detail: 'Diseño e impartición de programas de formación técnica y regulatoria para equipos corporativos del sector energía. Sesiones in-house adaptadas a la realidad de cada compañía.',
    bullets: ['Regulación eléctrica', 'Gas natural', 'Mercados energéticos', 'Capacitación práctica'],
    kpi: { val: '500+', label: 'Profesionales capacitados' },
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  },
  {
    id: 'legal',
    num: '10',
    title: 'Asesoría Técnica Legal en Procedimiento\nAdministrativo Sancionador - OSINERGMIN',
    tag: 'Formación',
    short: 'Programas de capacitación técnica y regulatoria para equipos internos.',
    detail: 'Bindamos soporte y servicio de asesoría técnica - legal en Procedimientos Administrativos Sancionadores iniciados por OSINERGMIN a los agentes del mercado.',
    bullets: ['Soporte técnico', 'Soporte legal', 'PAS', 'Derecho Administrativo'],
    kpi: { val: '70+', label: 'Asesorias Legales' },
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

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: SILK, delay: 0.1 }}
        style={{
          fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
          fontSize: 'clamp(46px,6.8vw,94px)',
          color: T.ink, margin: 0,
          lineHeight: 1,
          letterSpacing: '-0.025em',
          paddingBottom: '0.08em',
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
    {/* Background tint — azul muy sutil en superficie blanca */}
    <div style={{
      position: 'absolute', top: '-20%', right: '-10%',
      width: '70%', height: '70%', pointerEvents: 'none',
      background: `radial-gradient(ellipse, ${T.active}0C 0%, transparent 65%)`,
    }} />

    {/* Top accent line */}
    <motion.div
      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
      transition={{ duration: 0.7, ease: SILK }}
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${T.cyan} 0%, ${T.active}55 60%, transparent 100%)`,
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
          color: T.dim, textTransform: 'uppercase', letterSpacing: '0.2em',
        }}>{s.tag}</span>
      </div>

      {/* Icon + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 52, height: 52, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: T.bgDeep,
          border: `1px solid ${T.lineStrong}`,
          color: T.cyan,
        }}>{s.icon}</div>
        <h3 style={{
          fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
          fontSize: 'clamp(24px,3vw,38px)',
          color: T.ink, margin: 0,
          lineHeight: 1.05, letterSpacing: '-0.02em',
          whiteSpace: 'pre-line',
          paddingBottom: '0.06em',
        }}>{s.title}</h3>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: T.line, marginBottom: 20 }} />

      {/* Detail */}
      <p style={{
        fontFamily: '"DM Sans",sans-serif', fontWeight: 400,
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
              color: T.muted, lineHeight: 1.4,
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
      borderTop: `1px solid ${T.line}`,
    }}>
      <div>
        <div style={{
          fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
          fontSize: 'clamp(28px,4vw,48px)',
          color: T.cyan, lineHeight: 1, letterSpacing: '-0.03em',
        }}>{s.kpi.val}</div>
        <div style={{
          fontFamily: '"DM Mono",monospace', fontSize: 9,
          color: T.dim, textTransform: 'uppercase', letterSpacing: '0.18em',
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
          fontSize: 10.5, color: '#fff',
          textTransform: 'uppercase', letterSpacing: '0.2em',
          transition: 'background .28s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.brand}
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
      borderBottom: `1px solid ${isActive ? T.lineStrong : T.line}`,
      cursor: 'pointer', transition: 'border-color .3s',
      position: 'relative',
      background: isActive ? `linear-gradient(90deg, ${T.cyan}06 0%, transparent 80%)` : 'transparent',
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
      color: isActive ? T.cyan : T.dim,
      minWidth: 24, flexShrink: 0, transition: 'color .3s',
    }}>{s.num}</span>

    {/* Icon */}
    <div style={{
      flexShrink: 0, color: isActive ? T.cyan : T.dim,
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
        color: isActive ? T.ink : T.muted,
        transition: 'color .3s',
        whiteSpace: 'pre-line', flex: 1,
        paddingBottom: '0.05em',
      }}
    >{s.title}</motion.span>

    {/* Arrow */}
    <motion.div
      animate={{ rotate: isActive ? 0 : -90, color: isActive ? T.cyan : T.dim }}
      transition={{ duration: 0.3, ease: EXPO }}
      style={{ flexShrink: 0, lineHeight: 0 }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </motion.div>
  </div>
);

/* ─── MOBILE CARD ─────── */
const MobileCard = ({ s, isActive, onToggle }) => (
  <div style={{
    border: `1px solid ${isActive ? T.lineStrong : T.line}`,
    background: isActive ? T.bgDeep : T.white,
    marginBottom: 12, transition: 'all .3s',
  }}>
    <div
      onClick={onToggle} data-c=""
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 20px', cursor: 'pointer',
      }}
    >
      <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 9.5, color: T.cyan, minWidth: 22 }}>{s.num}</span>
      <div style={{ color: isActive ? T.cyan : T.dim, lineHeight: 0, flexShrink: 0 }}>{s.icon}</div>
      <span style={{
        fontFamily: '"Cormorant Garamond",serif', fontWeight: 600,
        fontSize: 18, color: isActive ? T.ink : T.muted,
        flex: 1, lineHeight: 1.1,
        whiteSpace: 'pre-line',
        paddingBottom: '0.04em',
      }}>{s.title}</span>
      <motion.div
        animate={{ rotate: isActive ? 45 : 0 }}
        transition={{ duration: 0.3, ease: EXPO }}
        style={{ color: isActive ? T.cyan : T.dim, lineHeight: 0 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.div>
    </div>

    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
          transition={{ duration: 0.45, ease: EXPO }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${T.line}` }}>
            <p style={{
              fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 13.5,
              color: T.muted, lineHeight: 1.8, margin: '16px 0',
            }}>{s.detail}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {s.bullets.map(b => (
                <span key={b} style={{
                  fontFamily: '"DM Mono",monospace', fontSize: 9,
                  color: T.active, border: `1px solid ${T.active}55`,
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
                fontSize: 10, color: '#fff',
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
      {/* Grid texture — azul muy sutil sobre blanco */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 1,
        backgroundImage: `
          linear-gradient(${T.brand}07 1px, transparent 1px),
          linear-gradient(90deg, ${T.brand}07 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
      }} />

      {/* Noise — mínimo, solo da textura táctil */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.015,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '220px 220px',
      }} />

      {/* Glow — azul muy difuso */}
      <div style={{
        position: 'absolute', left: '40%', top: '10%',
        width: '45vw', height: '55vh', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse, ${T.active}08 0%, transparent 60%)`,
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
              style={{ paddingLeft: 24 }}
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
              background: `linear-gradient(180deg, transparent 0%, ${T.lineStrong} 20%, ${T.lineStrong} 80%, transparent 100%)`,
            }} />

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: SILK, delay: 0.15 }}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.line}`,
                boxShadow: `0 2px 40px ${T.brand}08, 0 0 0 1px ${T.line}`,
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
            borderTop: `1px solid ${T.line}`,
            marginTop: 'clamp(40px,5vh,64px)',
          }}
        >
          <div>
            <p style={{
              fontFamily: '"Cormorant Garamond",serif', fontStyle: 'italic', fontWeight: 600,
              fontSize: 'clamp(20px,2.5vw,28px)',
              color: T.brand, margin: 0, letterSpacing: '-0.01em',
              paddingBottom: '0.06em',
            }}>¿Tienes una necesidad específica?</p>
            <p style={{
              fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 13,
              color: T.muted, margin: '5px 0 0',
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
              fontSize: 10.5, color: T.brand,
              textTransform: 'uppercase', letterSpacing: '0.2em',
              transition: 'all .3s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = T.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.brand; e.currentTarget.style.borderColor = T.brand; }}
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
