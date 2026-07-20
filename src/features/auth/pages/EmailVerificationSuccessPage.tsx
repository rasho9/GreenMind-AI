import { Check, MailCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { AuthCard, AuthLayout } from '../components';

export function EmailVerificationSuccessPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Email verified"
        description="Your GreenMind AI account is ready for its first growing season."
      >
        <div className="mb-6 grid size-14 place-items-center rounded-[18px] bg-brand-soft text-brand">
          <div className="relative">
            <MailCheck size={28} />
            <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-brand text-white">
              <Check size={10} strokeWidth={3} />
            </span>
          </div>
        </div>
        <p className="text-sm leading-6 text-muted">
          You can now access your garden workspace and begin building a clearer
          picture of what you grow.
        </p>
        <Link to="/dashboard" className="mt-7 block">
          <Button className="w-full">Go to your garden</Button>
        </Link>
      </AuthCard>
    </AuthLayout>
  );
}
