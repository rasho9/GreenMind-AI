import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Badge, Button, Card, Modal } from '@/components/ui';
import {
  Activity,
  CheckCircle2,
  Download,
  KeyRound,
  Laptop,
  LockKeyhole,
  LogOut,
  MailCheck,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { authService } from '@/services/auth';
import { validateStrongPassword } from '@/services/security';
import { PasswordInput, PasswordStrength } from '@/features/auth/components';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useAppStore } from '@/store/appStore';

type PasswordValues = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

const sessions = [
  {
    device: 'Chrome on Windows',
    location: 'Lahore, Pakistan',
    time: 'Current session · just now',
    current: true,
    icon: Laptop,
  },
  {
    device: 'Safari on iPhone',
    location: 'Lahore, Pakistan',
    time: '18 Jul 2026 · 09:42',
    current: false,
    icon: Smartphone,
  },
];
const loginHistory = [
  ['Today, 10:18', 'Chrome on Windows', 'Lahore, Pakistan', 'Successful'],
  ['18 Jul, 09:42', 'Safari on iPhone', 'Lahore, Pakistan', 'Successful'],
  ['12 Jul, 19:06', 'Chrome on Windows', 'Lahore, Pakistan', 'Successful'],
];

function Toggle({
  enabled,
  onClick,
  label,
  description,
}: {
  enabled: boolean;
  onClick: () => void;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex w-full items-center justify-between gap-4 rounded-[16px] border border-line bg-canvas/45 p-4 text-left hover:border-brand/30"
    >
      <span>
        <span className="block text-[15px] font-bold text-ink">{label}</span>
        <span className="mt-1 block text-sm leading-5 text-muted">
          {description}
        </span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? 'bg-brand' : 'bg-line'}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'left-6' : 'left-1'}`}
        />
      </span>
    </button>
  );
}

export function SecuritySettingsPage() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const showToast = useAppStore((state) => state.showToast);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionsVisible, setSessionsVisible] = useState(sessions);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({ mode: 'onChange' });
  const password = watch('password', '');
  const score =
    (user?.emailVerified ? 35 : 10) +
    (twoFactorEnabled ? 35 : 0) +
    (user?.phoneVerified ? 15 : 0) +
    15;
  const changePassword = async (values: PasswordValues) => {
    try {
      await authService.changePassword(values.currentPassword, values.password);
      reset();
      setIsPasswordOpen(false);
      showToast(
        'Password updated securely. Other sessions can now be reviewed.',
        'success',
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Password update failed.',
        'warning',
      );
    }
  };
  return (
    <div className="pb-3">
      <section className="premium-hero relative overflow-hidden rounded-[26px] border border-brand/20 bg-[radial-gradient(circle_at_86%_12%,rgb(var(--brand-soft)/.8),transparent_28%),linear-gradient(125deg,rgb(var(--surface)),rgb(var(--brand-soft)/.42))] px-6 py-7 sm:px-8 sm:py-9">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="grid size-11 place-items-center rounded-[15px] bg-brand text-white shadow-card">
              <ShieldCheck size={21} />
            </span>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
              Account protection
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.055em] sm:text-4xl">
              Security Center
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Review the protections around your account, devices, and active
              sessions.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsPasswordOpen(true)}
            leftIcon={<KeyRound size={16} />}
          >
            Change password
          </Button>
        </div>
      </section>
      <section className="mt-7 grid gap-5 xl:grid-cols-[.82fr_1.18fr]">
        <Card className="overflow-hidden p-0">
          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              Security score
            </p>
            <div className="mt-5 flex items-center gap-5">
              <div className="grid size-28 shrink-0 place-items-center rounded-full border-[10px] border-brand-soft bg-surface">
                <div className="text-center">
                  <p className="text-3xl font-extrabold tracking-[-0.06em] text-ink">
                    {score}
                  </p>
                  <p className="text-[11px] font-bold text-brand">of 100</p>
                </div>
              </div>
              <div>
                <p className="text-xl font-extrabold tracking-[-0.04em]">
                  {score >= 80 ? 'Well protected' : 'Add another safeguard'}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Enable two-factor authentication and verify a phone number to
                  raise your score.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-line">
            <SecurityMetric
              label="Email verified"
              value={user?.emailVerified ? 'Verified' : 'Action needed'}
              ok={Boolean(user?.emailVerified)}
            />
            <SecurityMetric
              label="Two-factor auth"
              value={twoFactorEnabled ? 'Enabled' : 'Not enabled'}
              ok={twoFactorEnabled}
            />
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <LockKeyhole size={19} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">
                Sign-in safeguards
              </p>
              <p className="mt-1 text-sm text-muted">
                Layer security controls without interrupting your gardening
                flow.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <Toggle
              enabled={twoFactorEnabled}
              onClick={() => {
                setTwoFactorEnabled((value) => !value);
                showToast(
                  twoFactorEnabled
                    ? 'Two-factor authentication turned off for this demo session.'
                    : 'Two-factor authentication setup is ready. Connect an authenticator provider to activate it.',
                  'info',
                );
              }}
              label="Two-factor authentication"
              description="Authenticator app setup is ready for your production identity provider."
            />
            <button
              type="button"
              onClick={() =>
                showToast(
                  'A phone verification flow will open when an SMS provider is connected.',
                  'info',
                )
              }
              className="focus-ring flex w-full items-center justify-between rounded-[16px] border border-line bg-canvas/45 p-4 text-left hover:border-brand/30"
            >
              <span>
                <span className="block text-[15px] font-bold text-ink">
                  Phone verification
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {user?.phoneVerified
                    ? 'Verified phone is protecting recovery.'
                    : 'Add a verified number for account recovery.'}
                </span>
              </span>
              <Badge
                className={
                  user?.phoneVerified ? 'status-success' : 'status-warning'
                }
              >
                {user?.phoneVerified ? 'Verified' : 'Optional'}
              </Badge>
            </button>
          </div>
        </Card>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <UserCheck size={19} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">
                Trusted devices & sessions
              </p>
              <p className="mt-1 text-sm text-muted">
                Only devices you recognize should remain signed in.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {sessionsVisible.map((session) => {
              const Icon = session.icon;
              return (
                <div
                  key={session.device}
                  className="flex items-center gap-3 rounded-[16px] border border-line bg-canvas/45 p-3.5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-brand shadow-sm">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-ink">
                      {session.device}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {session.location} · {session.time}
                    </p>
                  </div>
                  {session.current ? (
                    <Badge className="status-success">Current</Badge>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setSessionsVisible((items) =>
                          items.filter(
                            (item) => item.device !== session.device,
                          ),
                        )
                      }
                      className="focus-ring rounded-lg p-2 text-muted hover:bg-[#fff3f0] hover:text-danger"
                      aria-label={`Remove ${session.device}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <Button
            variant="secondary"
            className="mt-4 w-full"
            leftIcon={<LogOut size={16} />}
            onClick={() =>
              void signOut().then(() => {
                window.location.assign('/sign-in');
              })
            }
          >
            Logout from all devices
          </Button>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <Activity size={19} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">Login history</p>
              <p className="mt-1 text-sm text-muted">
                Review recent successful sign-ins and report anything
                unfamiliar.
              </p>
            </div>
          </div>
          <div className="mt-5 divide-y divide-line rounded-[16px] border border-line bg-canvas/45">
            {loginHistory.map(([time, device, location, status]) => (
              <div key={time} className="flex items-center gap-3 px-4 py-3.5">
                <CheckCircle2 size={17} className="shrink-0 text-success" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink">{device}</p>
                  <p className="mt-1 text-xs text-muted">
                    {time} · {location}
                  </p>
                </div>
                <span className="text-xs font-bold text-success">{status}</span>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="mt-3 px-0 text-brand-dark hover:bg-transparent"
            leftIcon={<Download size={16} />}
            onClick={() =>
              showToast(
                'Your login history export is being prepared in the secure data workspace.',
                'info',
              )
            }
          >
            Download security activity
          </Button>
        </Card>
      </section>
      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <MailCheck size={19} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">
                Email verification
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {user?.emailVerified
                  ? `${user.email} is verified and can receive account recovery messages.`
                  : 'Verify your email before enabling sensitive account actions.'}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <Download size={19} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">Privacy controls</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Download a copy of your account data or manage deletion from
                Settings. Sensitive credentials are never included in exports.
              </p>
            </div>
          </div>
        </Card>
      </section>
      <Modal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        title="Change password"
      >
        <form
          onSubmit={handleSubmit(changePassword)}
          noValidate
          className="space-y-4"
        >
          <PasswordInput
            label="Current password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register('currentPassword', {
              required: 'Enter your current password.',
            })}
          />
          <div>
            <PasswordInput
              label="New password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Create a new password.',
                validate: validateStrongPassword,
              })}
            />
            <PasswordStrength password={password} />
          </div>
          <PasswordInput
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm your new password.',
              validate: (value) =>
                value === getValues('password') || 'Passwords do not match.',
            })}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Updating password…' : 'Update password'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

function SecurityMetric({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="p-4">
      <p className="text-xs font-bold text-muted">{label}</p>
      <p
        className={`mt-1 text-sm font-extrabold ${ok ? 'text-success' : 'text-warning'}`}
      >
        {value}
      </p>
    </div>
  );
}
