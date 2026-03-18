import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  motion, AnimatePresence, useSpring,
  useMotionValue, useScroll, useTransform,
} from 'framer-motion';

import bgInfra  from '../assets/bg-infra.jpg';
import bgGrid   from '../assets/bg-grid-energy.png';
import logoLaeq from '../assets/logo-laeq.jpg';

/*
  ─── FONTS (index.html <head>) ──────────────────────────────────────────
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,600;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

  ─── Z-INDEX MAP (never conflicts) ──────────────────────────────────────
  hero content     → z: 10
  hero overlays    → z: 3–6
  header           → z: 80   (visible above hero, below menu)
  menu fullscreen  → z: 500  (covers EVERYTHING)
  cursor           → z: 9000 (always on top)
*/

/* ══════════════════ TOKENS ══════════════════ */
const T = {
  bg:       '#020C18',
  bgMid:    '#041828',
  brand:    '#02537E',
  active:   '#0A8FC7',
  cyan:     '#1EB8F0',
  white:    '#E8F4FC',
  muted:    'rgba(184,223,240,0.38)',
};

/* ease */
const EXPO = [0.76, 0, 0.24, 1];
const SILK = [0.16, 1, 0.3, 1];

/* ══════════════════ HOOKS ══════════════════ */
function useCounter(end, dur = 1.8, delayS = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let s = null;
      const f = (ts) => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / (dur * 1000), 1);
        setN(Math.floor((1 - Math.pow(1 - p, 3)) * end));
        p < 1 ? requestAnimationFrame(f) : setN(end);
      };
      requestAnimationFrame(f);
    }, delayS * 1000);
    return () => clearTimeout(t);
  }, [end, dur, delayS]);
  return n;
}

