import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logoLaeq from '../assets/logo-laeq.jpg';
import libroImg from '../assets/Libro_De_Reclamaciones.png';

/*
  ─── FONTS ──────────────────────────────────────────────────────────
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

  ─── ROUTE ──────────────────────────────────────────────────────────
  In your App.jsx / router:
    import LibroReclamaciones from './pages/LibroReclamaciones';
    <Route path="/libro-de-reclamaciones" element={<LibroReclamaciones/>}/>

  ─── LEGAL BASIS ────────────────────────────────────────────────────
  Ley 29571 — Código de Protección y Defensa del Consumidor (Perú)
  DS 011-2011-PCM — Libro de Reclamaciones obligatorio
  Plazo respuesta: 30 días calendario
  Conservar registros: mínimo 2 años
*/

/* ═══ TOKENS ════════════════════════════════════ */
const T = {
  bg:    '#071E30',
  bgMid: '#0A2640',
  bgDeep:'#051525',
  brand: '#02537E',
  active:'#0A8FC7',
  cyan:  '#1EB8F0',
  white: '#E8F4FC',
  muted: 'rgba(184,223,240,0.44)',
  dim:   'rgba(184,223,240,0.2)',
};
const SILK = [0.16, 1, 0.3, 1];

/* ═══ FIELD WRAPPER ═════════════════════════════ */
const Field = ({ label, required, note, children, span2 = false }) => (
  <div style={{ gridColumn: span2 ? '1 / -1' : 'auto' }}>
    <label style={{ display:'block', fontFamily:'"DM Mono",monospace', fontSize:8.5, color:T.active+'88', textTransform:'uppercase', letterSpacing:'0.26em', marginBottom:7 }}>
      {label}{required && <span style={{ color:T.cyan, marginLeft:3 }}>*</span>}
    </label>
    {children}
    {note && <p style={{ fontFamily:'"DM Mono",monospace', fontSize:7.5, color:T.dim, margin:'5px 0 0', letterSpacing:'0.1em' }}>{note}</p>}
  </div>
);

const iBase = (focused, error) => ({
  width:'100%', padding:'11px 14px', boxSizing:'border-box',
  background: focused ? `${T.brand}18` : `${T.brand}0A`,
  border: `1px solid ${error ? '#E85D5D66' : focused ? T.cyan+'55' : T.brand+'33'}`,
  fontFamily:'"DM Sans",sans-serif', fontSize:13, color:T.white,
  outline:'none', transition:'border-color .25s, background .25s',
});

/* ═══ CONFIRMATION NUMBER ═══════════════════════ */
const genCode = () => {
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  return `LAEQ-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${Math.random().toString(36).substr(2,5).toUpperCase()}`;
};

