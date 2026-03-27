import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/*
  ─── FONTS ──────────────────────────────────────────────────────────
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

  ─── LOGO FOLDER ────────────────────────────────────────────────────
  Place all logo files in:  /src/assets/clients/
  All logos should be PNG with transparent background (no white box).

  LOGOS YOU HAVE:
  engie.jpg · petroperu.jpg · osinergmin.jpg · coes-logo.png · CHALCO.png
  electroperu.jpg · Enel_Group_logo.svg.png · ENOTRIA.png · esmeralda-corp.jpg
  furukawa.jpg · grano-oro.jpg · grupo-breca.jpg · los-portales.jpg
  mall-aventura.jpg · ministerio-energia-minas.jpg · osinergmin.jpg
  paramonga.jpg · pesquera-diamante.jpg · san-fernando.jpg · siderperu.jpg
  topitop.jpg · aceros-arequipa.jpg · ajaib-agroindustrias.jpg
  austral-group.jpg · egemsa.jpg

  LOGOS TO DOWNLOAD (transparent PNG preferred):
  calidda.png · luz-del-sur.png · tgp.png · pluspetrol.png
  kallpa.png · proinversion.png · hunt-oil.png · repsol.png
  esan.png · breca.png
  zelestra.png · egasa.png · egesur.png · pluz-energia.png · orygen.png
  celepsa.png · fenix.png · termoselva.png
  exalmar.png · centinela.png · caraveli.png · veta-dorada.png
  tasa.png · intursa.png · urbanova.png · la-rioja.png
*/

/* ═══════════════════════════════════════════════
   TOKENS
════════════════════════════════════════════════ */
const T = {
  bg:     '#FFFFFF',          /* blanco puro — fondo principal */
  bgCard: '#EBF5FF',          /* azul hielo — cards y superficies */
  bgDeep: '#DDEEFF',          /* azul suave — bordes, separadores */
  brand:  '#02537E',          /* azul LAEQ — primario */
  active: '#0A8FC7',          /* azul medio — activos */
  cyan:   '#1EB8F0',          /* azul vivo — acento */
  ink:    '#0D2B4E',          /* azul oscuro — texto principal */
  muted:  'rgba(2,83,126,0.55)',  /* texto secundario */
  dim:    'rgba(2,83,126,0.38)',  /* texto terciario */
  line:   'rgba(2,83,126,0.10)', /* bordes sutiles */
};
const SILK = [0.16, 1, 0.3, 1];
const EXPO = [0.76, 0, 0.24, 1];