/* ══════════════════ CURSOR ══════════════════ */
const Cursor = () => {
  const mx = useMotionValue(-120);
  const my = useMotionValue(-120);
  const rx = useSpring(mx, { stiffness: 90, damping: 22 });
  const ry = useSpring(my, { stiffness: 90, damping: 22 });
  const [label, setLabel] = useState('');

  useEffect(() => {
    const move = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    const over  = (e) => {
      const el = e.target.closest('[data-c]');
      setLabel(el ? (el.dataset.c || '') : '');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [mx, my]);

  const hasLabel = label.length > 0;

  return (
    <>
      {/* trailing ring */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9000,
          pointerEvents: 'none',
          x: rx, y: ry,
          translateX: '-50%', translateY: '-50%',
        }}
      >
        <motion.div
          animate={{ width: hasLabel ? 72 : 38, height: hasLabel ? 72 : 38 }}
          transition={{ duration: 0.3, ease: SILK }}
          style={{
            borderRadius: '50%',
            border: `1px solid ${hasLabel ? T.cyan : 'rgba(30,184,240,0.35)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, color: T.cyan, letterSpacing: '0.1em',
            fontFamily: '"DM Mono",monospace', textTransform: 'uppercase',
          }}
        >
          {hasLabel && label}
        </motion.div>
      </motion.div>
      {/* dot */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9001,
          width: 7, height: 7, borderRadius: '50%',
          background: hasLabel ? T.white : T.cyan,
          pointerEvents: 'none',
          x: mx, y: my,
          translateX: '-50%', translateY: '-50%',
          transition: 'background 0.2s',
        }}
      />
    </>
  );
};

/* ══════════════════ MENU FULLSCREEN ══════════════════ */
const NAV = [
  { n: '01', label: 'Servicios',     sub: 'Regulación · Contratos PPA' },
  { n: '02', label: 'Proyectos',     sub: '10+ casos ejecutados' },
  { n: '03', label: 'Publicaciones', sub: 'Artículos y análisis' },
  { n: '04', label: 'Nosotros',      sub: 'Ex Viceministro y equipo' },
  { n: '05', label: 'Contacto',      sub: 'Agenda una consulta hoy' },
];

const MenuLink = ({ n, label, sub, i, onClose }) => {
  const [hov, setHov] = useState(false);
  const anchorMap = {
    Servicios: 'servicios',
    Proyectos: 'proyectos',
    Publicaciones: 'publicaciones',
    Nosotros: 'nosotros',
    Contacto: 'contacto',
  };
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + i * 0.07, duration: 0.65, ease: SILK }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => {
        onClose();
        const target = anchorMap[label];
        if (target) {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }}
      data-c="ir"
      style={{
        listStyle: 'none',
        borderBottom: `1px solid ${hov ? T.brand + '66' : 'rgba(2,83,126,0.18)'}`,
        padding: 'clamp(10px,1.6vh,18px) 0',
        cursor: 'pointer',
        transition: 'border-color 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
        {/* number */}
        <span style={{
          fontFamily: '"DM Mono",monospace', fontSize: 10,
          color: hov ? T.cyan : T.brand + '88',
          transition: 'color 0.3s', minWidth: 26, flexShrink: 0,
        }}>{n}</span>

        {/* label */}
        <motion.span
          animate={{ x: hov ? 10 : 0 }}
          transition={{ duration: 0.35, ease: SILK }}
          style={{
            fontFamily: '"Cormorant Garamond",serif',
            fontWeight: 600,
            fontSize: 'clamp(36px,5.8vw,80px)',
            lineHeight: 0.95, letterSpacing: '-0.02em',
            color: hov ? T.cyan : T.white,
            transition: 'color 0.3s',
            display: 'block',
          }}
        >{label}</motion.span>

        {/* sub — desktop only */}
        <AnimatePresence>
          {hov && (
            <motion.span
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="menu-sub"
              style={{
                fontFamily: '"DM Sans",sans-serif', fontSize: 11,
                color: T.muted, textTransform: 'uppercase',
                letterSpacing: '0.16em', alignSelf: 'flex-end', paddingBottom: 8,
              }}
            >{sub}</motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
};

const Menu = ({ onClose }) => (
  <motion.div
    initial={{ clipPath: 'inset(0 0 100% 0)' }}
    animate={{ clipPath: 'inset(0 0 0% 0)' }}
    exit={{ clipPath: 'inset(0 0 100% 0)' }}
    transition={{ duration: 0.75, ease: EXPO }}
    style={{
      /* ← covers EVERYTHING — position:fixed + inset:0 + high zIndex */
      position: 'fixed', inset: 0, zIndex: 500,
      background: T.bg,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    {/* noise */}
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.025,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '220px 220px',
    }} />

    {/* brand glow */}
    <div style={{
      position: 'absolute', right: '-10%', top: '-10%',
      width: '50vw', height: '60vh', pointerEvents: 'none', zIndex: 0,
      background: `radial-gradient(ellipse, ${T.brand}22 0%, transparent 65%)`,
    }} />

    {/* ── TOP BAR: logo left + close right ── */}
    <div style={{
      position: 'relative', zIndex: 2, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 72,
      padding: '0 clamp(20px,5vw,80px)',
      borderBottom: `1px solid rgba(2,83,126,0.15)`,
    }}>
      <motion.div
        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: SILK }}
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <img src={logoLaeq} alt="LAEQ"
          style={{
            height: 44, width: 'auto', objectFit: 'contain',
            filter: `drop-shadow(0 0 12px ${T.cyan}55)`,
            display: 'block',
          }}
        />
        <div>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: 13, color: T.white, margin: 0 }}>
            LAEQ & Asociados
          </p>
          <p style={{ fontFamily: '"DM Mono",monospace', fontSize: 8.5, color: T.active + '77', margin: 0, textTransform: 'uppercase', letterSpacing: '0.24em' }}>
            Mercados Energéticos
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        onClick={onClose} data-c="cerrar"
        style={{
          background: 'none', border: `1px solid rgba(30,184,240,0.2)`,
          width: 52, height: 52, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'border-color 0.3s, background 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.background = T.cyan + '14'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(30,184,240,0.2)'; e.currentTarget.style.background = 'none'; }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke={T.cyan} strokeWidth="1.3">
          <path d="M1 1l13 13M14 1L1 14" />
        </svg>
      </motion.button>
    </div>

    {/* ── CONTENT: links + right panel ── */}
    <div style={{
      flex: 1, position: 'relative', zIndex: 1,
      display: 'flex', overflow: 'hidden',
    }}>
      {/* Links */}
      <div style={{
        flex: 1,
        padding: 'clamp(24px,4vh,52px) clamp(20px,5vw,80px)',
        display: 'flex', alignItems: 'center',
        overflowY: 'auto',
      }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%' }}>
          {NAV.map((l, i) => (
            <MenuLink key={l.label} {...l} i={i} onClose={onClose} />
          ))}
        </ul>
      </div>

      {/* Right panel — desktop only */}
      <div className="menu-right" style={{
        width: '32%', flexShrink: 0,
        position: 'relative', overflow: 'hidden',
        borderLeft: `1px solid rgba(2,83,126,0.15)`,
      }}>
        <img src={bgInfra} alt=""
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: 'center 40%',
            filter: `grayscale(25%) brightness(0.28) contrast(1.15)`,
            display: 'block',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(90deg, ${T.bg} 0%, transparent 35%, ${T.bg}44 100%)`,
        }} />

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: SILK }}
          style={{
            position: 'absolute', bottom: 40, left: 28, right: 28,
          }}
        >
          <div style={{
            width: 32, height: 1,
            background: T.cyan, marginBottom: 14,
          }} />
          <p style={{
            fontFamily: '"Cormorant Garamond",serif', fontStyle: 'italic',
            fontSize: 16, color: T.white + 'AA', margin: 0, lineHeight: 1.5,
          }}>
            "Desarrollamos soluciones estratégicas para el mercado energético peruano."
          </p>
          <span style={{
            fontFamily: '"DM Mono",monospace', fontSize: 9,
            color: T.active + '66', textTransform: 'uppercase', letterSpacing: '0.2em',
            display: 'block', marginTop: 10,
          }}>Luis A. Espinoza Quiñones</span>
        </motion.div>
      </div>
    </div>

    {/* ── FOOTER strip ── */}
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={{
        position: 'relative', zIndex: 2, flexShrink: 0,
        padding: '16px clamp(20px,5vw,80px)',
        borderTop: `1px solid rgba(2,83,126,0.15)`,
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between', alignItems: 'center', gap: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 24 }}>
        {['LinkedIn', 'Twitter', 'laeqasociados.com'].map(s => (
          <span key={s} data-c=""
            style={{
              fontFamily: '"DM Sans",sans-serif', fontSize: 10,
              color: T.muted, opacity: 0.5,
              textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer',
              transition: 'opacity 0.25s, color 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = T.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = T.muted; }}
          >{s}</span>
        ))}
      </div>
      <span style={{
        fontFamily: '"DM Mono",monospace', fontSize: 9,
        color: T.active + '55', letterSpacing: '0.16em',
      }}>Lima, Perú · Est. 2000</span>
    </motion.div>
  </motion.div>
);

/* ══════════════════ MINIMAL HEADER ══════════════════ */
const Header = ({ menuOpen, onToggle }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: SILK }}
      style={{
        /* z:80 — visible over hero, but BELOW menu (z:500) */
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80,
        height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px,5vw,80px)',
        background: scrolled
          ? 'rgba(2,12,24,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(22px) saturate(1.5)' : 'none',
        borderBottom: scrolled ? `1px solid rgba(2,83,126,0.15)` : '1px solid transparent',
        transition: 'background 0.5s, border-color 0.5s, backdrop-filter 0.5s',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <img src={logoLaeq} alt="LAEQ"
          style={{
            height: 44, width: 'auto', objectFit: 'contain',
            filter: `drop-shadow(0 0 10px ${T.cyan}44)`,
          }}
        />
        <div>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: 12.5, color: T.white, margin: 0, lineHeight: 1.25 }}>
            LAEQ & Asociados
          </p>
          <p style={{ fontFamily: '"DM Mono",monospace', fontSize: 8.5, color: T.active + '77', margin: 0, textTransform: 'uppercase', letterSpacing: '0.24em' }}>
            Mercados Energéticos
          </p>
        </div>
      </div>

      {/* Right: menu toggle only */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

        {/* CTA — hidden on small screens */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          data-c="consulta"
          className="hdr-cta"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 22px',
            background: 'transparent',
            border: `1px solid ${T.brand}`,
            cursor: 'pointer',
            fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
            fontSize: 10.5, color: T.cyan,
            textTransform: 'uppercase', letterSpacing: '0.22em',
            transition: 'all 0.28s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.cyan; e.currentTarget.style.color = T.bg; e.currentTarget.style.borderColor = T.cyan; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.cyan; e.currentTarget.style.borderColor = T.brand; }}
        >
          Consulta
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Hamburger — always visible */}
        <button
          onClick={onToggle} data-c="menú"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 5,
            padding: '4px 0', minWidth: 28,
          }}
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
            transition={{ duration: 0.35, ease: EXPO }}
            style={{ display: 'block', height: 1.5, width: 26, background: T.cyan, transformOrigin: 'center' }}
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 0.6 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'block', height: 1.5, width: 26, background: T.cyan, transformOrigin: 'left' }}
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
            transition={{ duration: 0.35, ease: EXPO }}
            style={{ display: 'block', height: 1.5, width: 26, background: T.cyan, transformOrigin: 'center' }}
          />
        </button>
      </div>
    </motion.header>
  );
};

