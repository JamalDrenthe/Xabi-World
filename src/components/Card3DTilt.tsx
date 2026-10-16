import { useState, useRef, type ReactNode } from 'react';

interface Card3DTiltProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export function Card3DTilt({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    const rotateX = -yPct * maxTilt;
    const rotateY = xPct * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });

    if (glare) {
      setGlareStyle({
        opacity: 0.18,
        background: `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`,
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease-out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative transform-gpu will-change-transform ${className}`}
    >
      {children}
      {glare && (
        <div
          style={glareStyle}
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] overflow-hidden mix-blend-overlay transition-opacity"
        />
      )}
    </div>
  );
}
