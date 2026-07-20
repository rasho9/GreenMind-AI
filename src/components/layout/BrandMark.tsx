export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-10 place-items-center overflow-hidden rounded-[14px] bg-brand text-sm font-extrabold text-white shadow-[0_8px_20px_rgb(34_121_81_/_0.22)]">
        <span className="absolute -right-1 -top-1 size-4 rounded-full bg-white/20" />
        G
      </div>
      {!compact && (
        <div>
          <p className="text-[15px] font-extrabold tracking-[-0.055em] text-ink">
            GreenMind AI
          </p>
          <p className="mt-0.5 text-[10px] font-semibold tracking-[0.04em] text-muted">
            Intelligent growing
          </p>
        </div>
      )}
    </div>
  );
}
