import { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importación correcta
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData = [
  { color: '#060010', title: 'Analytics', description: 'Track user behavior', label: 'Insights' },
  { color: '#060010', title: 'Dashboard', description: 'Centralized data view', label: 'Overview' }
];

// --- Funciones auxiliares de GSAP y Partículas ---
const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `position: absolute; width: 4px; height: 4px; border-radius: 50%; background: rgba(${color}, 1); box-shadow: 0 0 6px rgba(${color}, 0.6); pointer-events: none; z-index: 100; left: ${x}px; top: ${y}px;`;
  return el;
};

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// --- Componente de Tarjeta con Partículas ---
const ParticleCard = ({ children, className = '', disableAnimations = false, style, particleCount = DEFAULT_PARTICLE_COUNT, glowColor = DEFAULT_GLOW_COLOR, enableTilt = true, enableMagnetism = false, onClick }) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () => createParticleElement(Math.random() * width, Math.random() * height, glowColor));
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    particlesRef.current.forEach(p => gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => p.parentNode?.removeChild(p) }));
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();
    memoizedParticles.current.forEach((p, i) => {
      const tId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = p.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(clone, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, repeat: -1, yoyo: true });
      }, i * 100);
      timeoutsRef.current.push(tId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    const el = cardRef.current;
    if (disableAnimations || !el) return;
    const onEnter = () => { isHoveredRef.current = true; animateParticles(); };
    const onLeave = () => { isHoveredRef.current = false; clearAllParticles(); };
    const onMove = e => {
      if (!enableTilt && !enableMagnetism) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left; const y = e.clientY - r.top;
      if (enableTilt) {
        const rX = ((y - (r.height / 2)) / (r.height / 2)) * -10;
        const rY = ((x - (r.width / 2)) / (r.width / 2)) * 10;
        gsap.to(el, { rotateX: rX, rotateY: rY, duration: 0.1, transformPerspective: 1000 });
      }
    };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    return () => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); el.removeEventListener('mousemove', onMove); clearAllParticles(); };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism]);

  return <div ref={cardRef} onClick={onClick} className={`${className} particle-container`} style={{ ...style, position: 'relative', overflow: 'hidden' }}>{children}</div>;
};

// --- Componentes de Apoyo (Spotlight, Grid, Mobile) ---
const GlobalSpotlight = ({ gridRef, disableAnimations, enabled, spotlightRadius, glowColor }) => {
  const spotlightRef = useRef(null);
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const s = document.createElement('div');
    s.className = 'global-spotlight';
    s.style.cssText = `position: fixed; width: 800px; height: 800px; border-radius: 50%; pointer-events: none; background: radial-gradient(circle, rgba(${glowColor}, 0.15) 0%, transparent 70%); z-index: 200; opacity: 0; transform: translate(-50%, -50%); mix-blend-mode: screen;`;
    document.body.appendChild(s);
    spotlightRef.current = s;
    const onMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;
      const rect = gridRef.current.closest('.bento-section')?.getBoundingClientRect();
      if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, opacity: 0.8, duration: 0.1 });
        gridRef.current.querySelectorAll('.magic-bento-card').forEach(c => updateCardGlowProperties(c, e.clientX, e.clientY, 1, spotlightRadius));
      } else { gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 }); }
    };
    document.addEventListener('mousemove', onMove);
    return () => { document.removeEventListener('mousemove', onMove); spotlightRef.current?.remove(); };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);
  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div className="card-grid bento-section" ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>{children}</div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// --- COMPONENTE PRINCIPAL MAGICBENTO ---
const MagicBento = ({
  data = cardData,
  onFavClick,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  showFavButton = true
}) => {
  const gridRef = useRef(null);
  const navigate = useNavigate(); // Hook dentro del componente
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  const dataToRender = data && data.length > 0 ? data : cardData;

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {dataToRender.map((card, index) => {
          const baseClassName = `magic-bento-card ${textAutoHide ? 'magic-bento-card--text-autohide' : ''} ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''}`;

          const cardContent = (
            <>
              <div className="magic-bento-card__header">
                <div className="magic-bento-card__label">{card.label}</div>
                <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
              </div>
              <div className="magic-bento-card__content" style={{ marginTop: 'auto' }}>
                <h2 className="magic-bento-card__title">{card.title}</h2>
                <p className="magic-bento-card__description">{card.description}</p>

                {/* BOTÓN DE FAVORITOS */}
                {showFavButton && (
                  <button
                    className="btn position-absolute bottom-0 end-0 m-3 border-0 bg-transparent"
                    style={{ zIndex: 10, cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onFavClick) onFavClick(card);
                    }}
                  >
                    <i className={`bi ${card.isFavorite ? 'bi-star-fill' : 'bi-star text-white'}`}
                      style={{ fontSize: "1.5rem" }}></i>
                  </button>
                )}
              </div>
            </>
          );

          return (
            <ParticleCard
              key={index}
              className={baseClassName}
              style={{ backgroundColor: card.color || '#060010', '--glow-color': glowColor, cursor: "pointer" }}
              particleCount={particleCount}
              glowColor={glowColor}
              enableTilt={enableTilt}
              enableMagnetism={enableMagnetism}
              disableAnimations={shouldDisableAnimations}
              onClick={() => {
                const type = card.label === "Character" ? "people" : card.label.toLowerCase() + "s";
                navigate(`/details/${type}/${card.uid}`);
              }}
            >
              {cardContent}
            </ParticleCard>
          );
        })}
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;