/* ══════════════════ PARTICLES ══════════════════ */
const Particles = () => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
    {Array.from({ length: 16 }).map((_, i) => {
      const size = 1 + Math.random() * 2.2;
      return (
        <motion.div key={i}
          animate={{ y: [0, -(70 + Math.random() * 90)], x: [0, -24 + Math.random() * 48], opacity: [0, 0.5, 0] }}
          transition={{ duration: 5 + Math.random() * 7, delay: Math.random() * 5, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: size, height: size, borderRadius: '50%',
            background: [T.cyan, T.active, T.brand][i % 3],
            boxShadow: `0 0 ${size * 3}px ${[T.cyan, T.active, T.brand][i % 3]}`,
          }}
        />
      );
    })}
  </div>
);

/* ══════════════════ STAT ══════════════════ */
const Stat = ({ val, suf, label, delay }) => {
  const n = useCounter(val, 1.8, delay);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: SILK }}
      style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', lineHeight: 1, gap: 2 }}>
        <span style={{
          fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
          fontSize: 'clamp(30px,3.8vw,50px)', color: T.cyan, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>{n}</span>
        <span style={{
          fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
          fontSize: 'clamp(20px,2.6vw,34px)', color: T.active + 'BB', lineHeight: 1, marginBottom: 4,
        }}>{suf}</span>
      </div>
      <span style={{
        fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: T.muted,
        textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.4, whiteSpace: 'pre-line',
      }}>{label}</span>
    </motion.div>
  );
};