/* ═══ LIBRO DE RECLAMACIONES PAGE ═══════════════ */
const LibroReclamaciones = () => {
  const navigate = useNavigate();

  /* form state */
  const [form, setForm] = useState({
    tipo: '',             /* Queja | Reclamo */
    nombre: '',
    apellido: '',
    tipoDoc: 'DNI',
    numDoc: '',
    email: '',
    tel: '',
    direccion: '',
    tipoCliente: 'persona', /* persona | empresa */
    empresa: '',
    rucEmpresa: '',
    /* Bien contratado */
    tipoBien: '',         /* Producto | Servicio */
    descripcionBien: '',
    monto: '',
    fecha: '',
    /* Detalle */
    descripcion: '',
    pedido: '',           /* Lo que solicita */
  });
  const [focused, setFocused] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const fo = k => ({ onFocus:() => setFocused(k), onBlur:() => setFocused('') });

  const validate = () => {
    const e = {};
    if (!form.tipo)        e.tipo        = 'Selecciona tipo';
    if (!form.nombre)      e.nombre      = 'Requerido';
    if (!form.apellido)    e.apellido    = 'Requerido';
    if (!form.numDoc)      e.numDoc      = 'Requerido';
    if (!form.email)       e.email       = 'Requerido';
    if (!form.descripcionBien) e.descripcionBien = 'Requerido';
    if (!form.descripcion) e.descripcion = 'Requerido';
    if (!form.pedido)      e.pedido      = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    setLoading(true);
    const confirmCode = genCode();
    setCode(confirmCode);

    /* ── EMAIL (production: replace with EmailJS / Resend / nodemailer API) ──
       Build payload:
       To:      gerencia@laeqasociados.com
       Subject: [Libro de Reclamaciones] ${form.tipo} — ${confirmCode}
       Body:    All form fields formatted
    */
    console.log('📨 Enviando a gerencia@laeqasociados.com', { ...form, code: confirmCode });

    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
  };

  /* ── SUCCESS SCREEN ── */
  if (sent) return (
    <div style={{ minHeight:'100dvh', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.3, backgroundImage:`linear-gradient(${T.brand}08 1px,transparent 1px),linear-gradient(90deg,${T.brand}08 1px,transparent 1px)`, backgroundSize:'72px 72px' }}/>
      <motion.div
        initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.7, ease:SILK }}
        style={{ maxWidth:560, width:'100%', background:`linear-gradient(145deg, ${T.bgMid} 0%, ${T.bg} 100%)`, border:`1px solid ${T.brand}30`, padding:'clamp(32px,5vw,60px)', position:'relative', overflow:'hidden', textAlign:'center' }}
      >
        <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:0.6, ease:SILK }}
          style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${T.cyan} 0%, ${T.brand}44 60%, transparent 100%)`, transformOrigin:'left' }}
        />
        <motion.div
          initial={{ scale:0, rotate:-15 }} animate={{ scale:1, rotate:0 }}
          transition={{ delay:0.1, duration:0.7, ease:SILK }}
          style={{ width:80, height:80, background:`${T.cyan}15`, border:`1px solid ${T.cyan}44`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.cyan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
        </motion.div>

        <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:28, color:T.white, margin:'0 0 12px', letterSpacing:'-0.02em' }}>
          Reclamación registrada
        </h2>
        <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:14, color:T.muted, lineHeight:1.75, margin:'0 0 24px' }}>
          Tu {form.tipo.toLowerCase()} ha sido recibida correctamente. Hemos enviado una copia a <strong style={{ color:T.white, fontWeight:500 }}>{form.email}</strong>.
        </p>

        {/* Code */}
        <div style={{ background:`${T.brand}10`, border:`1px solid ${T.brand}28`, padding:'14px 20px', marginBottom:24 }}>
          <p style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.active}66`, textTransform:'uppercase', letterSpacing:'0.24em', margin:'0 0 6px' }}>Código de seguimiento</p>
          <p style={{ fontFamily:'"DM Mono",monospace', fontWeight:500, fontSize:18, color:T.cyan, margin:0, letterSpacing:'0.14em' }}>{code}</p>
        </div>

        <div style={{ background:`${T.brand}08`, border:`1px solid ${T.brand}20`, padding:'14px 18px', marginBottom:28, textAlign:'left' }}>
          <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:12, color:T.muted, margin:0, lineHeight:1.7 }}>
            <strong style={{ color:T.white, fontWeight:500 }}>LAEQ & Asociados S.A.C.</strong> dará respuesta a su {form.tipo.toLowerCase()} dentro de los <strong style={{ color:T.cyan, fontWeight:500 }}>30 días calendario</strong> siguientes, conforme al Art. 24° del DS 011-2011-PCM.
          </p>
        </div>

        <button onClick={() => navigate('/')}
          style={{ padding:'13px 28px', background:'transparent', border:`1px solid ${T.brand}`, cursor:'pointer', fontFamily:'"DM Mono",monospace', fontSize:9.5, color:T.muted, textTransform:'uppercase', letterSpacing:'0.2em', transition:'all .28s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=T.cyan; e.currentTarget.style.color=T.cyan; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=T.brand; e.currentTarget.style.color=T.muted; }}
        >← Volver al inicio</button>
      </motion.div>
    </div>
  );

  /* ── MAIN FORM ── */
  return (
    <div style={{ minHeight:'100dvh', background:T.bg, position:'relative', overflow:'hidden' }}>

      {/* Background textures */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', opacity:0.28, backgroundImage:`linear-gradient(${T.brand}08 1px,transparent 1px),linear-gradient(90deg,${T.brand}08 1px,transparent 1px)`, backgroundSize:'72px 72px', zIndex:0 }}/>
      <div style={{ position:'fixed', top:'-5%', right:'-5%', width:'40vw', height:'50vh', pointerEvents:'none', zIndex:0, background:`radial-gradient(ellipse, ${T.brand}14 0%, transparent 60%)` }}/>

      <div style={{ position:'relative', zIndex:1 }}>

        {/* ── STICKY HEADER ── */}
        <motion.div
          initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, ease:SILK }}
          style={{
            position:'sticky', top:0, zIndex:50,
            background:'rgba(7,30,48,0.92)', backdropFilter:'blur(20px) saturate(1.4)',
            borderBottom:`1px solid ${T.brand}18`,
            padding:'0 clamp(20px,5vw,80px)', height:64,
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={() => navigate('/')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8, padding:0 }}>
              <img src={logoLaeq} alt="LAEQ" style={{ height:38, objectFit:'contain', filter:`drop-shadow(0 0 8px ${T.cyan}44)` }}/>
            </button>
            <div style={{ width:1, height:28, background:`${T.brand}44` }}/>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <img src={libroImg} alt="" style={{ height:22, objectFit:'contain', filter:'invert(1) brightness(0.55) sepia(1) hue-rotate(170deg) saturate(2)', opacity:0.65 }}/>
              <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, color:`${T.active}88`, textTransform:'uppercase', letterSpacing:'0.24em' }}>Libro de Reclamaciones</span>
            </div>
          </div>
          <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:`${T.brand}66`, letterSpacing:'0.14em' }}>Ley 29571 · DS 011-2011-PCM</span>
        </motion.div>

        {/* ── HERO STRIP ── */}
        <div style={{ borderBottom:`1px solid ${T.brand}15`, background:`linear-gradient(90deg, ${T.bgDeep} 0%, ${T.bg} 100%)`, padding:'clamp(28px,4vw,48px) clamp(24px,5vw,80px)' }}>
          <div style={{ maxWidth:'72rem', margin:'0 auto', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:24, height:1, background:T.cyan }}/>
                <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.36em' }}>Libro de Reclamaciones Virtual</span>
              </div>
              <h1 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(28px,4vw,48px)', color:T.white, margin:'0 0 10px', lineHeight:1.05, letterSpacing:'-0.02em', paddingBottom:'0.04em' }}>
                Registro de{' '}
                <em style={{ color:T.cyan, fontStyle:'italic' }}>Reclamaciones</em>
              </h1>
              <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:13, color:T.muted, lineHeight:1.75, maxWidth:520, margin:0 }}>
                Conforme al Código de Protección y Defensa del Consumidor (Ley N.° 29571) y el Decreto Supremo N.° 011-2011-PCM, LAEQ & Asociados S.A.C. pone a su disposición este libro de reclamaciones virtual.
              </p>
            </div>

            {/* Legal badge */}
            <div style={{ background:`${T.brand}10`, border:`1px solid ${T.brand}28`, padding:'18px 22px', flexShrink:0, minWidth:220 }}>
              <p style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.22em', margin:'0 0 10px' }}>Empresa proveedora</p>
              <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:12, color:T.white, margin:'0 0 3px' }}>LAEQ & Asociados S.A.C.</p>
              <p style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:`${T.active}66`, margin:'0 0 6px', letterSpacing:'0.1em' }}>RUC: 20563654431</p>
              <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:11, color:T.dim, margin:0, lineHeight:1.5 }}>Calle Raymundo Cárcamo 904, Of. 501<br/>Urb. Santa Catalina, La Victoria, Lima</p>
            </div>
          </div>
        </div>

        {/* ── FORM ── */}
        <div style={{ maxWidth:'72rem', margin:'0 auto', padding:'clamp(32px,5vh,56px) clamp(24px,5vw,80px) clamp(64px,8vh,100px)' }}>

          {/* TYPE SELECTOR */}
          <div style={{ marginBottom:'clamp(28px,4vh,44px)' }}>
            <p style={{ fontFamily:'"DM Mono",monospace', fontSize:9.5, color:T.muted, textTransform:'uppercase', letterSpacing:'0.3em', margin:'0 0 14px' }}>
              ¿Qué deseas registrar?<span style={{ color:T.cyan, marginLeft:3 }}>*</span>
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {[
                { val:'Reclamo', desc:'Disconformidad con un servicio contratado o producto recibido', color:T.cyan },
                { val:'Queja',   desc:'Disconformidad con la atención recibida, sin relación directa con el servicio contratado', color:'#F0A51E' },
              ].map(opt => {
                const isA = form.tipo === opt.val;
                return (
                  <motion.div key={opt.val}
                    onClick={() => set('tipo', opt.val)}
                    whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                    style={{ flex:1, minWidth:220, padding:'16px 20px', cursor:'pointer', background: isA ? `${opt.color}14` : `${T.brand}06`, border:`1px solid ${isA ? opt.color+'55' : T.brand+'25'}`, position:'relative', transition:'all .3s' }}
                  >
                    {isA && (
                      <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:0.35, ease:SILK }}
                        style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${opt.color} 0%, transparent 100%)`, transformOrigin:'left' }}
                      />
                    )}
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                      <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${isA ? opt.color : T.brand+'44'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'border-color .3s' }}>
                        {isA && <div style={{ width:8, height:8, borderRadius:'50%', background:opt.color }}/>}
                      </div>
                      <span style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:14, color: isA ? opt.color : T.muted, transition:'color .3s' }}>{opt.val}</span>
                    </div>
                    <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:11.5, color:T.dim, margin:0, lineHeight:1.55, paddingLeft:26 }}>{opt.desc}</p>
                  </motion.div>
                );
              })}
            </div>
            {errors.tipo && <p style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:'#E85D5D', margin:'6px 0 0', letterSpacing:'0.1em' }}>{errors.tipo}</p>}
          </div>

          {/* ── SECTION: Datos del Consumidor ── */}
          <Section title="01" label="Datos del Consumidor">
            {/* Tipo cliente toggle */}
            <div style={{ gridColumn:'1 / -1', display:'flex', gap:10, marginBottom:4 }}>
              {[{val:'persona',label:'Persona Natural'},{val:'empresa',label:'Persona Jurídica'}].map(opt => {
                const isA = form.tipoCliente === opt.val;
                return (
                  <button key={opt.val} onClick={() => set('tipoCliente',opt.val)}
                    style={{ padding:'8px 16px', background: isA ? T.cyan : 'transparent', border:`1px solid ${isA ? T.cyan : T.brand+'44'}`, cursor:'pointer', fontFamily:'"DM Mono",monospace', fontSize:9, color: isA ? T.bg : T.muted, textTransform:'uppercase', letterSpacing:'0.18em', transition:'all .28s' }}
                  >{opt.label}</button>
                );
              })}
            </div>

            <Field label="Nombre(s)" required>
              <input type="text" placeholder="Luis" value={form.nombre} onChange={e => set('nombre',e.target.value)} {...fo('nombre')} style={iBase(focused==='nombre', errors.nombre)}/>
              {errors.nombre && <Err>{errors.nombre}</Err>}
            </Field>
            <Field label="Apellido(s)" required>
              <input type="text" placeholder="García Pérez" value={form.apellido} onChange={e => set('apellido',e.target.value)} {...fo('apellido')} style={iBase(focused==='apellido', errors.apellido)}/>
              {errors.apellido && <Err>{errors.apellido}</Err>}
            </Field>
            <Field label="Tipo de documento" required>
              <div style={{ position:'relative' }}>
                <select value={form.tipoDoc} onChange={e => set('tipoDoc',e.target.value)} {...fo('tipoDoc')} style={{ ...iBase(focused==='tipoDoc',false), appearance:'none', paddingRight:36, cursor:'pointer', color:T.white }}>
                  {['DNI','RUC','CE','Pasaporte'].map(d => <option key={d} value={d} style={{ background:'#071E30', color:T.white }}>{d}</option>)}
                </select>
                <ChevDown/>
              </div>
            </Field>
            <Field label="Número de documento" required>
              <input type="text" placeholder="12345678" value={form.numDoc} onChange={e => set('numDoc',e.target.value)} {...fo('numDoc')} style={iBase(focused==='numDoc', errors.numDoc)}/>
              {errors.numDoc && <Err>{errors.numDoc}</Err>}
            </Field>
            <Field label="Correo electrónico" required>
              <input type="email" placeholder="su@empresa.com" value={form.email} onChange={e => set('email',e.target.value)} {...fo('email')} style={iBase(focused==='email', errors.email)}/>
              {errors.email && <Err>{errors.email}</Err>}
            </Field>
            <Field label="Teléfono">
              <input type="tel" placeholder="+51 999 999 999" value={form.tel} onChange={e => set('tel',e.target.value)} {...fo('tel')} style={iBase(focused==='tel',false)}/>
            </Field>
            <Field label="Dirección" span2>
              <input type="text" placeholder="Av. Ejemplo 123, Lima" value={form.direccion} onChange={e => set('direccion',e.target.value)} {...fo('direccion')} style={iBase(focused==='direccion',false)}/>
            </Field>
            {form.tipoCliente === 'empresa' && <>
              <Field label="Razón social">
                <input type="text" placeholder="Mi Empresa S.A.C." value={form.empresa} onChange={e => set('empresa',e.target.value)} {...fo('empresa')} style={iBase(focused==='empresa',false)}/>
              </Field>
              <Field label="RUC">
                <input type="text" placeholder="20123456789" value={form.rucEmpresa} onChange={e => set('rucEmpresa',e.target.value)} {...fo('rucEmpresa')} style={iBase(focused==='rucEmpresa',false)}/>
              </Field>
            </>}
          </Section>

          {/* ── SECTION: Bien contratado ── */}
          <Section title="02" label="Identificación del Bien Contratado">
            <Field label="Tipo de bien" required>
              <div style={{ position:'relative' }}>
                <select value={form.tipoBien} onChange={e => set('tipoBien',e.target.value)} {...fo('tipoBien')} style={{ ...iBase(focused==='tipoBien',false), appearance:'none', paddingRight:36, cursor:'pointer', color: form.tipoBien ? T.white : T.dim }}>
                  <option value="" style={{ background:'#071E30' }}>Seleccionar…</option>
                  <option value="Servicio de Consultoría" style={{ background:'#071E30', color:T.white }}>Servicio de Consultoría</option>
                  <option value="Servicio de Capacitación" style={{ background:'#071E30', color:T.white }}>Servicio de Capacitación</option>
                  <option value="Otro Servicio" style={{ background:'#071E30', color:T.white }}>Otro Servicio</option>
                </select>
                <ChevDown/>
              </div>
            </Field>
            <Field label="Monto cancelado (S/)">
              <input type="number" placeholder="0.00" value={form.monto} onChange={e => set('monto',e.target.value)} {...fo('monto')} style={iBase(focused==='monto',false)}/>
            </Field>
            <Field label="Fecha de contratación">
              <input type="date" value={form.fecha} onChange={e => set('fecha',e.target.value)} {...fo('fecha')}
                style={{ ...iBase(focused==='fecha',false), colorScheme:'dark' }}
              />
            </Field>
            <Field label="Descripción del servicio contratado" required note="Indique el servicio específico que contrató con LAEQ & Asociados" span2>
              <textarea rows={3} placeholder="Describe el servicio contratado…" value={form.descripcionBien} onChange={e => set('descripcionBien',e.target.value)} {...fo('descripcionBien')} style={{ ...iBase(focused==='descripcionBien', errors.descripcionBien), resize:'vertical', lineHeight:1.7 }}/>
              {errors.descripcionBien && <Err>{errors.descripcionBien}</Err>}
            </Field>
          </Section>

          {/* ── SECTION: Detalle de la reclamación ── */}
          <Section title="03" label="Detalle de la Reclamación">
            <Field label="Descripción del hecho reclamado" required note="Explique con detalle el motivo de su reclamación (máx. 2000 caracteres)" span2>
              <textarea rows={5} placeholder="Describa detalladamente el motivo de su queja o reclamo…" value={form.descripcion} onChange={e => set('descripcion',e.target.value.slice(0,2000))} {...fo('descripcion')} style={{ ...iBase(focused==='descripcion', errors.descripcion), resize:'vertical', lineHeight:1.7 }}/>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                {errors.descripcion ? <Err>{errors.descripcion}</Err> : <span/>}
                <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8, color:T.dim, letterSpacing:'0.1em' }}>{form.descripcion.length}/2000</span>
              </div>
            </Field>
            <Field label="Pedido del consumidor" required note="¿Qué solución o respuesta espera de LAEQ?" span2>
              <textarea rows={4} placeholder="Indique qué acción o solución solicita como resultado de esta reclamación…" value={form.pedido} onChange={e => set('pedido',e.target.value)} {...fo('pedido')} style={{ ...iBase(focused==='pedido', errors.pedido), resize:'vertical', lineHeight:1.7 }}/>
              {errors.pedido && <Err>{errors.pedido}</Err>}
            </Field>
          </Section>

          {/* ── LEGAL NOTICE + SUBMIT ── */}
          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, ease:SILK }}
            style={{ background:`${T.brand}08`, border:`1px solid ${T.brand}22`, padding:'clamp(18px,3vw,32px)', marginTop:8 }}
          >
            {/* Notice */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:20 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.active} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:500, fontSize:12, color:T.white, margin:'0 0 4px' }}>Aviso Legal</p>
                <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:11.5, color:T.dim, margin:0, lineHeight:1.65 }}>
                  Al enviar este formulario, usted declara que la información proporcionada es verídica y completa. LAEQ & Asociados S.A.C. registrará su reclamación conforme al <strong style={{ color:T.muted }}>Art. 24° del DS 011-2011-PCM</strong> y responderá dentro de los <strong style={{ color:T.cyan }}>30 días calendario</strong> siguientes a la fecha de recepción. Sus datos personales serán tratados con absoluta confidencialidad de acuerdo con la <strong style={{ color:T.muted }}>Ley N.° 29733</strong> — Ley de Protección de Datos Personales.
                </p>
              </div>
            </div>

            {/* Error summary */}
            <AnimatePresence>
              {Object.keys(errors).length > 0 && (
                <motion.div
                  initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ background:'rgba(232,93,93,0.08)', border:'1px solid rgba(232,93,93,0.28)', padding:'10px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E85D5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:'#E85D5D', margin:0, letterSpacing:'0.12em' }}>
                    Completa los campos obligatorios ({Object.keys(errors).length} pendiente{Object.keys(errors).length>1?'s':''})
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              onClick={handleSend}
              whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
              disabled={loading}
              style={{ width:'100%', padding:'15px 32px', background: loading ? `${T.cyan}66` : T.cyan, border:'none', cursor: loading ? 'wait' : 'pointer', fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:11, color:T.bg, textTransform:'uppercase', letterSpacing:'0.22em', display:'flex', alignItems:'center', justifyContent:'center', gap:12, transition:'background .28s' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background=T.white; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background=T.cyan; }}
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.85, ease:'linear' }}
                    style={{ width:14, height:14, border:`2px solid ${T.bg}44`, borderTopColor:T.bg, borderRadius:'50%' }}
                  />
                  Registrando reclamación…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  Registrar {form.tipo || 'Reclamación'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </motion.button>
          </motion.div>

        </div>
      </div>

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        input::placeholder, textarea::placeholder { color: rgba(184,223,240,0.25) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(2,83,126,0.4); }
      `}</style>
    </div>
  );
};

/* ── Helpers ── */
const ChevDown = () => (
  <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:T.muted }}>
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>
  </div>
);
const Err = ({ children }) => (
  <p style={{ fontFamily:'"DM Mono",monospace', fontSize:8, color:'#E85D5D', margin:'4px 0 0', letterSpacing:'0.1em' }}>{children}</p>
);
const Section = ({ title, label, children }) => (
  <div style={{ marginBottom:'clamp(28px,4vh,44px)' }}>
    <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, paddingBottom:14, borderBottom:`1px solid ${T.brand}18` }}>
      <span style={{ fontFamily:'"DM Mono",monospace', fontSize:11, color:T.cyan, fontWeight:500, letterSpacing:'0.1em' }}>{title}</span>
      <div style={{ width:1, height:18, background:`${T.brand}44` }}/>
      <span style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:12.5, color:T.white, textTransform:'uppercase', letterSpacing:'0.18em' }}>{label}</span>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="form-grid">
      {children}
    </div>
    <style>{`.form-grid { grid-template-columns: 1fr 1fr !important; } @media(max-width:600px){ .form-grid { grid-template-columns: 1fr !important; } }`}</style>
  </div>
);

export default LibroReclamaciones;
