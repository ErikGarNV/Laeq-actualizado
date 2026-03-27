import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/*
  FONTS (index.html <head>)
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
*/

/* ─── TOKENS — LIGHT EDITION ──────────────────── */
const T = {
  // Backgrounds
  bg:      '#F7FAFD',        // base page — white with barely-there blue tint
  bgCard:  '#FFFFFF',        // pure white cards
  bgDeep:  '#EDF3F9',        // slightly deeper for alternate surfaces
  bgModal: '#FFFFFF',        // modal — pure white
  // Brand blues
  brand:   '#1A6FA8',        // primary blue (replaces dark brand)
  active:  '#0E5A8F',        // deeper active state
  cyan:    '#0A8FC7',        // accent blue (same vivid cyan, stays)
  // Text & UI
  white:   '#0D1B2A',        // main text — near-black navy (was #E8F4FC)
  muted:   'rgba(18,48,82,0.62)',    // secondary text
  dim:     'rgba(18,48,82,0.38)',    // tertiary / labels
  // Borders & surfaces
  line:    'rgba(26,111,168,0.14)',
  lineHov: 'rgba(10,143,199,0.32)',
  cardShadow: '0 2px 24px rgba(26,111,168,0.07), 0 1px 4px rgba(26,111,168,0.05)',
  cardShadowHov: '0 8px 40px rgba(10,143,199,0.13), 0 2px 8px rgba(26,111,168,0.08)',
};

const SILK = [0.16, 1, 0.3, 1];
const EXPO = [0.76, 0, 0.24, 1];

