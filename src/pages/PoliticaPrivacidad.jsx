import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logoLaeq from '../assets/logo-laeq.jpg';

/*
  Política de Privacidad — LAEQ & Asociados S.A.C.
  Fondo blanco premium con estética de marca azul/cyan.
  Ruta: /politica-de-privacidad
*/

/* ═══ TOKENS (modo claro con marca) ═════════════ */
const T = {
  bg:     '#FAFCFF',      /* blanco azulado muy sutil */
  bgAlt:  '#F0F6FF',      /* superficie secundaria */
  bgDeep: '#071E30',      /* navy para header/footer */
  brand:  '#02537E',      /* azul marca */
  active: '#0A8FC7',      /* azul activo */
  cyan:   '#1EB8F0',      /* cyan acento */
  text:   '#0A1F3C',      /* texto principal */
  muted:  '#4A6B8A',      /* texto secundario */
  dim:    '#8AAEC8',      /* texto terciario */
  border: 'rgba(2,83,126,0.12)',
};
const SILK = [0.16, 1, 0.3, 1];

const SECTIONS = [
  {
    id: 'intro',
    title: 'Alcance y Compromiso',
    content: `La presente Política de Privacidad establece los términos en que LAEQ & Asociados (Luis Espinoza Quiñones & Asociados – Desarrolladores de Mercados Energéticos S.A.C.), con RUC 20563654431 y domicilio legal en Calle Raymundo Cárcamo Nro. 904, Dpto. 501, Urbanización Santa Catalina, La Victoria, Lima, protege la información proporcionada por sus usuarios y visitantes al utilizar el sitio web www.laeqasociados.com.

En estricta observancia del derecho fundamental a la autodeterminación informativa consagrado en el inciso 6 del artículo 2 de la Constitución Política del Perú, así como en cumplimiento de la Ley N° 29733 (Ley de Protección de Datos Personales) y su Reglamento aprobado por D.S. N° 003-2013-JUS, LAEQ & Asociados garantiza que el tratamiento de sus datos personales se realizará de forma lícita, leal y transparente.`
  },
  {
    id: 'recopilacion',
    title: 'Información que Recopilamos',
    content: `Nuestro sitio web, a través de sus diversos formularios (como la "Consulta Premium" y el Libro de Reclamaciones Virtual), podrá recoger información personal que incluye, pero no se limita a:

• Nombres y apellidos completos
• Empresa u organización a la que pertenece
• Correo electrónico corporativo
• Número de teléfono de contacto
• Información relacionada con el servicio de consultoría solicitado

Toda información proporcionada deberá ser verdadera, completa y exacta. Cada usuario es responsable por la veracidad, exactitud, vigencia y autenticidad de la información suministrada.`
  },
  {
    id: 'finalidad',
    title: 'Finalidad y Uso de la Información',
    content: `LAEQ & Asociados emplea la información con el fin de proporcionar una asesoría y consultoría energética del más alto nivel. Los datos proporcionados serán tratados para:

• Atender y procesar solicitudes de servicios, consultas regulatorias o técnicas ingresadas a través del sitio web.
• La ejecución de la relación contractual, comercial y de consultoría.
• El cumplimiento de obligaciones legales y administrativas vinculadas a los servicios prestados.
• Envío de boletines, actualizaciones normativas del sector hidrocarburos y eléctrico, siempre que el usuario haya brindado su consentimiento para fines de prospección comercial.`
  },
  {
    id: 'almacenamiento',
    title: 'Almacenamiento de Datos',
    content: `Los datos captados a través del sitio web serán almacenados en el Banco de Datos de "Usuarios de la Página Web" de titularidad de LAEQ & Asociados. Se mantendrán almacenados mientras resulten necesarios para cumplir con las finalidades para los cuales fueron recopilados, durante el tiempo que se mantenga una relación contractual o comercial, y, con posterioridad a ello, por el plazo establecido por la normativa aplicable.`
  },
  {
    id: 'transferencia',
    title: 'Transferencia de Datos y Flujo Transfronterizo',
    content: `Para fines del tratamiento de sus datos personales, LAEQ & Asociados podrá utilizar servidores en la nube (proveedores de hosting) que podrían implicar un flujo transfronterizo de datos. Asimismo, LAEQ & Asociados podrá facilitar la información a entidades de la Administración Pública (como OSINERGMIN, MINEM) y autoridades competentes en caso de requerimientos en el ejercicio regular de sus funciones o para el desarrollo de un procedimiento administrativo o judicial, conforme a ley.`
  },
  {
    id: 'cookies',
    title: 'Uso de Cookies',
    content: `Una cookie es un fichero que se envía con la finalidad de solicitar permiso para almacenarse en su ordenador. Al aceptar, la cookie sirve para recopilar información respecto al tráfico web y facilitar futuras visitas.

Nuestro sitio web emplea cookies necesarias para su operatividad básica, así como cookies analíticas de terceros (Google Analytics) para analizar el tráfico y mejorar la experiencia de usuario.

El usuario tiene la opción de deshabilitar y eliminar las cookies configurando su navegador. Si se bloquean, es posible que la experiencia de navegación se vea limitada.`
  },
  {
    id: 'derechos',
    title: 'Derechos ARCO — Control de su Información',
    content: `El titular de datos personales podrá revocar la autorización para el tratamiento de sus datos en cualquier momento. Conforme al marco legal vigente, tiene reconocidos y podrá ejercitar los derechos de Acceso, Rectificación, Cancelación y Oposición (Derechos ARCO).

Para ejercer estos derechos, el titular podrá:

• Enviar una comunicación expresa al correo: gerencia@laeqasociados.com
• Dirigir una comunicación escrita a: Calle Raymundo Cárcamo 904, Of. 501, Urb. Santa Catalina, La Victoria, Lima – Perú

De considerar que su solicitud no ha sido atendida adecuadamente, el usuario puede iniciar un Procedimiento Trilateral de Tutela ante la Autoridad Nacional de Protección de Datos Personales (ANPD) del Ministerio de Justicia y Derechos Humanos.`
  },
  {
    id: 'seguridad',
    title: 'Seguridad de la Información',
    content: `LAEQ & Asociados está altamente comprometida en mantener su información segura. Hemos adoptado todas las medidas técnicas, organizativas y legales necesarias para garantizar la seguridad y confidencialidad de su información personal, evitando su alteración, pérdida, tratamiento o acceso no autorizado por parte de terceros.`
  },
  {
    id: 'modificaciones',
    title: 'Modificaciones de la Política',
    content: `LAEQ & Asociados se reserva el derecho de modificar la presente Política de Privacidad para adaptarla a novedades legislativas, jurisprudenciales o directivas de la Autoridad Nacional de Protección de Datos Personales. Lo invitamos a verificar estos términos regularmente en www.laeqasociados.com.`
  },
];