/* ═══════════════════════════════════════════════
   CLIENT DATA
════════════════════════════════════════════════ */
const CLIENTS = [
  // ENERGÍA & GAS
  { id:'engie',       name:'ENGIE Perú',         sector:'energia',    logo:'engie.jpg',                    rel:'PPA 500 MW renovables',          year:'2022', url:'https://www.engie-energia.pe',           size:'lg' },
  { id:'petroperú',   name:'PETROPERÚ',           sector:'energia',    logo:'petroperu.jpg',                rel:'Optimización cadena −15%',        year:'2022', url:'https://www.petroperu.com.pe',           size:'lg' },
  { id:'osinergmin',  name:'OSINERGMIN',          sector:'gobierno',   logo:'osinergmin.jpg',               rel:'Marco regulatorio gas natural',   year:'2023', url:'https://www.osinergmin.gob.pe',          size:'lg' },
  { id:'minem',       name:'MINEM',               sector:'gobierno',   logo:'ministerio-energia-minas.jpg', rel:'Planificación energética',        year:'2019', url:'https://www.gob.pe/minem',               size:'md' },
  { id:'coes',        name:'COES-SINAC',          sector:'gobierno',   logo:'coes-logo.png',                rel:'Análisis mercado SEIN',           year:'2022', url:'https://www.coes.org.pe',                size:'md' },
  { id:'enel',        name:'Enel Distribución',   sector:'energia',    logo:'Enel_Group_logo.svg.png',      rel:'Mercado eléctrico Lima',          year:'2022', url:'https://www.enel.pe',                    size:'md' },
  { id:'electroperu', name:'Electroperú',         sector:'energia',    logo:'electroperu.jpg',              rel:'Regulación y planificación',      year:'2020', url:'https://www.electroperu.com.pe',         size:'md' },
  { id:'chalco',      name:'Chinalco',              sector:'industria',  logo:'CHALCO.png',                   rel:'Consultoría energética',          year:'2021', url:'https://www.chalco.com.cn',              size:'sm' },
  { id:'egemsa',      name:'EGEMSA',              sector:'energia',    logo:'egemsa.jpg',                   rel:'Hidroeléctricas',                 year:'2020', url:'https://www.egemsa.com.pe',              size:'sm' },
  { id:'calidda',     name:'Cálidda',             sector:'energia',    logo:'calidda.png',                  rel:'Gas natural Lima',                year:'2021', url:'https://www.calidda.com.pe',             size:'md' },
  { id:'tgp',         name:'TGP',                 sector:'energia',    logo:'tgp.png',                      rel:'Gas Camisea',                     year:'2020', url:'https://www.tgp.com.pe',                 size:'md' },
  { id:'pluspetrol',  name:'Pluspetrol',          sector:'energia',    logo:'pluspetrol.png',               rel:'E&P hidrocarburos',               year:'2021', url:'https://www.pluspetrol.net',             size:'sm' },
  { id:'repsol',      name:'Repsol Perú',         sector:'energia',    logo:'repsol.png',                   rel:'Normativa hidrocarburos',         year:'2020', url:'https://www.repsol.com/es/peru',         size:'sm' },
  { id:'huntoil',     name:'Hunt Oil',            sector:'energia',    logo:'hunt-oil.png',                 rel:'Contratos gas natural',           year:'2019', url:'https://www.huntoil.com',                size:'sm' },
  { id:'kallpa',      name:'Kallpa Generación',   sector:'energia',    logo:'kallpa.png',                   rel:'PPA mercado eléctrico',           year:'2021', url:'https://www.kallpageneracion.com.pe',    size:'sm' },
  { id:'zelestra',    name:'ZELESTRA',            sector:'energia',    logo:'zelestra.png',                 rel:'Energía renovable',               year:'2023', url:'#',                                      size:'sm' },
  { id:'egasa',       name:'EGASA',               sector:'energia',    logo:'egasa.png',                    rel:'Generación eléctrica sur',        year:'2022', url:'#',                                      size:'sm' },
  { id:'egesur',      name:'EGESUR',              sector:'energia',    logo:'egesur.png',                   rel:'Generación eléctrica',            year:'2022', url:'#',                                      size:'sm' },
  { id:'pluzenergia', name:'PLUZ ENERGÍA',        sector:'energia',    logo:'pluz-energia.png',             rel:'Distribución eléctrica',          year:'2023', url:'#',                                      size:'sm' },
  { id:'orygen',      name:'ORYGEN',              sector:'energia',    logo:'orygen.png',                   rel:'Energía renovable',               year:'2023', url:'#',                                      size:'sm' },
  { id:'celepsa',     name:'CELEPSA',             sector:'energia',    logo:'celepsa.png',                  rel:'Generación hidroeléctrica',       year:'2021', url:'#',                                      size:'sm' },
  { id:'fenix',       name:'FÉNIX',               sector:'energia',    logo:'fenix.png',                    rel:'Generación termoeléctrica',       year:'2022', url:'#',                                      size:'sm' },
  { id:'termoselva',  name:'TERMOSELVA',          sector:'energia',    logo:'termoselva.png',               rel:'Generación a gas natural',        year:'2021', url:'#',                                      size:'sm' },
  { id:'proinversion',name:'ProInversión',        sector:'gobierno',   logo:'proinversion.png',             rel:'Proyectos energéticos',           year:'2020', url:'https://www.proinversion.gob.pe',        size:'md' },
  // INDUSTRIA
  { id:'siderperu',   name:'SIDERPERÚ',           sector:'industria',  logo:'siderperu.jpg',                rel:'Energía siderúrgica',             year:'2021', url:'https://www.siderperu.com.pe',           size:'md' },
  { id:'acerosar',    name:'Aceros Arequipa',     sector:'industria',  logo:'aceros-arequipa.jpg',          rel:'Suministro energía industrial',   year:'2020', url:'https://www.acerosarequipa.com',         size:'md' },
  { id:'furukawa',    name:'Furukawa',            sector:'industria',  logo:'furukawa.jpg',                 rel:'Energía manufactura',             year:'2021', url:'https://www.furukawa.com.pe',            size:'sm' },
  { id:'grupobr',     name:'Grupo Breca',         sector:'industria',  logo:'grupo-breca.jpg',              rel:'Energía corporativa',             year:'2022', url:'https://www.breca.com',                  size:'sm' },
  { id:'sanfernando', name:'San Fernando',        sector:'industria',  logo:'san-fernando.jpg',             rel:'Energía agroindustrial',          year:'2021', url:'https://www.san-fernando.com.pe',        size:'sm' },
  { id:'losportales', name:'Los Portales',        sector:'industria',  logo:'los-portales.jpg',             rel:'Inmobiliaria — gestión energética',year:'2020', url:'https://www.losportales.com.pe',        size:'sm' },
  { id:'topitop',     name:'Topitop',             sector:'industria',  logo:'topitop.jpg',                  rel:'Energía sector textil',           year:'2019', url:'https://www.topitop.com.pe',             size:'sm' },
  { id:'esmeralda',   name:'Esmeralda Corp',      sector:'industria',  logo:'esmeralda-corp.jpg',           rel:'Consultoría energética',          year:'2021', url:'https://www.esmeraldacorp.com',          size:'sm' },
  { id:'paramonga',   name:'Paramonga',           sector:'industria',  logo:'paramonga.jpg',                rel:'Agroindustria — energía',         year:'2020', url:'https://www.paramonga.com.pe',           size:'sm' },
  { id:'granodeoro',  name:'Grano de Oro',        sector:'industria',  logo:'grano-oro.jpg',                rel:'Agroindustria energética',        year:'2019', url:'#',                                      size:'sm' },
  { id:'enotria',     name:'ENOTRIA',             sector:'industria',  logo:'ENOTRIA.png',                  rel:'Consultoría energética',          year:'2021', url:'#',                                      size:'sm' },
  { id:'mallaventura',name:'Mall Aventura',       sector:'industria',  logo:'mall-aventura.jpg',            rel:'Retail — eficiencia energética',  year:'2022', url:'https://www.mallaventura.com',           size:'sm' },
  { id:'aib',         name:'AIB Agroindustrias',  sector:'industria',  logo:'ajaib-agroindustrias.jpg',     rel:'Energía sector agrícola',         year:'2020', url:'#',                                      size:'sm' },
  { id:'pdiamante',   name:'Pesquera Diamante',   sector:'industria',  logo:'pesquera-diamante.jpg',        rel:'Energía sector pesquero',         year:'2021', url:'https://www.diamante.com.pe',            size:'sm' },
  { id:'austral',     name:'Austral Group',       sector:'industria',  logo:'austral-group.jpg',            rel:'Energía pesquera',                year:'2021', url:'https://www.austral.com.pe',             size:'sm' },
  { id:'exalmar',     name:'Pesquera Exalmar',    sector:'industria',  logo:'exalmar.png',                  rel:'Energía sector pesquero',         year:'2022', url:'https://www.exalmar.com.pe',             size:'sm' },
  { id:'centinela',   name:'Pesquera Centinela',  sector:'industria',  logo:'centinela.png',                rel:'Energía sector pesquero',         year:'2022', url:'#',                                      size:'sm' },
  { id:'caraveli',    name:'Cía. Minera Caravelí',sector:'industria',  logo:'caraveli.png',                 rel:'Energía sector minero',           year:'2023', url:'#',                                      size:'sm' },
  { id:'vetadorada',  name:'Minera Veta Dorada',  sector:'industria',  logo:'veta-dorada.png',              rel:'Energía sector minero',           year:'2023', url:'#',                                      size:'sm' },
  { id:'tasa',        name:'TASA',                sector:'industria',  logo:'tasa.png',                     rel:'Energía sector pesquero',         year:'2022', url:'https://www.tasa.com.pe',                size:'sm' },
  { id:'intursa',     name:'INTURSA',             sector:'industria',  logo:'intursa.png',                  rel:'Gestión energética',              year:'2022', url:'#',                                      size:'sm' },
  { id:'urbanova',    name:'URBANOVA',            sector:'industria',  logo:'urbanova.png',                 rel:'Eficiencia energética',           year:'2023', url:'#',                                      size:'sm' },
  { id:'larioja',     name:'Inversiones La Rioja',sector:'industria',  logo:'la-rioja.png',                 rel:'Consultoría energética',          year:'2023', url:'#',                                      size:'sm' },
  // UNIVERSIDAD
  { id:'esan',        name:'ESAN',                sector:'universidad',logo:'esan.png',                     rel:'Docente 5 programas activos',     year:'2014–2024', url:'https://www.esan.edu.pe',            size:'lg' },
];

