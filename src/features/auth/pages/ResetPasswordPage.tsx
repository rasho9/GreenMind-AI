import { useState } from 'react';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { validateStrongPassword } from '@/services/security';
import {
  AuthCard,
  AuthLayout,
  AuthNotice,
  PasswordInput,
  PasswordStrength,
} from '../components';
import { authService } from '../services/authService';

type ResetPasswordValues = { password: string; confirmPassword: string };

export function ResetPasswordPage() {
  const [complete, setComplete] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ mode: 'onChange' });
  const password = watch('password', '');
  const onSubmit = async (values: ResetPasswordValues) => {
    setSubmitError('');
    try {
      await authService.resetPassword(values.password);
      setComplete(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not reset your password. Please try again.',
      );
    }
  };
  return (
    <AuthLayout>
      <AuthCard
        title="Choose a new password"
        description="Use a strong password you have not used elsewhere."
      >
        {complete ? (
          <>
            <AuthNotice type="success">
              Your password has been reset. You can now sign in securely.
            </AuthNotice>
            <Link to="/sign-in">
              <Button className="w-full" leftIcon={<CheckCircle2 size={16} />}>
                Continue to sign in
              </Button>
            </Link>
          </>
        ) : (
          <>
            {submitError && <AuthNotice type="error">{submitError}</AuthNotice>}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              <div>
                <PasswordInput
                  label="New password"
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
                label="Confirm new password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Confirm your password.',
                  validate: (value) =>
                    value === getValues('password') ||
                    'Passwords do not match.',
                })}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full"
              >
                {isSubmitting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {isSubmitting ? 'Resetting password...' : 'Reset password'}
              </Button>
            </form>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
