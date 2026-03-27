import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logoLaeq from '../assets/logo-laeq.jpg';
import libroImg from '../assets/Libro_De_Reclamaciones.png';

/* ═══ TOKENS ════════════════════════════════════ */
const T = {
  bg:    '#071E30',
  bgMid: '#0A2640',
  bgDeep:'#041220',
  brand: '#02537E',
  active:'#0A8FC7',
  cyan:  '#1EB8F0',
  white: '#E8F4FC',
  muted: 'rgba(184,223,240,0.44)',
  dim:   'rgba(184,223,240,0.2)',
};
const SILK = [0.16, 1, 0.3, 1];

const SERVICES_LIST = [
  'Regulación de Gas Natural','Contratos de Compra de Gas Natural',
  'Planificación y Política Energética','Contratos PPA de Electricidad',
  'Precios de Combustibles Líquidos','Capacitaciones In-House','Consulta General',
];

/* ═══ FIELD ══════════════════════════════════════ */
const Field = ({ label, required, children, span2 = false }) => (
  <div style={{ gridColumn: span2 ? '1 / -1' : 'auto' }}>
    <label style={{ display:'block', fontFamily:'"DM Mono",monospace', fontSize:9, color:T.active+'88', textTransform:'uppercase', letterSpacing:'0.26em', marginBottom:8 }}>
      {label}{required && <span style={{ color:T.cyan, marginLeft:3 }}>*</span>}
    </label>
    {children}
  </div>
);

const IS = (f) => ({
  width:'100%', padding:'12px 16px', background: f ? `${T.brand}18` : `${T.brand}0A`,
  border:`1px solid ${f ? T.cyan+'55' : T.brand+'33'}`,
  fontFamily:'"DM Sans",sans-serif', fontSize:13.5, color:T.white,
  outline:'none', boxSizing:'border-box', transition:'border-color .25s, background .25s',
});

