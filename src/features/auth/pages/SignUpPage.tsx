import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import {
  validateEmail,
  validateSafeText,
  validateStrongPassword,
} from '@/services/security';
import {
  AuthCard,
  AuthDivider,
  AuthInput,
  AuthLayout,
  AuthNotice,
  PasswordInput,
  PasswordStrength,
  SocialLoginButtons,
} from '../components';
import { authService } from '../services/authService';

type SignUpValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUpPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ mode: 'onChange' });
  const password = watch('password', '');
  const onSubmit = async (values: SignUpValues) => {
    setSubmitError('');
    try {
      await authService.signUp(values);
      navigate('/verify-email');
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not create your account. Please try again.',
      );
    }
  };
  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        description="Start a more thoughtful relationship with your garden."
      >
        {submitError && <AuthNotice type="error">{submitError}</AuthNotice>}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <AuthInput
            label="Your name"
            autoComplete="name"
            placeholder="Alex Morgan"
            error={errors.name?.message}
            {...register('name', {
              required: 'Enter your name.',
              validate: (value) => validateSafeText(value, 'Name', 100),
            })}
          />
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
          <div>
            <PasswordInput
              label="Create password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register('password', {
                required: 'Create a password.',
                validate: validateStrongPassword,
              })}
            />
            <PasswordStrength password={password} />
          </div>
          <PasswordInput
            label="Confirm password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm your password.',
              validate: (value) =>
                value === getValues('password') || 'Passwords do not match.',
            })}
          />
          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting && (
              <LoaderCircle size={16} className="animate-spin" />
            )}
            {isSubmitting ? 'Creating your account...' : 'Create account'}
          </Button>
        </form>
        <AuthDivider />
        <SocialLoginButtons />
        <p className="mt-6 text-center text-xs text-muted">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="focus-ring rounded-md font-bold text-brand hover:text-brand-dark"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
