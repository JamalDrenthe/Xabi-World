import { useEffect, useState, useRef, type ReactNode } from 'react';

/**
 * Global Scroll Progress Bar displayed at the top of the viewport
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-[#9fe870] to-emerald-400 shadow-[0_0_12px_rgba(159,232,112,0.8)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in';
  delay?: number; // milliseconds
  threshold?: number;
}

/**
 * Scroll Reveal component using IntersectionObserver for scroll-triggered entrance animations
 */
export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.05,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setIsVisible(true);
      return;
    }

    // Immediately show if already within or near viewport
    if (typeof window !== 'undefined') {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight + 120 && rect.bottom > -120) {
        setIsVisible(true);
        return;
      }
    }

    // Safety fallback timer so content is never stuck in opacity-0
    const safetyTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 450);

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
          window.clearTimeout(safetyTimer);
        }
      },
      { threshold: Math.min(0.1, threshold), rootMargin: '80px 0px 80px 0px' }
    );

    observer.observe(element);

    return () => {
      window.clearTimeout(safetyTimer);
      if (element) observer.unobserve(element);
    };
  }, [threshold]);

  const getAnimationClasses = () => {
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return 'opacity-0 translate-y-8';
        case 'slide-left':
          return 'opacity-0 -translate-x-10';
        case 'slide-right':
          return 'opacity-0 translate-x-10';
        case 'zoom-in':
          return 'opacity-0 scale-95';
        case 'fade-in':
        default:
          return 'opacity-0';
      }
    }
    return 'opacity-100 translate-y-0 translate-x-0 scale-100';
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  );
}

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

/**
 * Animated number counter triggered when scrolled into view
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1800,
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setHasStarted(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && rect.bottom > 0) {
        setHasStarted(true);
        return;
      }
    }

    const safetyTimer = window.setTimeout(() => {
      setHasStarted(true);
    }, 600);

    if (typeof IntersectionObserver === 'undefined') {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
          window.clearTimeout(safetyTimer);
        }
      },
      { threshold: 0.05, rootMargin: '60px 0px 60px 0px' }
    );

    observer.observe(element);
    return () => {
      window.clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(easeProgress * value);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, value, duration]);

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString('nl-NL');

  return (
    <span ref={ref} className="font-tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
