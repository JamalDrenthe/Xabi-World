import { useEffect, useRef } from 'react';

interface MotionCanvas3DProps {
  className?: string;
  particleCount?: number;
  radius?: number;
  interactive?: boolean;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  color: string;
}

export function MotionCanvas3D({
  className = '',
  particleCount = 140,
  radius = 180,
  interactive = true,
}: MotionCanvas3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const pulseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palette matching Xabi emerald, lime, and cyan glow
    const colors = ['#2ead4b', '#9fe870', '#34d399', '#10b981', '#a7f3d0'];

    // Fibonacci sphere distribution
    const points: Point3D[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < particleCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const r = radius * (0.88 + Math.random() * 0.24);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 2.2 + 1.2,
        color: colors[i % colors.length],
      });
    }

    let angleX = 0.003;
    let angleY = 0.005;
    let time = 0;

    const render = () => {
      time += 0.016;
      pulseRef.current = Math.sin(time * 2) * 0.08 + 1;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 420;

      // Rotation angles including mouse tilt
      const rotY = angleY + mouseRef.current.x * 0.0008;
      const rotX = angleX - mouseRef.current.y * 0.0008;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Rotate points
      for (const p of points) {
        // Y rotation
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // X rotation
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;
      }

      // Sort points by z for proper depth rendering
      const sorted = [...points].sort((a, b) => b.z - a.z);

      // Draw dynamic connecting lines between close points
      ctx.lineWidth = 0.75;
      for (let i = 0; i < sorted.length; i++) {
        const p1 = sorted[i];
        const scale1 = fov / (fov + p1.z);
        if (scale1 <= 0) continue;
        const x2d1 = centerX + p1.x * scale1;
        const y2d1 = centerY + p1.y * scale1;

        // Connect only to nearest neighbors to keep performance silky
        for (let j = i + 1; j < Math.min(i + 7, sorted.length); j++) {
          const p2 = sorted[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 72) {
            const scale2 = fov / (fov + p2.z);
            const x2d2 = centerX + p2.x * scale2;
            const y2d2 = centerY + p2.y * scale2;

            const alpha = (1 - dist / 72) * Math.min(scale1, scale2) * 0.35;
            ctx.strokeStyle = `rgba(46, 173, 75, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(x2d1, y2d1);
            ctx.lineTo(x2d2, y2d2);
            ctx.stroke();
          }
        }
      }

      // Draw particle points
      for (const p of sorted) {
        const scale = fov / (fov + p.z);
        if (scale <= 0) continue;

        const x2d = centerX + p.x * scale;
        const y2d = centerY + p.y * scale;
        const alpha = Math.max(0.15, Math.min(1, (p.z + radius) / (2 * radius)));
        const renderSize = p.size * scale * (p.z > 0 ? 1.2 : 0.85);

        // Glow
        if (p.z > 0) {
          const glowGrad = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, renderSize * 3);
          glowGrad.addColorStop(0, `rgba(159, 232, 112, ${alpha * 0.45})`);
          glowGrad.addColorStop(1, 'rgba(46, 173, 75, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(x2d, y2d, renderSize * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x2d, y2d, renderSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw central orbital ring
      const ringScale = fov / (fov + 20);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, 0.28);
      ctx.rotate(time * 0.2);
      ctx.strokeStyle = 'rgba(159, 232, 112, 0.16)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, (radius * 1.22) * ringScale * pulseRef.current, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, radius]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.targetX = e.clientX - rect.left - rect.width / 2;
    mouseRef.current.targetY = e.clientY - rect.top - rect.height / 2;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center overflow-hidden pointer-events-auto ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Ambient background glow behind 3D sphere */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      </div>
    </div>
  );
}