const LegalPage = ({ title, badge, sections, updatedDate }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  return (
    <div style={{ minHeight:'100dvh', background:T.bg, position:'relative' }}>

      {/* ── STICKY HEADER ── */}
      <div style={{
        position:'sticky', top:0, zIndex:50,
        background:'rgba(250,252,255,0.95)', backdropFilter:'blur(20px) saturate(1.5)',
        borderBottom:`1px solid ${T.border}`,
        padding:'0 clamp(20px,5vw,80px)', height:64,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:12, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <img src={logoLaeq} alt="LAEQ" style={{ height:36, objectFit:'contain' }}/>
          <div style={{ display:'flex', flexDirection:'column' }}>
            <span style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:12.5, color:T.text, lineHeight:1.2 }}>LAEQ & Asociados</span>
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8, color:T.dim, textTransform:'uppercase', letterSpacing:'0.22em' }}>Mercados Energéticos</span>
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

      {/* ── HERO ── */}
      <div style={{
        background: `linear-gradient(160deg, ${T.bgDeep} 0%, #0A2640 100%)`,
        padding:'clamp(56px,8vh,96px) clamp(24px,5vw,80px)',
        position:'relative', overflow:'hidden',
      }}>
        {/* Grid texture on dark hero */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.15, backgroundImage:`linear-gradient(rgba(30,184,240,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(30,184,240,0.15) 1px,transparent 1px)`, backgroundSize:'72px 72px' }}/>
        <div style={{ position:'absolute', right:'-5%', top:'-10%', width:'45vw', height:'60vh', pointerEvents:'none', background:`radial-gradient(ellipse, ${T.brand}30 0%, transparent 60%)` }}/>

        <div style={{ position:'relative', zIndex:1, maxWidth:'72rem' }}>
          <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, ease:SILK }}
            style={{ display:'inline-flex', alignItems:'center', gap:10, background:`${T.cyan}18`, border:`1px solid ${T.cyan}33`, padding:'6px 14px', marginBottom:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:T.cyan }}/>
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.32em' }}>{badge}</span>
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, ease:SILK, delay:0.1 }}
            style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(36px,5.5vw,72px)', color:'#E8F4FC', margin:'0 0 16px', lineHeight:1, letterSpacing:'-0.025em', paddingBottom:'0.06em' }}>
            {title}
          </motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8, ease:SILK, delay:0.25 }}
            style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, color:'rgba(184,223,240,0.45)', textTransform:'uppercase', letterSpacing:'0.22em', margin:0 }}>
            Última actualización: {updatedDate} · RUC 20563654431
          </motion.p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'clamp(40px,6vh,72px) clamp(24px,5vw,80px) clamp(64px,8vh,100px)', display:'grid', gridTemplateColumns:'280px 1fr', gap:48, alignItems:'start' }} className="legal-grid">

        {/* LEFT: Table of contents */}
        <div style={{ position:'sticky', top:88 }}>
          <p style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:T.dim, textTransform:'uppercase', letterSpacing:'0.3em', margin:'0 0 14px' }}>Contenido</p>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {sections.map((s, i) => {
              const isA = active === s.id;
              return (
                <a key={s.id} href={`#${s.id}`}
                  onClick={() => setActive(s.id)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', textDecoration:'none', background: isA ? `${T.brand}10` : 'transparent', borderLeft:`2px solid ${isA ? T.cyan : T.border}`, transition:'all .25s' }}
                  onMouseEnter={e => { if (!isA) { e.currentTarget.style.background=`${T.brand}06`; e.currentTarget.style.borderLeftColor=T.dim; } }}
                  onMouseLeave={e => { if (!isA) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderLeftColor=T.border; } }}>
                  <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color: isA ? T.cyan : T.dim, minWidth:22, letterSpacing:'0.1em' }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ fontFamily:'"DM Sans",sans-serif', fontSize:12.5, color: isA ? T.brand : T.muted, fontWeight: isA ? 500 : 300, lineHeight:1.35 }}>{s.title}</span>
                </a>
              );
            })}
          </div>

          {/* Contact block */}
          <div style={{ marginTop:28, padding:'16px', background:`${T.brand}06`, border:`1px solid ${T.border}` }}>
            <p style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:T.dim, textTransform:'uppercase', letterSpacing:'0.2em', margin:'0 0 8px' }}>Consultas legales</p>
            <a href="mailto:gerencia@laeqasociados.com"
              style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:500, fontSize:12, color:T.brand, textDecoration:'none', display:'block', lineHeight:1.4, transition:'color .25s' }}
              onMouseEnter={e => e.currentTarget.style.color=T.active}
              onMouseLeave={e => e.currentTarget.style.color=T.brand}>
              gerencia@laeqasociados.com
            </a>
          </div>
        </div>

        {/* RIGHT: sections */}
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {sections.map((s, i) => (
            <motion.div key={s.id} id={s.id}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-40px' }}
              transition={{ duration:0.7, ease:SILK }}
              style={{ paddingBottom:'clamp(32px,5vh,52px)', marginBottom:'clamp(32px,5vh,52px)', borderBottom: i < sections.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              {/* Number + Title */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:20 }}>
                <span style={{ fontFamily:'"DM Mono",monospace', fontSize:11, color:T.cyan, fontWeight:500, letterSpacing:'0.1em', flexShrink:0, marginTop:3 }}>{String(i+1).padStart(2,'0')}</span>
                <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(20px,2.5vw,28px)', color:T.text, margin:0, lineHeight:1.1, letterSpacing:'-0.015em', paddingBottom:'0.04em' }}>{s.title}</h2>
              </div>
              {/* Content */}
              <div style={{ paddingLeft:32 }}>
                {s.content.split('\n\n').map((para, pi) => (
                  <p key={pi} style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:'clamp(13.5px,1.05vw,15.5px)', color:T.muted, lineHeight:1.85, margin:'0 0 14px', whiteSpace:'pre-line' }}>{para}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FOOTER STRIP ── */}
      <div style={{ background:T.bgDeep, borderTop:`1px solid rgba(2,83,126,0.18)`, padding:'24px clamp(24px,5vw,80px)', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:14 }}>
        <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:'rgba(56,190,248,0.35)', letterSpacing:'0.14em' }}>© {new Date().getFullYear()} Luis Espinoza Quiñones & Asociados S.A.C. · RUC 20563654431</span>
        <button onClick={() => navigate('/')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'"DM Mono",monospace', fontSize:9, color:'rgba(56,190,248,0.35)', textTransform:'uppercase', letterSpacing:'0.18em', transition:'color .25s' }}
          onMouseEnter={e => e.currentTarget.style.color='rgba(56,190,248,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(56,190,248,0.35)'}>
          ← Volver al inicio
        </button>
      </div>

      <style>{`
        .legal-grid{grid-template-columns:280px 1fr!important}
        @media(max-width:860px){.legal-grid{grid-template-columns:1fr!important} [style*="position:sticky"][style*="top:88px"]{position:static!important}}
      `}</style>
    </div>
  );
};

const PoliticaPrivacidad = () => (
  <LegalPage
    title="Política de Privacidad y Protección de Datos"
    badge="Privacidad · Ley N.° 29733"
    sections={SECTIONS}
    updatedDate="Marzo 2025"
  />
);

export default PoliticaPrivacidad;