/* ═══ CONTACT FORM ═══════════════════════════════ */
const ContactForm = () => {
  const [form, setForm] = useState({ nombre:'', email:'', empresa:'', tel:'', servicio:'', mensaje:'' });
  const [foc, setFoc]   = useState('');
  const [loading, setL] = useState(false);
  const [sent, setS]    = useState(false);
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const fo  = k => ({ onFocus:()=>setFoc(k), onBlur:()=>setFoc('') });

  const send = () => {
    if (!form.nombre || !form.email || !form.mensaje) return;
    setL(true);
    setTimeout(() => { setL(false); setS(true); }, 1500);
  };

  if (sent) return (
    <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400, gap:20, textAlign:'center', padding:'40px 20px' }}>
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.1, duration:0.6, ease:SILK }}
        style={{ width:80, height:80, background:`${T.cyan}18`, border:`1px solid ${T.cyan}44`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.cyan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
      </motion.div>
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
        <h4 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:28, color:T.white, margin:'0 0 12px', letterSpacing:'-0.02em' }}>Consulta recibida</h4>
        <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:14, color:T.muted, lineHeight:1.75, maxWidth:340, margin:'0 auto 24px' }}>
          Luis Espinoza y su equipo te contactarán a <strong style={{ color:T.white, fontWeight:500 }}>{form.email}</strong> dentro de las próximas <strong style={{ color:T.cyan, fontWeight:500 }}>24 horas hábiles</strong>.
        </p>
        <button onClick={() => setS(false)}
          style={{ padding:'10px 24px', background:'transparent', border:`1px solid ${T.brand}`, cursor:'pointer', fontFamily:'"DM Mono",monospace', fontSize:9.5, color:T.muted, textTransform:'uppercase', letterSpacing:'0.2em', transition:'all .28s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=T.cyan; e.currentTarget.style.color=T.cyan; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=T.brand; e.currentTarget.style.color=T.muted; }}>
          Nueva consulta
        </button>
      </motion.div>
    </motion.div>
  );

  return (
    <div style={{ padding:'clamp(28px,4vw,48px)' }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{ width:24, height:1, background:T.cyan }}/>
          <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.38em' }}>Consulta Estratégica</span>
        </div>
        <h3 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(22px,3vw,36px)', color:T.white, margin:'0 0 8px', lineHeight:1.05, letterSpacing:'-0.02em', paddingBottom:'0.04em' }}>
          Cuéntanos tu desafío<br/><em style={{ color:T.cyan, fontStyle:'italic' }}>energético</em>
        </h3>
        <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:12.5, color:T.dim, margin:0, lineHeight:1.7 }}>Respuesta garantizada en 24h · Consulta inicial sin costo</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Field label="Nombre completo" required>
          <input type="text" placeholder="Luis García" value={form.nombre} onChange={e=>set('nombre',e.target.value)} {...fo('nombre')} style={IS(foc==='nombre')}/>
        </Field>
        <Field label="Email corporativo" required>
          <input type="email" placeholder="su@empresa.com" value={form.email} onChange={e=>set('email',e.target.value)} {...fo('email')} style={IS(foc==='email')}/>
        </Field>
        <Field label="Empresa / Organización">
          <input type="text" placeholder="Nombre de su empresa" value={form.empresa} onChange={e=>set('empresa',e.target.value)} {...fo('empresa')} style={IS(foc==='empresa')}/>
        </Field>
        <Field label="Teléfono">
          <input type="tel" placeholder="+51 999 779 580" value={form.tel} onChange={e=>set('tel',e.target.value)} {...fo('tel')} style={IS(foc==='tel')}/>
        </Field>
        <Field label="Servicio de interés" span2>
          <div style={{ position:'relative' }}>
            <select value={form.servicio} onChange={e=>set('servicio',e.target.value)} {...fo('servicio')}
              style={{ ...IS(foc==='servicio'), appearance:'none', paddingRight:40, cursor:'pointer', color: form.servicio ? T.white : T.dim+'BB' }}>
              <option value="" style={{ background:'#071E30' }}>Selecciona un servicio…</option>
              {SERVICES_LIST.map(s=><option key={s} value={s} style={{ background:'#071E30', color:T.white }}>{s}</option>)}
            </select>
            <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:T.muted }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
            </div>
          </div>
        </Field>
        <Field label="Mensaje / Consulta" required span2>
          <textarea rows={4} placeholder="Describa su consulta, proyecto o necesidad específica…" value={form.mensaje} onChange={e=>set('mensaje',e.target.value)} {...fo('mensaje')}
            style={{ ...IS(foc==='mensaje'), resize:'vertical', lineHeight:1.7, minHeight:120 }}/>
        </Field>
      </div>
      <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:`${T.brand}55`, flexShrink:0, marginTop:5 }}/>
          <p style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:T.dim, margin:0, lineHeight:1.55, letterSpacing:'0.08em' }}>
            Datos tratados bajo Ley N.° 29733 – Ley de Protección de Datos Personales del Perú.
          </p>
        </div>
        <motion.button onClick={send} whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} disabled={loading}
          style={{ padding:'15px 32px', background: loading ? `${T.cyan}66` : T.cyan, border:'none', cursor: loading ? 'wait' : 'pointer', fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:11, color:T.bg, textTransform:'uppercase', letterSpacing:'0.22em', display:'flex', alignItems:'center', justifyContent:'center', gap:12, transition:'background .28s' }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background=T.white; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background=T.cyan; }}>
          {loading ? (<><motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.85, ease:'linear' }}
            style={{ width:14, height:14, border:`2px solid ${T.bg}44`, borderTopColor:T.bg, borderRadius:'50%' }}/>Enviando…</>) : (<>Enviar Consulta Estratégica <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>)}
        </motion.button>
      </div>
    </div>
  );
};

/* ═══ INFO ITEMS ═════════════════════════════════ */
const INFO = [
  { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label:'Dirección', lines:['Calle Raymundo Cárcamo 904, Of. 501','Urb. Santa Catalina, La Victoria, Lima'], link:'https://maps.google.com/?q=Calle+Raymundo+Carcamo+904,La+Victoria,Lima' },
  { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.37h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label:'Teléfonos', lines:['01-2775502','+51 999 779 580'], link:'tel:+5112775502' },
  { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label:'Email Corporativo', lines:['gerencia@laeqasociados.com'], link:'mailto:gerencia@laeqasociados.com' },
  { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>, label:'Horario', lines:['Lunes a Viernes: 9:00 – 18:00','Sábados: 9:00 – 13:00'], link:null },
];