/* ─── ALL REAL PROJECTS ───────────────────────── */
const PROJECTS = [
  {
    id: 'ppa-engie-500mw',
    year: '2022',
    cat: 'Contratos PPA',
    tag: 'Contratos',
    client: 'ENGIE Perú',
    title: 'Estructuración PPA\nRenovables.',
    headline: '500 MW contratados',
    color: '#0A8FC7',
    summary: 'Asesoría integral en estructuración de contratos PPA para proyectos solares y eólicos.',
    scope: 'Diseño y negociación de contratos PPA . Análisis de riesgo regulatorio, cláusulas de indexación y mecanismos de garantía ante  OSINERGMIN.',
    results: ['Energía renovable contratada', 'Estructura PPA ', '50% de costos de energia', 'Reduccion de riesgos regulatorios'],
    kpi: { val: '500 MW', label: 'Contratados' },
    links: [
      { label: 'LinkedIn LAEQ', url: 'https://www.linkedin.com/company/luis-espinoza-&-asociados' },
    ],
  },
  {
    id: 'osinergmin-gas-reg',
    year: '2023',
    cat: 'Regulación',
    tag: 'Regulación',
    client: 'OSINERGMIN',
    title: 'Marco Regulatorio\nGas Natural — OSINERGMIN',
    headline: '15 procedimientos técnicos',
    color: '#1EB8F0',
    summary: 'Desarrollo del marco regulatorio integral para el sector gas natural peruano con OSINERGMIN, incluyendo metodologías tarifarias y normativa de supervisión.',
    scope: 'Revisión del marco normativo, desarrollo de metodologías tarifarias innovadoras, Participacion en procedimiento tecnicos regulatorios, supervicion y fiscalizacion técnicos de supervisión y fiscalización, mecanismos de incentivos para eficiencia operativa.',
    results: ['15 procedimientos técnicos especializados', 'Metodología tarifaria aprobada', '99% de implementación exitosa', 'Reducción 20% en tiempos de trámite'],
    kpi: { val: '99%', label: 'Implementación' },
    links: [
      { label: 'OSINERGMIN', url: 'https://www.osinergmin.gob.pe' },
      { label: 'Consultor OSINERGMIN', url: 'https://theorg.com/org/osinergmin/org-chart/luis-espinoza' },
    ],
  },
  {
    id: 'bess-mercado-electrico',
    year: '2023',
    cat: 'Estudios Renovables',
    tag: 'Estudios',
    client: 'Sector Energético',
    title: 'Inclusión de BESS en el\nMercado Eléctrico Peruano',
    headline: 'Estudio pionero en Perú',
    color: '#0E9E82',
    summary: 'Análisis de condiciones legales y normativas para la inclusión de sistemas de almacenamiento BESS en el SEIN. Ponencia presentada en Expo Energía Perú 2023.',
    scope: 'Evaluación del marco regulatorio vigente, identificación de vacíos normativos, propuesta de mecanismos de retribución y hoja de ruta de implementación para baterías de almacenamiento en el mercado eléctrico peruano.',
    results: ['Primer estudio integral BESS en Perú', 'Propuesta normativa ante MINEM', 'Ponencia en Expo Energía Perú 2023', 'Hoja de ruta 2024-2027 elaborada'],
    kpi: { val: 'BESS', label: 'Integración SEIN' },
    links: [
      { label: 'Revista Energía PE', url: 'https://x.com/rev_energiape/status/1673839769124589570' },
      { label: 'Expo Energía Perú', url: 'https://www.expoenergiaperu.com/conferencistas/' },
    ],
  },
  {
    id: 'conimera-transicion',
    year: '2023',
    cat: 'Publicación & Conferencia',
    tag: 'Conferencias',
    client: 'CIP Lima — CONIMERA',
    title: 'Transición Energética\n— CONIMERA 2023',
    headline: 'Conferencia magistral CIP',
    color: '#7B5CF0',
    summary: 'Conferencia magistral sobre transición energética, tendencias, costos de desarrollo y reformas regulatorias ante el Colegio de Ingenieros del Perú — Consejo Departamental Lima.',
    scope: 'Análisis de escenarios de transición energética en el SEIN, evaluación de costos por tecnología (solar, eólica, gas, hidro), propuestas de reforma regulatoria y marco de subastas de servicios complementarios.',
    results: ['Conferencia magistral ante CIP Lima', 'Panel con OSINERGMIN y MINEM', 'Propuestas de reforma publicadas', 'Reconocimiento sectorial como referente'],
    kpi: { val: 'CIP', label: 'Reconocimiento' },
    links: [
      { label: 'Programa CONIMERA 2023', url: 'https://cdlima.org.pe/conoce-el-programa-del-primer-dia-de-conimera-2023/' },
      { label: 'LinkedIn Luis Espinoza', url: 'https://www.linkedin.com/in/luis-espinoza-46295946/' },
    ],
  },
  {
    id: 'gas-natural-conferencia-2022',
    year: '2022',
    cat: 'Regulación Gas Natural',
    tag: 'Regulación',
    client: 'Conferencia Gas Natural Perú',
    title: 'Marco Normativo\nAcceso Gas Natural — XI Conf.',
    headline: 'Ponencia XI Conferencia GN',
    color: '#D4830A',
    summary: 'Análisis del marco normativo y regulatorio para agilizar el acceso al gas natural en el Perú. Exposición en la XI Conferencia Gas Natural Perú 2022 organizada por Doble T y Revista Energía.',
    scope: 'Evaluación de barreras regulatorias de acceso, propuestas de simplificación normativa, análisis de modelos de concesión y masificación del gas natural en zonas no concesionadas del Perú.',
    results: ['Ponencia en XI Conferencia GN 2022', 'Propuestas de simplificación regulatoria', 'Análisis de modelos de concesión', 'Publicado en Revista Energía PE'],
    kpi: { val: 'XI', label: 'Conferencia Gas Natural' },
    links: [
      { label: 'Revista Energía — Conferencia GN', url: 'https://revistaenergia.pe/balance-y-desafios-del-gasnatural-en-el-peru/' },
      { label: 'Doble T Comunicaciones', url: 'https://doblet.com.pe/conferencia-gas-natural-peru/' },
    ],
  },
  {
    id: 'petroperu-optimizacion',
    year: '2022',
    cat: 'Hidrocarburos',
    tag: 'Hidrocarburos',
    client: 'PETROPERÚ',
    title: 'Optimización Cadena\nde Suministro — PETROPERÚ',
    headline: 'En costos operativos',
    color: '#D94F4F',
    summary: 'Análisis y optimización de la cadena de suministro de combustibles líquidos a nivel nacional, logrando una reducción comprobada en costos operativos para PETROPERÚ.',
    scope: 'Diagnóstico de la cadena de suministro, identificación de ineficiencias logísticas y tarifarias, diseño de modelo de optimización y rediseño de contratos con proveedores estratégicos en 3 regiones.',
    results: ['15% reducción en costos operativos', 'Nuevo modelo tarifario implementado', 'Optimización logística en 3 regiones'],
    kpi: { val: '−15%', label: 'Optimización Costos' },
    links: [
      { label: 'PETROPERÚ', url: 'https://www.petroperu.com.pe' },
    ],
  },
  {
    id: 'minem-regulacion',
    year: '2016–2020',
    cat: 'Política Energética',
    tag: 'Regulación',
    client: 'MINEM',
    title: 'Consultoría en Regulación\ny Planificación — MINEM',
    headline: 'Asesoría de alta dirección',
    color: '#0A8FC7',
    summary: 'Asesoría de regulación energética y planificación estratégica para el Ministerio de Energía y Minas del Perú.',
    scope: 'Diseño de marcos normativos para electricidad e hidrocarburos, revisión de política tarifaria, elaboración de planes de largo plazo y asesoría directa en toma de decisiones estratégicas del sector.',
    results: ['Marco normativo eléctrico actualizado', 'Política tarifaria reformada', 'Planes de largo plazo elaborados', 'Asesoría directa al Viceministro'],
    kpi: { val: 'MINEM', label: 'Consultor oficial' },
    links: [
      { label: 'Perfil ESAN — Luis Espinoza', url: 'https://www.esan.edu.pe/directorio/luis-espinoza-quinones' },
      { label: 'The Org — MINEM', url: 'https://theorg.com/org/osinergmin/org-chart/luis-espinoza' },
    ],
  },
  {
    id: 'sector-energia-articulo',
    year: '2021',
    cat: 'Publicación',
    tag: 'Conferencias',
    client: 'SPR / Sector Energético',
    title: 'Los Verdaderos Problemas\ndel Sector Energía',
    headline: 'Artículo de referencia sectorial',
    color: '#0E9E82',
    summary: 'Análisis de los cuatro problemas estructurales del sector energético peruano: seguridad de suministro, competitividad, medio ambiente e inclusión social. Publicado en SPR.',
    scope: 'Diagnóstico integral del sector: gestión del gas de Camisea, variabilización de costos para generadores térmicos, integración de RER, papel del Gasoducto Sur Peruano y propuestas de reforma al mercado eléctrico.',
    results: ['Artículo citado en debates del MINEN', 'Propuesta del gestor de gas natural', 'Análisis RER vs. ciclo combinado', 'Publicado en SPR — Sociedad Peruana'],
    kpi: { val: 'SPR', label: 'Publicación referente' },
    links: [
      { label: 'Artículo completo — SPR', url: 'https://www.spr.org.pe/los-verdaderos-problemas-del-sector-energia/' },
      { label: 'LinkedIn Luis Espinoza', url: 'https://www.linkedin.com/in/luis-espinoza-46295946/' },
    ],
  },
  {
    id: 'esan-docencia',
    year: '2014–2024',
    cat: 'Capacitación & Docencia',
    tag: 'Capacitación',
    client: 'ESAN / Sector Privado',
    title: 'Programas de Capacitación\nSectorial — 10 Años',
    headline: '500+ profesionales formados',
    color: '#7B5CF0',
    summary: 'Programas continuos de capacitación en regulación energética, gas natural, PPA y energías renovables para empresas del sector. Docente en ESAN y conferencista en los principales foros del sector.',
    scope: 'Diseño e impartición de cursos in-house, diplomas de especialización en ESAN (Gas Natural, Energías Renovables, Gestión de la Energía), talleres para ENGIE, Cálidda y entidades públicas.',
    results: ['500+ profesionales capacitados', 'Docente ESAN — 5 programas activos', 'In-house: ENGIE, Cálidda, Luz del Sur', 'Conferencista CONIMERA 2023 — CIP Lima'],
    kpi: { val: '500+', label: 'Profesionales' },
    links: [
      { label: 'ESAN — Luis Espinoza', url: 'https://www.esan.edu.pe/directorio/luis-espinoza-quinones' },
      { label: 'CONIMERA 2023 — CIP', url: 'https://cdlima.org.pe/conoce-el-programa-del-primer-dia-de-conimera-2023/' },
    ],
  },
  {
    id: 'gas-natural-conf-2025',
    year: '2025',
    cat: 'Conferencia Gas Natural',
    tag: 'Conferencias',
    client: 'XIV Conferencia GN Perú',
    title: 'Viabilidad Gas Natural\ny Renovables — 2025',
    headline: 'XIV Conferencia GN Perú',
    color: '#D4830A',
    summary: 'Exposición sobre la viabilidad, costos y evolución de la coexistencia del gas natural con energías renovables en la matriz energética peruana. XIV Conferencia Gas Natural Perú 2025.',
    scope: 'Análisis técnico-económico de escenarios de integración RER en el SEIN, reservas de gas natural Camisea, propuestas regulatorias para masificación y evaluación del rol del Gasoducto Sur Peruano.',
    results: ['Expositor XIV Conferencia GN 2025', 'Análisis reservas Camisea 15 años', 'Propuesta masificación con Ley tarifa nivelada', 'Recomendaciones Gasoducto Sur Peruano'],
    kpi: { val: '2025', label: 'Conferencia Gas Natural' },
    links: [
      { label: 'XIV Conferencia Gas Natural', url: 'https://doblet.com.pe/conferencia-gas-natural-peru/' },
      { label: 'Expo Energía Perú 2025', url: 'https://www.expoenergiaperu.com/conferencistas/' },
    ],
  },
];

