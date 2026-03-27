import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logoLaeq from '../assets/logo-laeq.jpg';

/*
  Términos y Condiciones — LAEQ & Asociados S.A.C.
  Contenido extraído del documento oficial DOC-20260324-WA0056.pdf
  Ruta: /terminos-y-condiciones
*/

/* ═══ TOKENS (modo claro) ════════════════════════ */
const T = {
  bg:     '#FAFCFF',
  bgAlt:  '#F0F6FF',
  bgDeep: '#071E30',
  brand:  '#02537E',
  active: '#0A8FC7',
  cyan:   '#1EB8F0',
  text:   '#0A1F3C',
  muted:  '#4A6B8A',
  dim:    '#8AAEC8',
  border: 'rgba(2,83,126,0.12)',
};
const SILK = [0.16, 1, 0.3, 1];

const TERMS = [
  {
    id: 'aceptacion',
    title: 'Aceptación de los Términos',
    content: `Al acceder al sitio web www.laeqasociados.com de Luis Espinoza Quiñones & Asociados — Desarrolladores de Mercados Energéticos S.A.C. (en adelante, LAEQ & ASOCIADOS), usted se compromete a cumplir con los Términos y Condiciones Generales de Uso que se describen en el presente documento, para cuyos efectos al acceder al mismo, adoptará la condición de "Usuario".

La condición de Usuario, persona que accede al Sitio Web de LAEQ & ASOCIADOS, implica la total aceptación de estos Términos y Condiciones, tal como los mismos se encuentren vigentes.`
  },
  {
    id: 'capacidad',
    title: 'Capacidad Legal y Veracidad de la Información',
    content: `El Usuario declara y garantiza estar apto y tener capacidad legal para aceptar los presentes Términos y Condiciones, y que toda la información que proporcione a LAEQ & ASOCIADOS en el uso del Sitio Web, bajo cualquier forma, será exacta, verdadera, completa y correcta; liberando de cualquier responsabilidad sobre el particular a LAEQ & ASOCIADOS.`
  },
  {
    id: 'uso-correcto',
    title: 'Uso Correcto del Sitio Web',
    content: `El Usuario utilizará el Sitio Web y los servicios contenidos en ella, de conformidad con las normas aplicables y vigentes, los principios de la buena fe, la costumbre y los usos generalmente aceptados. En ese sentido, el Usuario es responsable por el buen uso de la información y los servicios contenidos en el Sitio Web, y se compromete a evitar cualquier tipo de acción que pueda dañar a sistemas, equipos o servicios que sean accesibles directa o indirectamente a través del internet, incluyendo, pero no limitándose a la congestión intencional de enlaces o sistemas.`
  },
  {
    id: 'propiedad-intelectual',
    title: 'Propiedad Intelectual',
    content: `El Sitio Web www.laeqasociados.com, la información, datos, textos, imágenes, archivos de imagen y/o sonido y/o reportes, fotografías, videos, artículos, así como el diseño del Sitio Web y los diseños de sus módulos y servicios (en conjunto, la Información), son de propiedad de LAEQ & ASOCIADOS o están autorizados a ser usados por LAEQ & ASOCIADOS.

Por lo tanto, no podrán ser reproducidos (total o parcialmente), distribuidos, utilizados con fines comerciales, difundidos o extraídos a menos que se cuente con la autorización previa y expresa de LAEQ & ASOCIADOS. La utilización de la Información para otros fines distintos a los previstos en el Sitio Web, será exclusiva responsabilidad del Usuario.

LAEQ & ASOCIADOS se reserva todos los derechos respecto a la Información, principalmente pero sin limitarse a, los derechos de propiedad intelectual del Sitio Web y de toda la información y material que aparecen en el mismo.`
  },
  {
    id: 'modificaciones',
    title: 'Modificaciones del Sitio y los Términos',
    content: `LAEQ & ASOCIADOS se reserva el derecho de, en cualquier momento y sin aviso previo, modificar unilateralmente o realizar actualizaciones al diseño, contenido y/o extensión de la Información y de los Términos y Condiciones.

Se prohíbe el uso del Sitio Web y de la Información para otros fines distintos a los indicados en los Términos y Condiciones y, particularmente, para fines ilícitos. LAEQ & ASOCIADOS se reserva el derecho de bloquear, impedir o excluir del acceso al Sitio Web a aquellos Usuarios que no cumplieran con estos Términos y Condiciones.`
  },
  {
    id: 'responsabilidad-terceros',
    title: 'Responsabilidad frente a Terceros',
    content: `LAEQ & ASOCIADOS no será responsable por los daños, alteración de la Información o interferencias al sistema o a las redes, producto del accionar de terceros. LAEQ & ASOCIADOS no es responsable por el mal funcionamiento de las herramientas y servicios prestados a través del Sitio Web debido a cortes de energía o interrupciones de cualquier índole o cualquier otra falla que no fueran atribuibles al mismo.

Las conexiones a internet son exclusivo riesgo del Usuario. LAEQ & ASOCIADOS no verifica, chequea, controla, audita, ni respalda el contenido, ni la seguridad de las conexiones suministradas por estos medios.`
  },
  {
    id: 'limitacion',
    title: 'Limitación de Responsabilidad',
    content: `LAEQ & ASOCIADOS no se hace responsable por:

(i) Los daños y perjuicios de cualquier tipo que pudieran originarse a causa de falta de disponibilidad, mantenimiento y efectivo funcionamiento del Sitio Web y/o de sus servicios o contenidos.

(ii) La existencia de virus o de programas intrusivos o dañinos para los Usuarios.

(iii) El uso contrario a las presentes condiciones, a la buena fe, la ley y las costumbres, o malicioso, fraudulento, negligente o ilícito que los Usuarios hicieran del Sitio Web.

(iv) La falta de utilidad o adecuación del Sitio Web y/o de sus servicios o contenidos para satisfacer necesidades y expectativas de los Usuarios.

(v) La ilicitud, falta de fiabilidad, utilidad y disponibilidad de los servicios prestados por terceros y puestos a disposición de los Usuarios en el Sitio Web, o el cumplimiento por parte de dichos terceros de sus obligaciones.`
  },
  {
    id: 'derechos-reservados',
    title: 'Derechos Reservados y No Renuncia',
    content: `La falta de ejercicio por parte de LAEQ & ASOCIADOS de los derechos conferidos en estos Términos y Condiciones, no se entenderán ni implicarán en modo alguno una renuncia a los mismos, los cuales podrán ser ejercidos en todo momento.

Para cualquier consulta relacionada con estos Términos y Condiciones, puede comunicarse con nosotros a través de: gerencia@laeqasociados.com o en nuestra sede: Calle Raymundo Cárcamo 904, Of. 501, Urb. Santa Catalina, La Victoria, Lima – Perú.`
  },
];