/* ═══ CONTACT SECTION ════════════════════════════ */
const ContactSection = () => {
  const ref   = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-60px' });
  const navigate = useNavigate();

  return (
    <section ref={ref} id="contacto" style={{ background:T.bg, paddingTop:'clamp(80px,10vh,120px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, opacity:0.35, backgroundImage:`linear-gradient(${T.brand}08 1px,transparent 1px),linear-gradient(90deg,${T.brand}08 1px,transparent 1px)`, backgroundSize:'72px 72px' }}/>
      <div style={{ position:'absolute', left:'-8%', top:'20%', width:'45vw', height:'60vh', pointerEvents:'none', zIndex:0, background:`radial-gradient(ellipse, ${T.brand}18 0%, transparent 60%)` }}/>
      <div style={{ position:'relative', zIndex:1, padding:'0 clamp(24px,5vw,80px) clamp(80px,10vh,120px)' }}>
        {/* Header */}
        <div style={{ marginBottom:'clamp(44px,6vh,72px)' }}>
          <motion.div initial={{ opacity:0, x:-16 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.7, ease:SILK }}
            style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
            <div style={{ width:28, height:1, background:T.cyan }}/><span style={{ fontFamily:'"DM Mono",monospace', fontSize:10, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.42em' }}>Contacto · Lima, Perú</span>
          </motion.div>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:20 }}>
            <motion.h2 initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.9, ease:SILK, delay:0.1 }}
              style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(42px,6.5vw,88px)', color:T.white, margin:0, lineHeight:1, letterSpacing:'-0.025em', paddingBottom:'0.08em' }}>
              Hablemos de <em style={{ color:T.cyan, fontStyle:'italic', fontWeight:600 }}>Energía</em>
            </motion.h2>
            <motion.p initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ duration:0.8, ease:SILK, delay:0.22 }}
              style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:13, color:T.muted, lineHeight:1.75, maxWidth:290, margin:0 }}>
              Estamos listos para transformar sus desafíos energéticos en oportunidades de crecimiento.
            </motion.p>
          </div>
        </div>
        <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}} transition={{ duration:1.1, ease:SILK }}
          style={{ height:1, background:`linear-gradient(90deg, ${T.active}66 0%, ${T.active}18 60%, transparent 100%)`, transformOrigin:'left', marginBottom:'clamp(36px,5vh,56px)' }}/>
        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:24, alignItems:'start' }} className="contact-grid">
          {/* Left */}
          <motion.div initial={{ opacity:0, x:-24 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.8, ease:SILK, delay:0.15 }}
            style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Info card */}
            <div style={{ background:`linear-gradient(145deg, ${T.bgMid} 0%, ${T.bg} 100%)`, border:`1px solid ${T.brand}25`, padding:'clamp(22px,3vw,36px)', position:'relative', overflow:'hidden' }}>
              <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}} transition={{ duration:0.7, ease:SILK }}
                style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${T.cyan} 0%, ${T.brand}44 60%, transparent 100%)`, transformOrigin:'left' }}/>
              <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'60%', height:'60%', pointerEvents:'none', background:`radial-gradient(ellipse, ${T.brand}20 0%, transparent 65%)` }}/>
              <h4 style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:12, color:T.white, margin:'0 0 22px', textTransform:'uppercase', letterSpacing:'0.22em', position:'relative', zIndex:1 }}>Información de Contacto</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:18, position:'relative', zIndex:1 }}>
                {INFO.map(item => (
                  <div key={item.label}>
                    {item.link ? (
                      <a href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                        style={{ display:'flex', alignItems:'flex-start', gap:14, textDecoration:'none', cursor:'pointer' }}
                        onMouseEnter={e => e.currentTarget.querySelector('.il').style.color=T.cyan}
                        onMouseLeave={e => e.currentTarget.querySelector('.il').style.color=T.white}>
                        <div style={{ width:34, height:34, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:`${T.brand}22`, border:`1px solid ${T.brand}33`, color:T.cyan }}>{item.icon}</div>
                        <div><p className="il" style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:11.5, color:T.white, margin:'0 0 3px', transition:'color .25s' }}>{item.label}</p>{item.lines.map(l=><p key={l} style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:12, color:T.muted, margin:0, lineHeight:1.55 }}>{l}</p>)}</div>
                      </a>
                    ) : (
                      <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                        <div style={{ width:34, height:34, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:`${T.brand}22`, border:`1px solid ${T.brand}33`, color:T.cyan }}>{item.icon}</div>
                        <div><p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:11.5, color:T.white, margin:'0 0 3px' }}>{item.label}</p>{item.lines.map(l=><p key={l} style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:12, color:T.muted, margin:0, lineHeight:1.55 }}>{l}</p>)}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ height:1, background:`${T.brand}22`, margin:'22px 0' }}/>
              <div style={{ position:'relative', zIndex:1 }}>
                <p style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:`${T.active}55`, textTransform:'uppercase', letterSpacing:'0.18em', margin:'0 0 2px' }}>RUC: 20563654431</p>
                <p style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.active}44`, textTransform:'uppercase', letterSpacing:'0.12em', margin:0 }}>Luis Espinoza Quiñones & Asociados S.A.C.</p>
              </div>
            </div>
            {/* Libro CTA */}
            <motion.div onClick={() => navigate('/libro-de-reclamaciones')} whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} data-c="reclamaciones"
              style={{ background:`linear-gradient(145deg, ${T.bgMid} 0%, ${T.bgDeep} 100%)`, border:`1px solid ${T.brand}30`, padding:'clamp(18px,2.5vw,28px)', cursor:'pointer', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', gap:20, transition:'border-color .3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor=T.cyan+'44'}
              onMouseLeave={e => e.currentTarget.style.borderColor=T.brand+'30'}>
              <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 30% 50%, ${T.brand}15 0%, transparent 65%)`, pointerEvents:'none' }}/>
              <img src={libroImg} alt="Libro de Reclamaciones" style={{ width:52, height:52, objectFit:'contain', flexShrink:0, filter:'invert(1) brightness(0.7) sepia(1) hue-rotate(170deg) saturate(2)', opacity:0.75, position:'relative', zIndex:1 }}/>
              <div style={{ position:'relative', zIndex:1, flex:1 }}>
                <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:12.5, color:T.white, margin:'0 0 4px' }}>Libro de Reclamaciones</p>
                <p style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.active}66`, margin:0, textTransform:'uppercase', letterSpacing:'0.16em' }}>Código del Consumidor · Ley 29571</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.active} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, position:'relative', zIndex:1 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </motion.div>
          </motion.div>
          {/* Right form */}
          <motion.div initial={{ opacity:0, x:24 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.8, ease:SILK, delay:0.2 }}
            style={{ background:`linear-gradient(145deg, ${T.bgMid} 0%, ${T.bg} 100%)`, border:`1px solid ${T.brand}25`, position:'relative', overflow:'hidden' }}>
            <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}} transition={{ duration:0.7, ease:SILK }}
              style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${T.cyan} 0%, ${T.brand}44 60%, transparent 100%)`, transformOrigin:'left' }}/>
            <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'50%', height:'50%', pointerEvents:'none', background:`radial-gradient(ellipse, ${T.brand}18 0%, transparent 65%)` }}/>
            <ContactForm/>
          </motion.div>
        </div>
      </div>
      <style>{`.contact-grid{grid-template-columns:1fr 1.6fr!important} @media(max-width:860px){.contact-grid{grid-template-columns:1fr!important}} input::placeholder,textarea::placeholder,select::placeholder{color:rgba(184,223,240,0.28)!important}`}</style>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   FOOTER — AWWWARDS LEVEL
   Structure: Editorial CTA strip → Grid → Lower bar
════════════════════════════════════════════════ */
const SOCIALS = [
  { label:'LI', title:'LinkedIn', url:'https://www.linkedin.com/company/luis-espinoza-&-asociados', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
  { label:'MA', title:'Email', url:'mailto:gerencia@laeqasociados.com', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
  { label:'TL', title:'Teléfono', url:'tel:+5112775502', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.37h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
];

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const ref  = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-40px' });

  const go = (path) => {
    const routes = {
      'Política de Privacidad': '/politica-de-privacidad',
      'Términos de Servicio':   '/terminos-y-condiciones',
      'Libro de Reclamaciones': '/libro-de-reclamaciones',
    };
    if (routes[path]) navigate(routes[path]);
  };

  const LINKS = {
    'Servicios': ['Gas Natural','Contratos PPA','Política Energética','Combustibles','Capacitaciones'],
    'Empresa':   ['Nosotros','Proyectos','Clientes','Contacto'],
    'Legal':     ['Política de Privacidad','Términos de Servicio','Libro de Reclamaciones'],
  };

  return (
    <footer ref={ref} style={{ background:T.bgDeep, borderTop:`1px solid ${T.brand}16`, position:'relative', overflow:'hidden' }}>

      {/* Grid texture */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.2, backgroundImage:`linear-gradient(${T.brand}08 1px,transparent 1px),linear-gradient(90deg,${T.brand}08 1px,transparent 1px)`, backgroundSize:'72px 72px' }}/>
      {/* Left glow */}
      <div style={{ position:'absolute', left:'-5%', bottom:'10%', width:'35vw', height:'50vh', pointerEvents:'none', background:`radial-gradient(ellipse, ${T.brand}18 0%, transparent 60%)` }}/>

      <div style={{ position:'relative', zIndex:1, maxWidth:'120rem', margin:'0 auto' }}>

        {/* ══ A: EDITORIAL CTA STRIP ══ */}
        <div style={{ padding:'clamp(52px,7vh,96px) clamp(24px,5vw,80px)', borderBottom:`1px solid ${T.brand}14`, display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'center' }} className="footer-cta-grid">
          <div>
            <motion.div initial={{ opacity:0, x:-16 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.7, ease:SILK }}
              style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
              <div style={{ width:24, height:1, background:T.cyan }}/>
              <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.38em' }}>Lima, Perú · Est. 2014</span>
            </motion.div>
            <motion.div initial={{ opacity:0, y:24 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:1, ease:SILK, delay:0.1 }}>
              <div style={{ overflow:'hidden' }}>
                <motion.p initial={{ y:'105%' }} animate={inView ? { y:0 } : {}} transition={{ duration:1.1, ease:SILK, delay:0.15 }}
                  style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(36px,5.5vw,72px)', color:T.white, margin:0, lineHeight:0.92, letterSpacing:'-0.03em', paddingBottom:'0.08em' }}>
                  Energía que mueve al
                </motion.p>
              </div>
              <div style={{ overflow:'hidden' }}>
                <motion.p initial={{ y:'105%' }} animate={inView ? { y:0 } : {}} transition={{ duration:1.1, ease:SILK, delay:0.28 }}
                  style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontStyle:'italic', fontSize:'clamp(36px,5.5vw,72px)', color:T.cyan, margin:0, lineHeight:0.92, letterSpacing:'-0.03em', paddingBottom:'0.1em' }}>
                  Perú.
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* CTA block */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={inView ? { opacity:1, scale:1 } : {}} transition={{ duration:0.8, ease:SILK, delay:0.3 }}
            style={{ display:'flex', flexDirection:'column', gap:14, alignItems:'flex-end' }}>
            <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior:'smooth' })}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 28px', background:T.cyan, border:'none', cursor:'pointer', fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:10.5, color:T.bgDeep, textTransform:'uppercase', letterSpacing:'0.22em', transition:'background .28s, transform .2s', whiteSpace:'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.background=T.white; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background=T.cyan; e.currentTarget.style.transform='translateY(0)'; }}>
              Iniciar Consulta
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <div style={{ display:'flex', gap:8 }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.url} title={s.title} target={s.url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                  style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:`${T.brand}15`, border:`1px solid ${T.brand}28`, color:T.muted, textDecoration:'none', transition:'all .25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=T.cyan+'55'; e.currentTarget.style.color=T.cyan; e.currentTarget.style.background=`${T.brand}28`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=`${T.brand}28`; e.currentTarget.style.color=T.muted; e.currentTarget.style.background=`${T.brand}15`; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ══ B: LINK GRID ══ */}
        <div style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr 1fr 1fr', gap:'clamp(24px,4vw,52px)', padding:'clamp(44px,6vh,72px) clamp(24px,5vw,80px) clamp(36px,5vh,56px)' }} className="footer-link-grid">

          {/* Brand */}
          <motion.div initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.8, ease:SILK, delay:0.15 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
              <img src={logoLaeq} alt="LAEQ" style={{ height:42, width:'auto', objectFit:'contain', filter:`drop-shadow(0 0 10px ${T.cyan}44)` }}/>
              <div>
                <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:13, color:T.white, margin:0, lineHeight:1.2 }}>LAEQ & Asociados</p>
                <p style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.active}55`, margin:0, textTransform:'uppercase', letterSpacing:'0.22em' }}>Mercados Energéticos</p>
              </div>
            </div>
            <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:12.5, color:T.dim, lineHeight:1.75, maxWidth:270, margin:'0 0 20px' }}>
              Consultoría energética estratégica de élite. Transformamos desafíos regulatorios en ventajas competitivas para el sector energético peruano desde 2014.
            </p>
            {/* Award-style location tag */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, border:`1px solid ${T.brand}28`, padding:'6px 12px' }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:T.cyan, boxShadow:`0 0 6px ${T.cyan}88`, animation:'pulse 2.2s ease-in-out infinite' }}/>
              <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.active}55`, textTransform:'uppercase', letterSpacing:'0.2em' }}>Lima, Perú</span>
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links], ci) => (
            <motion.div key={title} initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.8, ease:SILK, delay:0.2 + ci * 0.07 }}>
              <p style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.32em', margin:'0 0 18px' }}>{title}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
                {links.map(l => (
                  <span key={l} onClick={() => go(l)}
                    style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:13, color:T.dim, cursor:'pointer', transition:'color .25s, paddingLeft .25s', width:'fit-content', lineHeight:1.3, paddingLeft:0 }}
                    onMouseEnter={e => { e.currentTarget.style.color=T.white; e.currentTarget.style.paddingLeft='6px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color=T.dim; e.currentTarget.style.paddingLeft='0'; }}>
                    {l}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ══ C: LOWER BAR ══ */}
        <div style={{ padding:'clamp(16px,2.5vh,22px) clamp(24px,5vw,80px)', borderTop:`1px solid ${T.brand}12`, display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:14 }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 12px', alignItems:'center' }}>
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:`${T.active}44`, letterSpacing:'0.14em' }}>© {year}</span>
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:`${T.active}55`, letterSpacing:'0.12em' }}>Luis Espinoza Quiñones & Asociados S.A.C.</span>
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:`${T.brand}44`, letterSpacing:'0.1em' }}>· RUC 20563654431 · Lima, Perú</span>
          </div>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            {[
              { label:'Privacidad', path:'/politica-de-privacidad' },
              { label:'Términos',   path:'/terminos-y-condiciones' },
              { label:'Reclamaciones', path:'/libro-de-reclamaciones' },
            ].map(item => (
              <span key={item.label} onClick={() => navigate(item.path)}
                style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.brand}55`, textTransform:'uppercase', letterSpacing:'0.16em', cursor:'pointer', transition:'color .25s' }}
                onMouseEnter={e => e.currentTarget.style.color=T.muted}
                onMouseLeave={e => e.currentTarget.style.color=`${T.brand}55`}>
                {item.label}
              </span>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.75);}}
        .footer-cta-grid{grid-template-columns:1fr auto!important}
        .footer-link-grid{grid-template-columns:1.8fr 1fr 1fr 1fr!important}
        @media(max-width:860px){
          .footer-cta-grid{grid-template-columns:1fr!important}
          .footer-link-grid{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:540px){.footer-link-grid{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  );
};

const Contact = () => (<><ContactSection/><Footer/></>);
export default Contact;