const FILTERS = ['Todos', 'Contratos', 'Regulación', 'Estudios', 'Hidrocarburos', 'Capacitación', 'Conferencias'];

/* ─── CONTACT FORM ─────────────────────────────── */
const ContactForm = ({ project: p, onBack, onClose }) => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    email: '',
    mensaje: `Hola, me interesa obtener más información sobre el proyecto "${p.title.replace('\n', ' ')}" similar a lo que realizaron para ${p.client}. Me gustaría explorar una consulta estratégica.`,
  });

  const handleSend = useCallback(() => {
    if (!form.nombre || !form.email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1400);
  }, [form]);

  const inputStyle = {
    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
    background: '#F0F6FB',
    border: `1px solid ${T.line}`,
    fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: T.white,
    outline: 'none', transition: 'border-color .25s, background .25s',
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: SILK }}
        style={{
          padding: 'clamp(40px,6vw,64px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: 380, textAlign: 'center', gap: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: SILK }}
          style={{
            width: 72, height: 72,
            background: `${p.color}14`,
            border: `1px solid ${p.color}44`,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h4 style={{
            fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
            fontSize: 28, color: T.white, margin: '0 0 12px',
            letterSpacing: '-0.02em',
          }}>Mensaje enviado</h4>
          <p style={{
            fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 14,
            color: T.muted, lineHeight: 1.7, maxWidth: 340, margin: '0 auto 24px',
          }}>
            Luis Espinoza y su equipo te contactarán dentro de las próximas <strong style={{ color: T.white, fontWeight: 500 }}>24 horas hábiles</strong>.
          </p>
          <button onClick={onClose} style={{
            padding: '12px 28px', background: p.color, border: 'none', cursor: 'pointer',
            fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: 10.5,
            color: '#fff', textTransform: 'uppercase', letterSpacing: '0.2em',
          }}>Cerrar</button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: SILK }}
      style={{ padding: 'clamp(24px,4vw,48px)' }}
    >
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: '"DM Mono",monospace', fontSize: 9.5,
          color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em',
          transition: 'color .25s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = T.cyan}
        onMouseLeave={e => e.currentTarget.style.color = T.muted}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Volver al proyecto
      </button>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 28, height: 1, background: p.color }} />
          <span style={{
            fontFamily: '"DM Mono",monospace', fontSize: 9.5,
            color: p.color, textTransform: 'uppercase', letterSpacing: '0.28em',
          }}>Consulta Estratégica</span>
        </div>
        <h3 style={{
          fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
          fontSize: 'clamp(22px,3vw,34px)', color: T.white, margin: '0 0 8px',
          lineHeight: 1.05, letterSpacing: '-0.02em',
        }}>
          ¿Tienes un proyecto similar<br/>
          <em style={{ color: p.color, fontStyle: 'italic' }}>a {p.client}?</em>
        </h3>
        <p style={{
          fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 13,
          color: T.muted, margin: 0, lineHeight: 1.7,
        }}>
          Cuéntanos tu desafío — Luis Espinoza y su equipo responden personalmente.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'nombre', placeholder: 'Nombre completo *', type: 'text' },
            { key: 'empresa', placeholder: 'Empresa / Organización', type: 'text' },
          ].map(({ key, placeholder, type }) => (
            <input
              key={key}
              type={type} placeholder={placeholder}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = T.line; e.target.style.background = '#F0F6FB'; }}
            />
          ))}
        </div>

        <input
          type="email" placeholder="Correo electrónico *"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.background = '#fff'; }}
          onBlur={e => { e.target.style.borderColor = T.line; e.target.style.background = '#F0F6FB'; }}
        />

        <textarea
          rows={4}
          value={form.mensaje}
          onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
          onFocus={e => { e.target.style.borderColor = T.cyan; e.target.style.background = '#fff'; }}
          onBlur={e => { e.target.style.borderColor = T.line; e.target.style.background = '#F0F6FB'; }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: `${p.color}08`, border: `1px solid ${p.color}22` }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{
            fontFamily: '"DM Mono",monospace', fontSize: 9, color: `${p.color}AA`,
            textTransform: 'uppercase', letterSpacing: '0.16em',
          }}>Referencia: {p.title.replace('\n', ' ')} — {p.year}</span>
        </div>

        <motion.button
          onClick={handleSend}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          style={{
            padding: '15px 32px',
            background: loading ? `${p.color}88` : p.color,
            border: 'none', cursor: loading ? 'wait' : 'pointer',
            fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
            fontSize: 10.5, color: '#fff',
            textTransform: 'uppercase', letterSpacing: '0.22em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            transition: 'background .28s',
          }}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                style={{ width: 14, height: 14, border: `2px solid rgba(255,255,255,0.3)`, borderTopColor: '#fff', borderRadius: '50%' }}
              />
              Enviando…
            </>
          ) : (
            <>
              Enviar Consulta Estratégica
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </motion.button>

        <p style={{ fontFamily: '"DM Mono",monospace', fontSize: 9, color: T.dim, textAlign: 'center', letterSpacing: '0.1em' }}>
          Respuesta garantizada en 24h hábiles · +51 1 277 5502
        </p>
      </div>
    </motion.div>
  );
};