const TerminosCondiciones = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  return (
    <div style={{ minHeight:'100dvh', background:T.bg, position:'relative' }}>

      {/* ── STICKY HEADER ── */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(250,252,255,0.95)', backdropFilter:'blur(20px) saturate(1.5)', borderBottom:`1px solid ${T.border}`, padding:'0 clamp(20px,5vw,80px)', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:12, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <img src={logoLaeq} alt="LAEQ" style={{ height:36, objectFit:'contain' }}/>
          <div>
            <span style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:12.5, color:T.text, display:'block', lineHeight:1.2 }}>LAEQ & Asociados</span>
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8, color:T.dim, textTransform:'uppercase', letterSpacing:'0.22em', display:'block' }}>Mercados Energéticos</span>
          </div>
        </button>
        <button onClick={() => navigate('/')}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', background:'transparent', border:`1px solid ${T.border}`, cursor:'pointer', fontFamily:'"DM Mono",monospace', fontSize:9, color:T.muted, textTransform:'uppercase', letterSpacing:'0.2em', transition:'all .25s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=T.cyan; e.currentTarget.style.color=T.brand; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver al inicio
        </button>
      </div>

      {/* ── HERO DARK ── */}
      <div style={{ background:`linear-gradient(160deg, ${T.bgDeep} 0%, #0A2640 100%)`, padding:'clamp(56px,8vh,96px) clamp(24px,5vw,80px)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.15, backgroundImage:`linear-gradient(rgba(30,184,240,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(30,184,240,0.15) 1px,transparent 1px)`, backgroundSize:'72px 72px' }}/>
        <div style={{ position:'absolute', left:'-5%', bottom:'-20%', width:'45vw', height:'60vh', pointerEvents:'none', background:`radial-gradient(ellipse, ${T.brand}30 0%, transparent 60%)` }}/>
        <div style={{ position:'relative', zIndex:1, maxWidth:'72rem' }}>
          <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, ease:SILK }}
            style={{ display:'inline-flex', alignItems:'center', gap:10, background:`${T.cyan}18`, border:`1px solid ${T.cyan}33`, padding:'6px 14px', marginBottom:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:T.cyan }}/>
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.32em' }}>Términos · Uso del Sitio Web</span>
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, ease:SILK, delay:0.1 }}
            style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(36px,5.5vw,72px)', color:'#E8F4FC', margin:'0 0 16px', lineHeight:1, letterSpacing:'-0.025em', paddingBottom:'0.06em' }}>
            Términos y Condiciones<br/>
            <em style={{ color:T.cyan, fontStyle:'italic', fontWeight:600 }}>Generales de Uso</em>
          </motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8, ease:SILK, delay:0.25 }}
            style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, color:'rgba(184,223,240,0.45)', textTransform:'uppercase', letterSpacing:'0.22em', margin:0 }}>
            Vigentes desde 2014 · www.laeqasociados.com · RUC 20563654431
          </motion.p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'clamp(40px,6vh,72px) clamp(24px,5vw,80px) clamp(64px,8vh,100px)', display:'grid', gridTemplateColumns:'280px 1fr', gap:48, alignItems:'start' }} className="terms-grid">

        {/* LEFT: ToC */}
        <div style={{ position:'sticky', top:88 }}>
          <p style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:T.dim, textTransform:'uppercase', letterSpacing:'0.3em', margin:'0 0 14px' }}>Cláusulas</p>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {TERMS.map((s, i) => {
              const isA = active === s.id;
              return (
                <a key={s.id} href={`#${s.id}`} onClick={() => setActive(s.id)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', textDecoration:'none', background: isA ? `${T.brand}10` : 'transparent', borderLeft:`2px solid ${isA ? T.cyan : T.border}`, transition:'all .25s' }}
                  onMouseEnter={e => { if (!isA) { e.currentTarget.style.background=`${T.brand}06`; e.currentTarget.style.borderLeftColor=T.dim; } }}
                  onMouseLeave={e => { if (!isA) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderLeftColor=T.border; } }}>
                  <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color: isA ? T.cyan : T.dim, minWidth:22, letterSpacing:'0.1em' }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ fontFamily:'"DM Sans",sans-serif', fontSize:12.5, color: isA ? T.brand : T.muted, fontWeight: isA ? 500 : 300, lineHeight:1.35 }}>{s.title}</span>
                </a>
              );
            })}
          </div>

          {/* Legal notice */}
          <div style={{ marginTop:24, padding:'16px', background:`rgba(30,184,240,0.05)`, border:`1px solid rgba(30,184,240,0.15)` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.cyan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:T.active, textTransform:'uppercase', letterSpacing:'0.2em' }}>Aviso</span>
            </div>
            <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:11.5, color:T.muted, margin:0, lineHeight:1.6 }}>
              Al acceder a este sitio web, acepta estos Términos y Condiciones en su totalidad.
            </p>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div>
          {TERMS.map((s, i) => (
            <motion.div key={s.id} id={s.id}
              initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-40px' }}
              transition={{ duration:0.7, ease:SILK }}
              style={{ paddingBottom:'clamp(28px,4vh,48px)', marginBottom:'clamp(28px,4vh,48px)', borderBottom: i < TERMS.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:18 }}>
                <span style={{ fontFamily:'"DM Mono",monospace', fontSize:11, color:T.cyan, fontWeight:500, letterSpacing:'0.1em', flexShrink:0, marginTop:3 }}>
                  {String(i+1).padStart(2,'0')}
                </span>
                <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(20px,2.5vw,28px)', color:T.text, margin:0, lineHeight:1.1, letterSpacing:'-0.015em', paddingBottom:'0.04em' }}>
                  {s.title}
                </h2>
              </div>
              {/* Body */}
              <div style={{ paddingLeft:32 }}>
                {s.content.split('\n\n').map((para, pi) => (
                  <p key={pi} style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:'clamp(13.5px,1.05vw,15.5px)', color:T.muted, lineHeight:1.85, margin:'0 0 14px', whiteSpace:'pre-line' }}>{para}</p>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Legal closing */}
          <div style={{ background:T.bgAlt, border:`1px solid ${T.border}`, padding:'24px 28px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:20, height:1, background:T.cyan }}/>
              <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.3em' }}>Contacto Legal</span>
            </div>
            <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:13.5, color:T.muted, lineHeight:1.8, margin:0 }}>
              Para consultas sobre estos Términos y Condiciones: <a href="mailto:gerencia@laeqasociados.com" style={{ color:T.brand, fontWeight:500, textDecoration:'none' }}>gerencia@laeqasociados.com</a> — Calle Raymundo Cárcamo 904, Of. 501, Urb. Santa Catalina, La Victoria, Lima – Perú.
            </p>
          </div>
        </div>
      </div>

      {/* ── FOOTER STRIP ── */}
      <div style={{ background:T.bgDeep, borderTop:'1px solid rgba(2,83,126,0.18)', padding:'24px clamp(24px,5vw,80px)', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:14 }}>
        <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:'rgba(56,190,248,0.35)', letterSpacing:'0.14em' }}>© {new Date().getFullYear()} Luis Espinoza Quiñones & Asociados S.A.C. · RUC 20563654431</span>
        <button onClick={() => navigate('/')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'"DM Mono",monospace', fontSize:9, color:'rgba(56,190,248,0.35)', textTransform:'uppercase', letterSpacing:'0.18em', transition:'color .25s' }}
          onMouseEnter={e => e.currentTarget.style.color='rgba(56,190,248,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(56,190,248,0.35)'}>
          ← Volver al inicio
        </button>
      </div>

      <style>{`
        .terms-grid{grid-template-columns:280px 1fr!important}
        @media(max-width:860px){.terms-grid{grid-template-columns:1fr!important} [style*="position:sticky"][style*="top:88px"]{position:static!important}}
      `}</style>
    </div>
  );
};

export default TerminosCondiciones;
