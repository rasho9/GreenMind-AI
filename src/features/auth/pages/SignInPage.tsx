import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { validateEmail } from '@/services/security';
import {
  AuthCard,
  AuthDivider,
  AuthInput,
  AuthLayout,
  AuthNotice,
  PasswordInput,
  SocialLoginButtons,
} from '../components';
import { useAuthStore } from '../store/useAuthStore';

type SignInValues = { email: string; password: string; remember: boolean };

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((state) => state.signIn);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    mode: 'onChange',
    defaultValues: { remember: true },
  });
  const onSubmit = async (values: SignInValues) => {
    setSubmitError('');
    try {
      await signIn(values);
      navigate(
        (location.state as { from?: string } | null)?.from ?? '/dashboard',
        { replace: true },
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not sign you in. Please try again.',
      );
    }
  };
  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Sign in to keep growing with GreenMind AI."
      >
        {submitError && <AuthNotice type="error">{submitError}</AuthNotice>}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
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
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Enter your password.',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters.',
              },
            })}
          />
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-muted">
              <input
                type="checkbox"
                className="size-4 rounded border-line text-brand focus:ring-brand"
                {...register('remember')}
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="focus-ring rounded-md text-xs font-bold text-brand transition-colors hover:text-brand-dark"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting && (
              <LoaderCircle size={16} className="animate-spin" />
            )}
            {isSubmitting ? 'Signing you in...' : 'Sign in'}
          </Button>
        </form>
        <AuthDivider />
        <SocialLoginButtons />
        <p className="mt-6 text-center text-xs text-muted">
          New to GreenMind?{' '}
          <Link
            to="/sign-up"
            className="focus-ring rounded-md font-bold text-brand hover:text-brand-dark"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