/* ─── MODAL ───────────────────────────────────── */
const Modal = ({ project: p, onClose }) => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'rgba(10,30,58,0.55)',
        backdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(16px,4vw,40px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 44, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.98 }}
        transition={{ duration: 0.55, ease: SILK }}
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bgModal,
          border: `1px solid ${p.color}22`,
          boxShadow: `0 32px 80px rgba(10,30,58,0.18), 0 8px 24px rgba(10,30,58,0.1)`,
          width: '100%', maxWidth: 820,
          maxHeight: '92vh', overflowY: 'auto',
          position: 'relative',
          scrollbarWidth: 'thin',
          scrollbarColor: `${T.brand}33 transparent`,
        }}
      >
        {/* Accent top line */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: SILK }}
          style={{
            position: 'sticky', top: 0, left: 0, right: 0, height: 2, zIndex: 2,
            background: `linear-gradient(90deg, ${p.color} 0%, ${p.color}44 65%, transparent 100%)`,
            transformOrigin: 'left',
          }}
        />

        <AnimatePresence mode="wait">
          {showForm ? (
            <ContactForm key="form" project={p} onBack={() => setShowForm(false)} onClose={onClose} />
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ padding: 'clamp(24px,4vw,48px)' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 9, background: `${p.color}12`, color: p.color, border: `1px solid ${p.color}33`, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.18em' }}>{p.cat}</span>
                    <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 9, color: T.dim, textTransform: 'uppercase', letterSpacing: '0.16em' }}>{p.client}</span>
                    <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 9, color: T.dim, letterSpacing: '0.14em' }}>{p.year}</span>
                  </div>
                  <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: 'clamp(22px,3.2vw,38px)', color: T.white, margin: 0, lineHeight: 1.05, letterSpacing: '-0.02em', whiteSpace: 'pre-line', paddingBottom: '0.05em' }}>{p.title}</h3>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: `1px solid ${T.line}`, width: 44, height: 44, flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color .3s, background .3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.background = `${T.cyan}08`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.background = 'none'; }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke={T.cyan} strokeWidth="1.3"><path d="M1 1l11 11M12 1L1 12" /></svg>
                </button>
              </div>

              {/* KPI banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 18px', background: `${p.color}08`, border: `1px solid ${p.color}22`, marginBottom: 24 }}>
                <span style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: 'clamp(26px,3.8vw,42px)', color: p.color, lineHeight: 1, letterSpacing: '-0.02em' }}>{p.kpi.val}</span>
                <div style={{ width: 1, height: 36, background: `${p.color}25` }} />
                <div>
                  <p style={{ fontFamily: '"DM Mono",monospace', fontSize: 8.5, color: T.dim, textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 2px' }}>Resultado clave</p>
                  <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: 13, color: T.muted, margin: 0 }}>{p.headline}</p>
                </div>
              </div>

              {/* Summary */}
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 'clamp(13px,1.05vw,15px)', color: T.muted, lineHeight: 1.85, margin: '0 0 24px' }}>{p.summary}</p>
              <div style={{ height: 1, background: T.line, marginBottom: 24 }} />

              {/* Scope */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.color }} />
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: 12, color: T.white, textTransform: 'uppercase', letterSpacing: '0.16em' }}>Alcance del Proyecto</span>
                </div>
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 'clamp(12.5px,1vw,14px)', color: T.muted, lineHeight: 1.85, margin: 0 }}>{p.scope}</p>
              </div>

              {/* Results */}
              <div style={{ background: '#EDF3F9', border: `1px solid ${T.line}`, padding: 'clamp(14px,2.5vw,24px)', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12" /></svg>
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: 11, color: T.white, textTransform: 'uppercase', letterSpacing: '0.16em' }}>Logros Principales</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
                  {p.results.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: p.color, flexShrink: 0, marginTop: 5 }} />
                      <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 400, fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* External links */}
              {p.links && p.links.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {p.links.map(lk => (
                    <a key={lk.url} href={lk.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px',
                        border: `1px solid ${T.line}`,
                        fontFamily: '"DM Mono",monospace', fontSize: 9,
                        color: T.muted, textDecoration: 'none',
                        textTransform: 'uppercase', letterSpacing: '0.14em',
                        transition: 'all .25s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.color = T.muted; }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                      {lk.label}
                    </a>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowForm(true)}
                  style={{
                    flex: 1, minWidth: 200, padding: '14px 24px',
                    background: p.color, border: 'none', cursor: 'pointer',
                    fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
                    fontSize: 10.5, color: '#fff',
                    textTransform: 'uppercase', letterSpacing: '0.2em',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    transition: 'background .28s, box-shadow .28s',
                    boxShadow: `0 4px 20px ${p.color}33`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.active; e.currentTarget.style.boxShadow = `0 6px 28px ${p.color}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = p.color; e.currentTarget.style.boxShadow = `0 4px 20px ${p.color}33`; }}
                >
                  Solicitar Información
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
                <button onClick={onClose} style={{ padding: '13px 22px', background: 'transparent', border: `1px solid ${T.line}`, cursor: 'pointer', fontFamily: '"DM Sans",sans-serif', fontWeight: 400, fontSize: 10.5, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', transition: 'all .28s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.color = T.muted; }}
                >Cerrar</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ─── CARD ────────────────────────────────────── */
const Card = ({ p, onOpen, inView, i }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.07, duration: 0.72, ease: SILK }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(p)}
      data-c="ver"
      style={{
        background: hov
          ? `linear-gradient(145deg, #fff 0%, #F0F6FB 100%)`
          : `linear-gradient(145deg, #FFFFFF 0%, #F7FAFD 100%)`,
        border: `1px solid ${hov ? p.color + '44' : T.line}`,
        boxShadow: hov ? T.cardShadowHov : T.cardShadow,
        padding: 'clamp(20px,2.2vw,32px)',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        transition: 'border-color .35s, box-shadow .35s, background .35s',
        display: 'flex', flexDirection: 'column', minHeight: 268,
      }}
    >
      {/* Color top bar */}
      <motion.div
        animate={{ scaleX: hov ? 1 : 0 }}
        transition={{ duration: 0.45, ease: SILK }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.color} 0%, transparent 100%)`, transformOrigin: 'left' }}
      />
      {/* Corner ambient glow on hover */}
      {hov && <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '55%', height: '75%', pointerEvents: 'none', background: `radial-gradient(ellipse, ${p.color}08 0%, transparent 65%)` }} />}

      {/* Meta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 8.5, color: p.color, textTransform: 'uppercase', letterSpacing: '0.22em', display: 'block', marginBottom: 3 }}>{p.cat}</span>
          <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 8.5, color: T.dim, letterSpacing: '0.12em' }}>{p.client}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 8.5, color: T.dim, letterSpacing: '0.1em' }}>{p.year}</span>
          <motion.div animate={{ x: hov ? 4 : 0, color: hov ? p.color : T.dim }} transition={{ duration: 0.3, ease: SILK }} style={{ lineHeight: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </motion.div>
        </div>
      </div>

      {/* Title */}
      <motion.h3
        animate={{ y: hov ? -2 : 0 }}
        transition={{ duration: 0.3, ease: SILK }}
        style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: 'clamp(18px,2vw,25px)', color: T.white, lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 12px', whiteSpace: 'pre-line', paddingBottom: '0.04em' }}
      >{p.title}</motion.h3>

      {/* Summary */}
      <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 12, color: T.muted, lineHeight: 1.7, margin: '0 0 auto', flex: 1 }}>
        {p.summary.slice(0, 100)}…
      </p>

      {/* Bottom */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 18, paddingTop: 14, borderTop: `1px solid ${hov ? p.color + '22' : T.line}`, transition: 'border-color .35s' }}>
        <div>
          <div style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: 'clamp(20px,2.8vw,30px)', color: p.color, lineHeight: 1, letterSpacing: '-0.02em' }}>{p.kpi.val}</div>
          <div style={{ fontFamily: '"DM Mono",monospace', fontSize: 8, color: T.dim, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 3 }}>{p.kpi.label}</div>
        </div>
        <AnimatePresence>
          {hov && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: SILK }}
              style={{ padding: '7px 14px', background: p.color, fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: 9.5, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.16em', display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 16px ${p.color}33` }}
            >
              Ver detalles
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

/* ─── FILTER PILL ─────────────────────────────── */
const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} data-c="" style={{
    padding: '8px 18px',
    background: active ? T.cyan : 'transparent',
    border: `1px solid ${active ? T.cyan : T.line}`,
    cursor: 'pointer', fontFamily: '"DM Mono",monospace',
    fontSize: 9.5, fontWeight: active ? 500 : 400,
    color: active ? '#fff' : T.muted,
    textTransform: 'uppercase', letterSpacing: '0.18em',
    transition: 'all .28s', whiteSpace: 'nowrap',
    boxShadow: active ? `0 4px 16px ${T.cyan}33` : 'none',
  }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; } }}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.color = T.muted; } }}
  >{label}</button>
);

