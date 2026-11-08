import React, { useRef, useState, useCallback, useEffect } from 'react';

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  borderGlow?: boolean;
  onClick?: () => void;
}

export const Card3DTilt: React.FC<Card3DTiltProps> = ({
  children,
  className = '',
  maxTilt = 9,
  scale = 1.025,
  glare = true,
  borderGlow = true,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [borderStyle, setBorderStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.08s ease-out'
    });

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.38,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(245, 207, 126, 0.35) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 68%)`,
        transition: 'opacity 0.15s ease'
      });
    }

    if (borderGlow) {
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
      setBorderStyle({
        background: `linear-gradient(${angle}deg, rgba(215, 166, 74, 0.7) 0%, rgba(74, 16, 32, 0.2) 50%, rgba(215, 166, 74, 0.2) 100%)`
      });
    }
  }, [isReducedMotion, maxTilt, scale, glare, borderGlow]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.4s ease'
    });
    setBorderStyle({});
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      className={`relative rounded-2xl transition-shadow duration-300 ${
        isHovered ? 'shadow-[0_20px_40px_-15px_rgba(215,166,74,0.22)]' : 'shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)]'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* 3D Border Glow Highlight */}
      {borderGlow && (
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl z-0 opacity-40 transition-opacity duration-300"
          style={borderStyle}
          aria-hidden="true"
        />
      )}

      {/* Preserve 3D Inner Content */}
      <div className="relative z-10 w-full h-full rounded-2xl preserve-3d">
        {children}
      </div>

      {/* 3D Specular Glare Layer */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-20"
          style={glareStyle}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
