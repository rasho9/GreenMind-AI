import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CloudOff,
  Gauge,
  ShieldAlert,
  ServerCrash,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui';

function ErrorPage({
  icon: Icon,
  code,
  title,
  description,
  retry,
}: {
  icon: LucideIcon;
  code: string;
  title: string;
  description: string;
  retry?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-5 py-12">
      <section className="w-full max-w-xl rounded-[28px] border border-line bg-surface p-7 text-center shadow-elevated sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-[18px] bg-brand-soft text-brand">
          <Icon size={27} />
        </span>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
          Error {code}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-ink">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          {description}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {retry && (
            <Button onClick={() => window.location.reload()}>Try again</Button>
          )}
          <Button
            variant={retry ? 'secondary' : 'primary'}
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft size={16} />}
          >
            Return to dashboard
          </Button>
        </div>
        <Link
          to="/help"
          className="focus-ring mt-6 inline-block rounded text-xs font-bold text-brand hover:text-brand-dark"
        >
          Visit Help Center
        </Link>
      </section>
    </main>
  );
}
export const ForbiddenPage = () => (
  <ErrorPage
    icon={ShieldAlert}
    code="403"
    title="This area is protected"
    description="Your current role does not have permission to open this resource. Contact an administrator if you believe this is incorrect."
  />
);
export const RateLimitedPage = () => (
  <ErrorPage
    icon={Gauge}
    code="429"
    title="Let’s pause for a moment"
    description="Too many requests were received. Wait briefly, then try again. This protects your account and our shared AI services."
    retry
  />
);
export const ServerErrorPage = () => (
  <ErrorPage
    icon={ServerCrash}
    code="500"
    title="We could not complete that securely"
    description="The service encountered an unexpected issue. No action was completed; please try again shortly."
    retry
  />
);
export const OfflinePage = () => (
  <ErrorPage
    icon={CloudOff}
    code="Offline"
    title="You are currently offline"
    description="Reconnect to continue syncing your garden workspace. Your unsent changes remain on this device for this session."
    retry
  />
);
export const NetworkErrorPage = () => (
  <ErrorPage
    icon={AlertTriangle}
    code="Network"
    title="We could not reach GreenMind"
    description="Your request was not completed. Check your connection, then try again—no changes were sent while the network was unavailable."
    retry
  />
);
export const GenericErrorPage = () => (
  <ErrorPage
    icon={AlertTriangle}
    code="Error"
    title="Something needs attention"
    description="We could not complete that request. Please retry or return to your dashboard."
    retry
  />
);