/* ─── STATS BAR ───────────────────────────────── */
const StatsBar = ({ inView }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.8, ease: SILK, delay: 0.35 }}
    style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: `1px solid ${T.line}`, marginTop: 'clamp(44px,5vh,64px)', background: '#fff', boxShadow: T.cardShadow }}
    className="stats-grid"
  >
    {[
      { val: '10+', label: 'Años de trayectoria\ndesde 2014' },
      { val: '99%', label: 'Tasa de éxito\nprobada' },
      { val: '20+', label: 'Proyectos\nestructurados' },
      { val: '500', label: 'profesionales\ndel sector energético' },
    ].map((item, i) => (
      <div key={i} style={{ padding: 'clamp(18px,2.5vw,28px)', borderRight: i < 3 ? `1px solid ${T.line}` : 'none', background: i % 2 === 0 ? '#F7FAFD' : '#fff' }}>
        <span style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: 'clamp(26px,3.5vw,44px)', color: T.cyan, lineHeight: 1, letterSpacing: '-0.03em', display: 'block' }}>{item.val}</span>
        <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 10.5, color: T.dim, textTransform: 'uppercase', letterSpacing: '0.14em', lineHeight: 1.4, whiteSpace: 'pre-line', display: 'block', marginTop: 6 }}>{item.label}</span>
      </div>
    ))}
  </motion.div>
);