const SECTORS = [
  { key:'todos',      label:'Todos',           color: T.cyan  },
  { key:'energia',    label:'Energía & Gas',   color:'#0A8FC7'},
  { key:'gobierno',   label:'Reguladores',     color:'#38C9A8'},
  { key:'industria',  label:'Industria',       color:'#F0A51E'},
  { key:'universidad',label:'Universidad',     color:'#A07CF0'},
];

/* logo path helper */
const L = (f) => `/assets/clients/${f}`;

/* ═══════════════════════════════════════════════
   MARQUEE
════════════════════════════════════════════════ */
const Marquee = ({ items, reverse, speed = 40 }) => {
  const all = [...items, ...items, ...items, ...items];
  return (
    <div style={{ overflow:'hidden', width:'100%' }}>
      <motion.div
        animate={{ x: reverse ? ['-33.33%','0%'] : ['0%','-33.33%'] }}
        transition={{ repeat:Infinity, duration:speed, ease:'linear' }}
        style={{ display:'flex', width:'max-content', gap:0 }}
      >
        {all.map((c,i) => (
          <div key={`${c.id}-${i}`} style={{
            width:140, height:72, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:'0 20px',
            borderRight:`1px solid ${T.brand}12`,
          }}>
            <img
              src={L(c.logo)} alt={c.name}
              onError={e => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'block';
              }}
              style={{
                maxWidth:100, maxHeight:38, objectFit:'contain',
                opacity:0.50,
                /* KEY FIX: no invert, no grayscale that breaks transparent PNGs.
                   brightness alone dims without destroying colour channels */
                filter:'saturate(0) brightness(0.6) contrast(1.1)',
              }}
            />
            <span style={{ display:'none', fontFamily:'"DM Mono",monospace', fontSize:8, color:'rgba(10,143,199,0.50)', textTransform:'uppercase', letterSpacing:'0.14em', textAlign:'center', lineHeight:1.3 }}>{c.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   LOGO CARD  — transparent-PNG aware
════════════════════════════════════════════════ */
const LogoCard = ({ c, isActive, isAnyActive, onEnter, onLeave, onClick }) => {
  const [imgOk, setImgOk] = useState(true);

  /* When another card is active, dim this one */
  const dimmed = isAnyActive && !isActive;

  return (
    <motion.div
      layout
      initial={{ opacity:0, scale:0.88 }}
      animate={{ opacity: dimmed ? 0.35 : 1, scale:1 }}
      exit={{ opacity:0, scale:0.85 }}
      transition={{ duration:0.45, ease:SILK }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      data-c="ver"
      style={{
        position:'relative',
        aspectRatio:'16/9',
        minHeight:90,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'18px 22px',
        cursor:'pointer', overflow:'hidden',
        border:`1px solid ${isActive ? T.cyan+'66' : 'rgba(2,83,126,0.08)'}`,
        boxShadow: isActive ? `0 4px 20px rgba(30,184,240,0.12)` : 'none',
        background: isActive
          ? `linear-gradient(145deg, #DDEEFF 0%, rgba(30,184,240,0.06) 100%)`
          : '#FFFFFF',
        transition:'border-color .3s, background .3s, opacity .35s',
      }}
    >
      {/* ── BEAM spotlight (active only) ── */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity:0, scaleX:0.4 }}
            animate={{ opacity:1, scaleX:1 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.4, ease:SILK }}
            style={{
              position:'absolute', top:0, left:'50%',
              transform:'translateX(-50%)',
              width:'120%', height:'200%',
              background:`radial-gradient(ellipse 60% 40% at 50% 0%, ${T.cyan}28 0%, transparent 70%)`,
              pointerEvents:'none', zIndex:0,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Top line draw ── */}
      <motion.div
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration:0.4, ease:SILK }}
        style={{
          position:'absolute', top:0, left:0, right:0, height:1.5,
          background:`linear-gradient(90deg, transparent 0%, ${T.cyan} 50%, transparent 100%)`,
          transformOrigin:'center', zIndex:1,
        }}
      />

      {/* ── Logo image ── */}
      {imgOk ? (
        <motion.img
          src={L(c.logo)}
          alt={c.name}
          onError={() => setImgOk(false)}
          animate={{
            /* CORRECT transparent-PNG filter:
               inactive → desaturate + dim
               active   → full colour, slight glow */
            filter: isActive
              ? `saturate(1.2) brightness(1.0) drop-shadow(0 0 8px rgba(30,184,240,0.30))`
              : 'saturate(0) brightness(0.55) contrast(1.1)',
            opacity: isActive ? 1 : 0.55,
            scale: isActive ? 1.06 : 1,
          }}
          transition={{ duration:0.4, ease:SILK }}
          style={{
            maxWidth:'80%', maxHeight:52, objectFit:'contain',
            display:'block', position:'relative', zIndex:1,
          }}
        />
      ) : (
        /* Fallback name tag */
        <span style={{
          fontFamily:'"DM Mono",monospace', fontSize:9.5,
          color: isActive ? T.cyan : 'rgba(10,143,199,0.45)',
          textTransform:'uppercase', letterSpacing:'0.18em',
          textAlign:'center', lineHeight:1.35, position:'relative', zIndex:1,
          transition:'color .3s',
        }}>{c.name}</span>
      )}

      {/* ── Active: sector dot ── */}
      {isActive && (
        <motion.div
          initial={{ scale:0 }} animate={{ scale:1 }}
          style={{
            position:'absolute', bottom:6, right:8,
            width:5, height:5, borderRadius:'50%',
            background: T.cyan,
            boxShadow:`0 0 6px ${T.cyan}88`,
          }}
        />
      )}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   CLIENT DETAIL PANEL
════════════════════════════════════════════════ */
const Detail = ({ c, sectorColor, onClose }) => (
  <motion.div
    key={c.id}
    initial={{ opacity:0, x:32 }}
    animate={{ opacity:1, x:0 }}
    exit={{ opacity:0, x:24 }}
    transition={{ duration:0.45, ease:SILK }}
    style={{
      background:'linear-gradient(145deg, #EBF5FF 0%, #FFFFFF 100%)',
      border:`1px solid ${sectorColor}33`,
      boxShadow:'0 8px 40px rgba(2,83,126,0.06)',
      padding:'clamp(22px,3vw,36px)',
      display:'flex', flexDirection:'column',
      justifyContent:'space-between',
      minHeight:320, height:'100%',
      position:'relative', overflow:'hidden',
    }}
  >
    {/* accent line */}
    <motion.div
      initial={{ scaleX:0 }} animate={{ scaleX:1 }}
      transition={{ duration:0.55, ease:SILK }}
      style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${sectorColor} 0%, ${T.brand}44 60%, transparent 100%)`, transformOrigin:'left' }}
    />
    {/* glow */}
    <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'60%', height:'60%', pointerEvents:'none', background:`radial-gradient(ellipse, ${sectorColor}12 0%, transparent 65%)` }} />

    <div style={{ position:'relative', zIndex:1 }}>
      {/* sector */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ width:22, height:1, background:sectorColor }} />
        <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:sectorColor, textTransform:'uppercase', letterSpacing:'0.32em' }}>
          {{ energia:'Energía & Gas', gobierno:'Reguladores', industria:'Industria', universidad:'Universidad' }[c.sector]}
        </span>
      </div>

      {/* logo large */}
      <div style={{ height:60, display:'flex', alignItems:'center', marginBottom:16 }}>
        <img
          src={L(c.logo)} alt={c.name}
          onError={e => { e.currentTarget.style.display='none'; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display='block'; }}
          style={{ maxWidth:150, maxHeight:56, objectFit:'contain', filter:'saturate(1) brightness(0.95) contrast(1.05)', opacity:0.92 }}
        />
        <span style={{ display:'none', fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:20, color:T.ink }}>{c.name}</span>
      </div>

      {/* name */}
      <h4 style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(18px,2.5vw,28px)', color:T.ink, margin:'0 0 8px', lineHeight:1.05, letterSpacing:'-0.02em', paddingBottom:'0.04em' }}>{c.name}</h4>

      {/* relation */}
      <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:13, color:'rgba(2,83,126,0.60)', lineHeight:1.75, margin:'0 0 16px' }}>{c.rel}</p>

      {/* year */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
        <span style={{ fontFamily:'"DM Mono",monospace', fontSize:9, color:'rgba(10,143,199,0.55)', textTransform:'uppercase', letterSpacing:'0.2em' }}>{c.year}</span>
        <div style={{ flex:1, height:1, background:'rgba(2,83,126,0.12)' }} />
      </div>
    </div>

    {/* CTAs */}
    <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', gap:8 }}>
      {c.url && c.url !== '#' && (
        <a href={c.url} target="_blank" rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:'10px 16px', background:'transparent', border:`1px solid ${sectorColor}44`, fontFamily:'"DM Mono",monospace', fontSize:9, color:'rgba(2,83,126,0.55)', textDecoration:'none', textTransform:'uppercase', letterSpacing:'0.16em', transition:'all .28s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=sectorColor; e.currentTarget.style.color=sectorColor; e.currentTarget.style.background=`${sectorColor}10`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=`${sectorColor}44`; e.currentTarget.style.color='rgba(2,83,126,0.55)'; e.currentTarget.style.background='transparent'; }}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          Visitar {c.name}
        </a>
      )}
      <button onClick={onClose}
        style={{ padding:'9px 16px', background:'transparent', border:'1px solid rgba(2,83,126,0.14)', cursor:'pointer', fontFamily:'"DM Mono",monospace', fontSize:9, color:'rgba(2,83,126,0.50)', textTransform:'uppercase', letterSpacing:'0.16em', transition:'all .28s' }}
        onMouseEnter={e => { e.currentTarget.style.color=T.cyan; e.currentTarget.style.borderColor=`${T.cyan}44`; }}
        onMouseLeave={e => { e.currentTarget.style.color='rgba(2,83,126,0.50)'; e.currentTarget.style.borderColor='rgba(2,83,126,0.14)'; }}
      >← Todos los clientes</button>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════ */
const Clients = () => {
  const [sector, setSector]     = useState('todos');
  const [hovered, setHovered]   = useState(null);
  const [selected, setSelected] = useState(null);
  const ref   = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-60px' });

  const filtered = sector === 'todos' ? CLIENTS : CLIENTS.filter(c => c.sector === sector);
  const activeSector = SECTORS.find(s => s.key === sector);
  const selectedSector = selected ? SECTORS.find(s => s.key === selected.sector) : null;

  const activeId = selected?.id || hovered;
  const isAnyActive = !!activeId;

  const handleCard = useCallback((c) => {
    setSelected(prev => prev?.id === c.id ? null : c);
  }, []);

  /* Marquee splits */
  const row1 = CLIENTS.filter(c => ['energia','gobierno'].includes(c.sector));
  const row2 = CLIENTS.filter(c => ['industria','universidad'].includes(c.sector));

  return (
    <section ref={ref} id="clientes" style={{ background:'linear-gradient(175deg,#FFFFFF 0%,#F0F8FF 60%,#EAF4FC 100%)', paddingTop:'clamp(80px,10vh,120px)', paddingBottom:'clamp(80px,10vh,120px)', position:'relative', overflow:'hidden' }}>

      {/* Grid texture */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, opacity:0.20,
        backgroundImage:`linear-gradient(rgba(2,83,126,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(2,83,126,0.04) 1px,transparent 1px)`,
        backgroundSize:'72px 72px' }}
      />
      {/* Glow */}
      <div style={{ position:'absolute', right:'-5%', top:'15%', width:'42vw', height:'52vh', pointerEvents:'none', zIndex:0, background:`radial-gradient(ellipse, rgba(10,143,199,0.06) 0%, transparent 60%)` }} />
      {/* Noise */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, opacity:0.018,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:'220px 220px' }}
      />

      <div style={{ position:'relative', zIndex:1 }}>

        {/* ═══ HEADER ═══ */}
        <div style={{ padding:'0 clamp(24px,5vw,80px)', marginBottom:'clamp(44px,6vh,68px)' }}>
          <motion.div
            initial={{ opacity:0, x:-16 }} animate={inView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.7, ease:SILK }}
            style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}
          >
            <div style={{ width:28, height:1, background:T.cyan }} />
            <span style={{ fontFamily:'"DM Mono",monospace', fontSize:10, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.42em' }}>Confían en LAEQ · 30+ empresas</span>
          </motion.div>

          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:20 }}>
            <motion.h2
              initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.9, ease:SILK, delay:0.1 }}
              style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(42px,6.5vw,88px)', color:T.ink, margin:0, lineHeight:1, letterSpacing:'-0.025em', paddingBottom:'0.08em' }}
            >
              Líderes del{' '}
              <em style={{ color:T.cyan, fontStyle:'italic', fontWeight:600 }}>Sector Energético</em>
            </motion.h2>
            <motion.p
              initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
              transition={{ duration:0.8, ease:SILK, delay:0.22 }}
              style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:13, color:T.muted, lineHeight:1.75, maxWidth:290, margin:0 }}
            >
              Las empresas más exigentes del mercado energético peruano eligen a LAEQ para sus decisiones estratégicas.
            </motion.p>
          </div>
        </div>

        {/* ═══ MARQUEE RAILS ═══ */}
        <motion.div
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
          transition={{ duration:1, delay:0.2 }}
          style={{ borderTop:'1px solid rgba(2,83,126,0.08)', borderBottom:'1px solid rgba(2,83,126,0.08)', background:'linear-gradient(90deg,#EBF5FF,#F5FAFF,#EBF5FF)', marginBottom:'clamp(44px,5vh,64px)' }}
        >
          <div style={{ borderBottom:'1px solid rgba(2,83,126,0.06)' }}><Marquee items={row1} reverse={false} speed={38}/></div>
          <Marquee items={row2} reverse={true} speed={46}/>
        </motion.div>

        {/* ═══ FILTERS ═══ */}
        <motion.div
          initial={{ opacity:0, y:12 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, ease:SILK, delay:0.25 }}
          style={{ padding:'0 clamp(24px,5vw,80px)', display:'flex', flexWrap:'wrap', gap:8, marginBottom:'clamp(26px,3.5vh,42px)' }}
        >
          {SECTORS.map(s => {
            const isA = sector === s.key;
            const count = s.key === 'todos' ? CLIENTS.length : CLIENTS.filter(c => c.sector === s.key).length;
            return (
              <button key={s.key}
                onClick={() => { setSector(s.key); setSelected(null); }}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'8px 16px',
                  background: isA ? s.color : 'transparent',
                  border:`1px solid ${isA ? s.color : 'rgba(2,83,126,0.18)'}`,
                  cursor:'pointer',
                  fontFamily:'"DM Mono",monospace', fontSize:9.5,
                  color: isA ? '#FFFFFF' : 'rgba(2,83,126,0.55)',
                  textTransform:'uppercase', letterSpacing:'0.18em',
                  transition:'all .28s', whiteSpace:'nowrap',
                }}
                onMouseEnter={e => { if (!isA) { e.currentTarget.style.borderColor=s.color+'66'; e.currentTarget.style.color=s.color; } }}
                onMouseLeave={e => { if (!isA) { e.currentTarget.style.borderColor='rgba(2,83,126,0.18)'; e.currentTarget.style.color='rgba(2,83,126,0.55)'; } }}
              >
                {s.label}
                <span style={{ fontFamily:'"DM Mono",monospace', fontSize:8, background: isA ? 'rgba(255,255,255,0.22)' : 'rgba(2,83,126,0.08)', color: isA ? '#FFFFFF' : T.active, padding:'2px 6px' }}>{count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* ═══ GRID + DETAIL ═══ */}
        <div style={{ padding:'0 clamp(24px,5vw,80px)' }}>
          <div style={{
            display:'grid',
            gridTemplateColumns: selected ? 'minmax(0,1fr) 300px' : '1fr',
            gap:20, alignItems:'start',
            transition:'grid-template-columns .45s ease',
          }}
            className="clients-layout"
          >
            {/* Logo grid */}
            <div>
              <motion.div
                layout
                style={{
                  display:'grid',
                  gridTemplateColumns:`repeat(auto-fill, minmax(${selected ? '120px' : '160px'}, 1fr))`,
                  gap:1,
                  border:'1px solid rgba(2,83,126,0.08)',
                  background:'rgba(2,83,126,0.03)',
                }}
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map(c => (
                    <LogoCard
                      key={c.id} c={c}
                      isActive={activeId === c.id}
                      isAnyActive={isAnyActive}
                      onEnter={() => setHovered(c.id)}
                      onLeave={() => setHovered(null)}
                      onClick={() => handleCard(c)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Hint */}
              <motion.p
                initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ delay:0.6 }}
                style={{ fontFamily:'"DM Mono",monospace', fontSize:8.5, color:'rgba(10,143,199,0.35)', textAlign:'center', textTransform:'uppercase', letterSpacing:'0.24em', marginTop:12 }}
              >
                Hover para ver · Click para detalles
              </motion.p>
            </div>

            {/* Detail panel */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity:0, x:24, width:0 }}
                  animate={{ opacity:1, x:0, width:'auto' }}
                  exit={{ opacity:0, x:16, width:0 }}
                  transition={{ duration:0.45, ease:SILK }}
                  className="clients-detail-col"
                  style={{ overflow:'hidden' }}
                >
                  <Detail
                    c={selected}
                    sectorColor={selectedSector?.color || T.cyan}
                    onClose={() => setSelected(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══ STATS BAR ═══ */}
        <motion.div
          initial={{ opacity:0, y:18 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.8, ease:SILK, delay:0.35 }}
          style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:'1px solid rgba(2,83,126,0.10)', borderBottom:'1px solid rgba(2,83,126,0.10)', marginTop:'clamp(48px,6vh,72px)' }}
          className="clients-stats"
        >
          {[
            { val:'30+',  label:'Clientes de élite' },
            { val:'10+',  label:'Años de trayectoria' },
            { val:'99%',  label:'Satisfacción' },
            { val:'100%', label:'Confidencialidad' },
          ].map((s,i) => (
            <div key={i} style={{ padding:'clamp(18px,2.5vw,28px)', borderRight: i<3 ? '1px solid rgba(2,83,126,0.08)' : 'none', textAlign:'center', background: i%2===0 ? 'rgba(2,83,126,0.025)' : 'transparent' }}>
              <div style={{ fontFamily:'"Cormorant Garamond",serif', fontWeight:700, fontSize:'clamp(26px,3.8vw,48px)', color:T.cyan, lineHeight:1, letterSpacing:'-0.03em' }}>{s.val}</div>
              <div style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:10.5, color:'rgba(2,83,126,0.45)', textTransform:'uppercase', letterSpacing:'0.16em', marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ═══ BOTTOM CTA ═══ */}
        <motion.div
          initial={{ opacity:0, y:18 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.8, ease:SILK, delay:0.42 }}
          style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20, padding:'clamp(32px,5vh,52px) clamp(24px,5vw,80px) 0' }}
        >
          <div>
            <p style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontWeight:600, fontSize:'clamp(18px,2.3vw,26px)', color:'rgba(2,83,126,0.65)', margin:0, paddingBottom:'0.06em' }}>
              ¿Tu empresa aún no está aquí?
            </p>
            <p style={{ fontFamily:'"DM Sans",sans-serif', fontWeight:300, fontSize:12.5, color:'rgba(2,83,126,0.40)', margin:'5px 0 0' }}>
              Únete a los líderes del sector energético que confían en LAEQ.
            </p>
          </div>
          <button
            data-c="consultar"
            style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 28px', background:'transparent', border:`1px solid ${T.brand}`, cursor:'pointer', fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:10.5, color:T.cyan, textTransform:'uppercase', letterSpacing:'0.2em', transition:'all .3s', flexShrink:0 }}
            onMouseEnter={e => { e.currentTarget.style.background=T.cyan; e.currentTarget.style.color='#FFFFFF'; e.currentTarget.style.borderColor=T.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=T.cyan; e.currentTarget.style.borderColor=T.brand; }}
          >
            Agendar Primera Consulta
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </motion.div>

      </div>

      {/* ═══ RESPONSIVE CSS ═══ */}
      <style>{`
        .clients-layout { display: grid !important; }
        .clients-stats  { grid-template-columns: repeat(4,1fr) !important; }
        .clients-detail-col { display: block !important; }

        @media (max-width: 860px) {
          .clients-layout { grid-template-columns: 1fr !important; }
          .clients-detail-col { display: none !important; }
        }
        @media (max-width: 560px) {
          .clients-stats { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  );
};

export default Clients;
