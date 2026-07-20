import { useState } from 'react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { validateEmail } from '@/services/security';
import { AuthCard, AuthInput, AuthLayout, AuthNotice } from '../components';
import { authService } from '../services/authService';

type ForgotPasswordValues = { email: string };

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ mode: 'onChange' });
  const onSubmit = async (values: ForgotPasswordValues) => {
    setSubmitError('');
    try {
      await authService.requestPasswordReset(values.email);
      setSent(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not send the reset email. Please try again.',
      );
    }
  };
  return (
    <AuthLayout>
      <AuthCard
        title="Reset your password"
        description="Enter the email linked to your account and we will send a secure reset link."
      >
        {sent ? (
          <>
            <AuthNotice type="success">
              If an account exists for that email, a secure reset link is on its
              way.
            </AuthNotice>
            <Link to="/sign-in">
              <Button
                variant="secondary"
                className="w-full"
                leftIcon={<ArrowLeft size={16} />}
              >
                Back to sign in
              </Button>
            </Link>
          </>
        ) : (
          <>
            {submitError && <AuthNotice type="error">{submitError}</AuthNotice>}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <AuthInput
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Enter your email address.',
                  validate: validateEmail,
                })}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
              </Button>
            </form>
            <Link
              to="/sign-in"
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-md text-xs font-bold text-muted transition-colors hover:text-brand-dark"
            >
              <ArrowLeft size={15} />
              Back to sign in
            </Link>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
