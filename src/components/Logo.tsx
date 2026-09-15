interface LogoProps {
  light?: boolean;
  onClick?: () => void;
}

function LogoContent({ light = false }: LogoProps) {
  return (
    <>
      <span className="xabi-logo-mark">
        <span />
        <span />
        <span />
      </span>
      <span className={`text-lg font-semibold tracking-[-0.04em] ${light ? 'text-white' : 'text-slate-950'}`}>
        Xabi World
      </span>
    </>
  );
}

export function Logo({ light = false, onClick }: LogoProps) {
  if (onClick) {
    return (
      <button className="flex items-center gap-3" onClick={onClick} type="button">
        <LogoContent light={light} />
      </button>
    );
  }

  return <div className="flex items-center gap-3"><LogoContent light={light} /></div>;
}