/* ─── PROJECTS ROOT ───────────────────────────── */
const Projects = () => {
  const [filter, setFilter] = useState('Todos');
  const [modal, setModal] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const filtered = filter === 'Todos' ? PROJECTS : PROJECTS.filter(p => p.tag === filter);

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  return (
    <>
      <section ref={ref} id="proyectos" style={{ background: T.bg, paddingTop: 'clamp(80px,10vh,120px)', paddingBottom: 'clamp(80px,10vh,120px)', position: 'relative', overflow: 'hidden' }}>

        {/* ── Refined grid texture — extremely subtle on light ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.6,
          backgroundImage: `linear-gradient(${T.brand}07 1px, transparent 1px), linear-gradient(90deg, ${T.brand}07 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }} />

        {/* Ambient blue radial — top right, very soft */}
        <div style={{
          position: 'absolute', right: '-5%', top: '10%',
          width: '45vw', height: '55vh', pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(ellipse, ${T.cyan}09 0%, transparent 60%)`,
        }} />
        {/* Ambient blue radial — bottom left */}
        <div style={{
          position: 'absolute', left: '-8%', bottom: '5%',
          width: '35vw', height: '40vh', pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(ellipse, ${T.brand}07 0%, transparent 60%)`,
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '0 clamp(24px,5vw,80px)' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: 'clamp(36px,5vh,56px)' }}>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: SILK }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}
            >
              <div style={{ width: 28, height: 1, background: T.cyan }} />
              <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 10, color: T.cyan, textTransform: 'uppercase', letterSpacing: '0.42em' }}>
                Casos de Éxito · Desde 2014
              </span>
            </motion.div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, ease: SILK, delay: 0.1 }}
                style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: 'clamp(42px,6.5vw,88px)', color: T.white, margin: 0, lineHeight: 1, letterSpacing: '-0.025em', paddingBottom: '0.08em' }}
              >
                Proyectos{' '}<em style={{ color: T.cyan, fontStyle: 'italic', fontWeight: 600 }}>Destacados</em>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: SILK, delay: 0.22 }}
                style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 13, color: T.muted, lineHeight: 1.75, maxWidth: 300, margin: 0 }}
              >
                10 años de resultados comprobados en el sector energético peruano.
              </motion.p>
            </div>
          </div>

          {/* ── Filters ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: SILK, delay: 0.18 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'clamp(28px,4vh,48px)' }}
          >
            {FILTERS.map(f => <Pill key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />)}
          </motion.div>

          {/* ── Grid ── */}
          <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(clamp(270px,28vw,340px),1fr))', gap: 'clamp(12px,1.8vw,20px)' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => <Card key={p.id} p={p} i={i} onOpen={setModal} inView={inView} />)}
            </AnimatePresence>
          </motion.div>

          {/* ── Stats ── */}
          <StatsBar inView={inView} />

          {/* ── Bottom CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: SILK, delay: 0.4 }}
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: 'clamp(32px,5vh,52px) 0 0', borderTop: `1px solid ${T.line}`, marginTop: 'clamp(36px,5vh,56px)' }}
          >
            <div>
              <p style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(18px,2.3vw,26px)', color: T.muted, margin: 0, paddingBottom: '0.06em' }}>¿Tienes un proyecto energético?</p>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 300, fontSize: 12.5, color: T.dim, margin: '4px 0 0' }}>Más de 10 años convirtiendo desafíos en resultados. Cuéntanos el tuyo.</p>
            </div>
            <button
              data-c="consultar"
              onClick={() => setModal({ ...PROJECTS[0], title: 'Consulta\nEstratégica', client: 'tu empresa', cat: 'Nuevo Proyecto', kpi: { val: '+10', label: 'años de respaldo' }, color: T.cyan })}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 28px', background: 'transparent', border: `1px solid ${T.brand}`, cursor: 'pointer', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: 10.5, color: T.cyan, textTransform: 'uppercase', letterSpacing: '0.2em', transition: 'all .3s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.boxShadow = `0 6px 24px ${T.cyan}33`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.cyan; e.currentTarget.style.borderColor = T.brand; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Iniciar Conversación
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </motion.div>

        </div>
      </section>

      <AnimatePresence>
        {modal && <Modal project={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>

      <style>{`
        .stats-grid { grid-template-columns: repeat(4,1fr) !important; }
        @media (max-width:640px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        input::placeholder, textarea::placeholder { color: rgba(18,48,82,0.32); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(26,111,168,0.22); }
      `}</style>
    </>
  );
};

export default Projects;