/* ══════════════════ ROTATING BADGE ══════════════════ */
const Badge = () => (
  <div style={{ width: 112, height: 112, position: 'relative' }}>
    <motion.svg
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
      viewBox="0 0 112 112" fill="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <defs><path id="bp" d="M 56 56 m -40 0 a 40 40 0 1 1 80 0 a 40 40 0 1 1 -80 0" /></defs>
      <text fill={T.active + 'CC'} fontSize="7.2" fontFamily="DM Mono,monospace" letterSpacing="3.1">
        <textPath href="#bp">10+ AÑOS EXPERIENCIA · LAEQ · PERÚ ·</textPath>
      </text>
    </motion.svg>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: 30, color: T.cyan, lineHeight: 1, textShadow: `0 0 20px ${T.cyan}66` }}>10</span>
      <span style={{ fontFamily: '"DM Mono",monospace', fontSize: 7.5, color: T.active + '88', textTransform: 'uppercase', letterSpacing: '0.18em' }}>años+</span>
    </div>
  </div>
);

/* ══════════════════ MARQUEE ══════════════════ */
const CL = ['ENGIE Perú', 'PETROPERÚ', 'MINEM', 'Osinergmin', 'Electroperú', 'Luz del Sur', 'Cálidda', 'ProInversión', 'GN Fenosa'];
const Marquee = () => {
  const all = [...CL, ...CL, ...CL, ...CL];
  return (
    <div style={{ overflow: 'hidden', background: T.bgMid, borderTop: `1px solid rgba(2,83,126,0.18)`, padding: '13px 0' }}>
      <div style={{ display: 'flex', animation: 'marquee 28s linear infinite', width: 'max-content' }}>
        {all.map((c, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 16, padding: '0 18px',
            fontFamily: '"DM Mono",monospace', fontSize: 9.5,
            color: 'rgba(184,223,240,0.22)',
            textTransform: 'uppercase', letterSpacing: '0.2em', whiteSpace: 'nowrap',
          }}>
            {c}
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.brand + '99', display: 'inline-block' }} />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════ HERO SECTION ══════════════════ */
const STATS = [
  { val: 10,  suf: '+', label: 'Años de\nexperiencia',      delay: 1.5  },
  { val: 95,  suf: '%', label: 'Tasa de\néxito',            delay: 1.65 },
  { val: 10,  suf: '+', label: 'Proyectos\nejecutados',      delay: 1.8  },
  { val: 500, suf: '+', label: 'Profesionales\ncapacitados', delay: 1.95 },
];

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY  = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <section ref={ref} style={{
      position: 'relative', height: '100dvh', minHeight: 700,
      width: '100%', overflow: 'hidden', background: T.bg,
    }}>
      <Particles />

      {/* Grid energy texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        backgroundImage: `url(${bgGrid})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.055, mixBlendMode: 'screen',
      }} />

      {/* Brand glow */}
      <div style={{
        position: 'absolute', left: '-8%', top: '20%',
        width: '55vw', height: '70vh', zIndex: 2, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 30% 50%, ${T.brand}18 0%, transparent 58%)`,
      }} />

      {/* Content fades */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        background: `linear-gradient(108deg, ${T.bg} 43%, rgba(2,12,24,0.88) 57%, rgba(2,12,24,0.06) 76%, transparent 100%)`,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '36%', zIndex: 3,
        background: `linear-gradient(to top, ${T.bg} 0%, transparent 100%)`,
      }} />

      {/* Ghost word */}
      <div aria-hidden style={{
        position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-48%)',
        zIndex: 2, pointerEvents: 'none', userSelect: 'none',
        fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontStyle: 'italic',
        fontSize: 'clamp(160px,26vw,380px)', lineHeight: 1,
        color: 'transparent', WebkitTextStroke: `1px ${T.brand}18`,
        letterSpacing: '-0.04em',
      }}>ENERGÍA</div>

      {/* RIGHT image panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '53%',
        zIndex: 1,
        clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)',
        overflow: 'hidden',
      }}>
        <motion.div style={{ y: imgY, height: '120%', width: '100%', position: 'absolute', top: '-10%' }}>
          <motion.img
            src={bgInfra} alt=""
            initial={{ scale: 1.1 }} animate={{ scale: 1 }}
            transition={{ duration: 22, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 38%',
              filter: 'grayscale(15%) brightness(0.46) contrast(1.22) saturate(0.7)',
              display: 'block',
            }}
          />
        </motion.div>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(96deg, ${T.bg}CC 0%, ${T.bg}44 30%, transparent 55%)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, ${T.brand}14 0%, transparent 40%, ${T.bg}55 100%)`,
          mixBlendMode: 'multiply',
        }} />

        {/* Rotating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 2.1, duration: 1, ease: SILK }}
          style={{ position: 'absolute', bottom: '22%', left: '16%', zIndex: 5 }}
        >
          <Badge />
        </motion.div>

        {/* Side label */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          style={{ position: 'absolute', bottom: '10%', right: 24, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
        >
          <div style={{ width: 1, height: 50, background: T.active + '44' }} />
          <span style={{
            fontFamily: '"DM Mono",monospace', fontSize: 8,
            color: 'rgba(184,223,240,0.28)',
            textTransform: 'uppercase', letterSpacing: '0.24em', writingMode: 'vertical-rl',
          }}>SEIN · Lima · Perú</span>
        </motion.div>
      </div>

      {/* ════ MAIN CONTENT ════ */}
      <motion.div style={{
        position: 'relative', zIndex: 10, height: '100%', y: textY,
        display: 'flex', flexDirection: 'column',
        padding: '0 clamp(20px,5vw,80px)',
        maxWidth: '120rem', margin: '0 auto', boxSizing: 'border-box',
      }}>
        {/* Header spacer */}
        <div style={{ height: 70, flexShrink: 0 }} />

        {/* Credential pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.7, ease: SILK }}
          style={{ paddingTop: 'clamp(16px,3vh,40px)' }}
        >
          <div data-c="perfil" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            border: `1px solid ${T.brand}55`, padding: '8px 16px 8px 10px',
            transition: 'border-color .3s', cursor: 'default',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = T.cyan + '77'}
          onMouseLeave={e => e.currentTarget.style.borderColor = T.brand + '55'}
          >
            <span style={{
              fontFamily: '"DM Mono",monospace', fontSize: 8,
              background: T.brand, color: T.white,
              padding: '4px 9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
            }}>EX VICEMINISTRO</span>
            <span style={{
              fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: T.muted, letterSpacing: '0.1em',
            }}>Luis A. Espinoza Quiñones · Ing. Mec. Elec. UNI · MBA ESAN</span>
          </div>
        </motion.div>

        {/* Headline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ maxWidth: '60%' }}>
            {[
              { text: 'Estrategia',  color: T.white,              italic: false, delay: 0.52 },
              { text: 'Energética',  color: T.cyan,               italic: true,  delay: 0.70 },
              { text: 'de Élite.',   color: 'rgba(184,223,240,0.2)', italic: false, delay: 0.88 },
            ].map(({ text, color, italic, delay }) => (
              <div key={text} style={{ overflow: 'hidden', lineHeight: 0.88 }}>
                <motion.h1
                  initial={{ y: '115%' }} animate={{ y: 0 }}
                  transition={{ duration: 1.18, delay, ease: SILK }}
                  style={{
                    fontFamily: '"Cormorant Garamond",serif', fontWeight: 700,
                    fontSize: 'clamp(52px,9.2vw,130px)', lineHeight: 0.92, margin: 0,
                    letterSpacing: '-0.025em', color, fontStyle: italic ? 'italic' : 'normal',
                  }}
                >{text}</motion.h1>
              </div>
            ))}

            {/* Description + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.9, ease: SILK }}
              style={{ marginTop: 'clamp(20px,3.2vw,42px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}
            >
              <p style={{
                fontFamily: '"DM Sans",sans-serif', fontWeight: 300,
                fontSize: 'clamp(13.5px,1.15vw,16.5px)',
                color: T.muted, lineHeight: 1.8, maxWidth: 355, margin: 0,
              }}>
                Regulación, contratos PPA y energía renovable para generadoras,
                distribuidoras e instituciones del sector energético peruano.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  data-c="ver"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 30px', background: T.cyan, border: 'none', cursor: 'pointer',
                    fontFamily: '"DM Sans",sans-serif', fontWeight: 600,
                    fontSize: 10.5, color: T.bg,
                    textTransform: 'uppercase', letterSpacing: '0.2em', transition: 'background .28s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.white}
                  onMouseLeave={e => e.currentTarget.style.background = T.cyan}
                >
                  Ver Servicios
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  data-c=""
                  style={{
                    padding: '13px 26px', background: 'transparent',
                    border: `1px solid ${T.brand}`, cursor: 'pointer',
                    fontFamily: '"DM Sans",sans-serif', fontWeight: 400,
                    fontSize: 10.5, color: T.muted,
                    textTransform: 'uppercase', letterSpacing: '0.2em', transition: 'all .28s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.brand; e.currentTarget.style.color = T.muted; }}
                >Conócenos</motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ paddingBottom: 'clamp(14px,2.5vh,26px)' }}>
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.35, duration: 1.3, ease: SILK }}
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${T.active}88 0%, ${T.active}22 50%, transparent 100%)`,
              marginBottom: 20, transformOrigin: 'left',
            }}
          />
          <div style={{ display: 'flex', gap: 'clamp(18px,4vw,50px)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                <Stat {...s} />
                {i < STATS.length - 1 && (
                  <div style={{ width: 1, height: 34, alignSelf: 'center', background: `rgba(10,143,199,0.12)`, flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}
              style={{ marginLeft: 'auto', textAlign: 'right' }}
            >
              <span style={{
                fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontStyle: 'italic',
                fontSize: 'clamp(24px,3.2vw,42px)', color: `${T.brand}22`, letterSpacing: '-0.04em',
              }}>2000</span>
              <p style={{
                fontFamily: '"DM Mono",monospace', fontSize: 8.5,
                color: `rgba(184,223,240,0.2)`, margin: 0,
                textTransform: 'uppercase', letterSpacing: '0.22em',
              }}>Fundación</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        style={{
          position: 'absolute', right: 'clamp(18px,2.5vw,40px)', top: '50%', transform: 'translateY(-50%)',
          zIndex: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}
      >
        <span style={{
          fontFamily: '"DM Mono",monospace', fontSize: 8, color: 'rgba(184,223,240,0.25)',
          textTransform: 'uppercase', letterSpacing: '0.3em', writingMode: 'vertical-rl',
        }}>Explorar</span>
        <div style={{ width: 1, height: 64, background: T.active + '18', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            style={{ position: 'absolute', inset: '0 0 auto 0', height: '42%', background: `linear-gradient(to bottom, transparent, ${T.cyan})` }}
          />
        </div>
      </motion.div>
    </section>
  );
};

/* ══════════════════ ROOT ══════════════════ */
const Hero = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <Cursor />

      {/*
        LAYER ORDER (highest zIndex wins):
        ─ cursor          z:9000/9001
        ─ menu fullscreen z:500   ← covers header
        ─ header          z:80    ← visible when menu closed
        ─ hero            z:1-10
      */}

      {/* Header — z:80 */}
      <Header menuOpen={menuOpen} onToggle={() => setMenuOpen(p => !p)} />

      {/* Menu — z:500, mounts/unmounts with AnimatePresence */}
      <AnimatePresence>
        {menuOpen && <Menu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>

      {/* Hero */}
      <HeroSection />

      {/* Marquee */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
        <Marquee />
      </motion.div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        body { cursor: none; margin: 0; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.3;transform:scale(0.72);} }
        .hdr-cta   { display: flex !important; }
        .menu-right { display: block !important; }
        .menu-sub   { display: block !important; }
        @media (max-width: 860px) {
          .hdr-cta    { display: none !important; }
          .menu-right { display: none !important; }
          .menu-sub   { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Hero;
