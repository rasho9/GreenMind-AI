import { Github } from 'lucide-react';

function GoogleMark() {
  return (
    <span
      className="grid size-4 place-items-center rounded-full bg-white text-[11px] font-extrabold text-[#4285f4] shadow-sm"
      aria-hidden="true"
    >
      G
    </span>
  );
}

export function SocialLoginButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-xs font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
        aria-label="Continue with Google"
      >
        <GoogleMark />
        Google
      </button>
      <button
        type="button"
        className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-xs font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
        aria-label="Continue with GitHub"
      >
        <Github size={16} />
        GitHub
      </button>
    </div>
  );
}
