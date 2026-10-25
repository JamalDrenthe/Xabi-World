interface LogoProps {
  light?: boolean;
  onClick?: () => void;
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XabiLogoMark({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const dim = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-10 w-10' : 'h-7 w-7';
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${dim} shrink-0 select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="xabi-mark-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#142620" />
          <stop offset="50%" stopColor="#0b1714" />
          <stop offset="100%" stopColor="#040807" />
        </linearGradient>

        <linearGradient id="xabi-mark-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9fe870" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2ead4b" stopOpacity="0.15" />
        </linearGradient>

        <linearGradient id="xabi-mark-lime" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b6f788" />
          <stop offset="40%" stopColor="#9fe870" />
          <stop offset="100%" stopColor="#3cb958" />
        </linearGradient>
      </defs>

      {/* Squircle Base matching favicon.svg */}
      <rect
        x="32"
        y="32"
        width="448"
        height="448"
        rx="116"
        fill="url(#xabi-mark-bg)"
        stroke="url(#xabi-mark-stroke)"
        strokeWidth="6"
      />

      {/* The 3 Slanted Lime Bars (Xabi Brand Identity) */}
      <g transform="translate(256, 256) skewX(-22) translate(-256, -256)">
        <rect x="153" y="176" width="46" height="160" rx="23" fill="url(#xabi-mark-lime)" />
        <rect x="233" y="136" width="46" height="240" rx="23" fill="url(#xabi-mark-lime)" />
        <rect x="313" y="193" width="46" height="126" rx="23" fill="url(#xabi-mark-lime)" />
      </g>
    </svg>
  );
}

function LogoContent({ light = false, showWordmark = true, size = 'md' }: LogoProps) {
  return (
    <>
      <XabiLogoMark size={size} />
      {showWordmark && (
        <span
          className={`font-semibold tracking-[-0.03em] ${
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg'
          } ${light ? 'text-white' : 'text-slate-950 dark:text-white'}`}
        >
          Xabi World
        </span>
      )}
    </>
  );
}

export function Logo({
  light = false,
  onClick,
  className = '',
  showWordmark = true,
  size = 'md',
}: LogoProps) {
  if (onClick) {
    return (
      <button
        className={`flex items-center gap-2.5 transition-opacity hover:opacity-90 active:scale-[0.98] ${className}`}
        onClick={onClick}
        type="button"
        aria-label="Xabi World Home"
      >
        <LogoContent light={light} showWordmark={showWordmark} size={size} />
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoContent light={light} showWordmark={showWordmark} size={size} />
    </div>
  );
}
