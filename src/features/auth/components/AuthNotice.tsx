import type { ReactNode } from 'react';
import { CheckCircle2, CircleAlert } from 'lucide-react';

export function AuthNotice({
  type,
  children,
}: {
  type: 'success' | 'error';
  children: ReactNode;
}) {
  const isSuccess = type === 'success';
  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      className={`mb-5 flex gap-2.5 rounded-xl border px-3.5 py-3 text-xs leading-5 ${isSuccess ? 'border-[#b9dfc6] bg-[#edf8f0] text-[#286a42]' : 'border-[#f0c2bd] bg-[#fff4f3] text-[#a8443c]'}`}
    >
      {isSuccess ? (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
      ) : (
        <CircleAlert size={16} className="mt-0.5 shrink-0" />
      )}
      <span>{children}</span>
    </div>
  );
}
