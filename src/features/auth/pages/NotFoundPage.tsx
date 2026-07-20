import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { AuthCard, AuthLayout } from '../components';

export function NotFoundPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="This path needs a little tending"
        description="The page you’re looking for may have moved, changed, or never existed."
      >
        <div className="mb-6 grid size-14 place-items-center rounded-[18px] bg-brand-soft text-brand">
          <SearchX size={27} />
        </div>
        <p className="text-sm leading-6 text-muted">
          Let’s get you back to a familiar part of GreenMind AI.
        </p>
        <Link to="/dashboard" className="mt-7 block">
          <Button className="w-full" leftIcon={<ArrowLeft size={16} />}>
            Return to dashboard
          </Button>
        </Link>
      </AuthCard>
    </AuthLayout>
  );
}
