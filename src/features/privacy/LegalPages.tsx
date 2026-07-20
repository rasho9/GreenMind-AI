import { FileCheck2, LockKeyhole, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

function LegalPage({
  title,
  description,
  icon: Icon,
  sections,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  sections: Array<[string, string]>;
}) {
  return (
    <div className="mx-auto max-w-4xl pb-3">
      <section className="premium-hero rounded-[26px] border border-brand/20 bg-[linear-gradient(125deg,rgb(var(--surface)),rgb(var(--brand-soft)/.42))] px-6 py-8 sm:px-8">
        <span className="grid size-11 place-items-center rounded-[15px] bg-brand text-white">
          <Icon size={20} />
        </span>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
          GreenMind legal
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.055em] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          {description}
        </p>
      </section>
      <section className="mt-6 space-y-4">
        {sections.map(([heading, copy]) => (
          <article
            key={heading}
            className="rounded-[20px] border border-line bg-surface p-5 sm:p-6"
          >
            <h2 className="text-xl font-extrabold tracking-[-0.04em] text-ink">
              {heading}
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">{copy}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
const common: Array<[string, string]> = [
  [
    'What we protect',
    'GreenMind does not place API keys, access tokens, or refresh tokens in localStorage. Production refresh sessions are designed for Secure, HttpOnly cookies and every API provider is configured server-side.',
  ],
  [
    'Your choices',
    'You can control garden-context preferences, request an account-data export, and request account deletion from Settings. Credentials and security tokens are never included in exports.',
  ],
];
export const PrivacyPolicyPage = () => (
  <LegalPage
    icon={LockKeyhole}
    title="Privacy Policy"
    description="A clear overview of how GreenMind AI handles account and garden information."
    sections={common}
  />
);
export const TermsPage = () => (
  <LegalPage
    icon={Scale}
    title="Terms of Service"
    description="The product terms for using GreenMind AI responsibly."
    sections={[
      [
        'Responsible guidance',
        'AI guidance is informational and plant-health treatment should be verified with an appropriate local expert before applying chemical products.',
      ],
      [
        'Account responsibilities',
        'Keep your credentials confidential, enable available security controls, and report suspicious access promptly.',
      ],
    ]}
  />
);
export const CookiePolicyPage = () => (
  <LegalPage
    icon={FileCheck2}
    title="Cookie Policy"
    description="How essential session and preference storage is used."
    sections={[
      [
        'Essential storage',
        'GreenMind uses an encrypted session-scoped preference envelope for consent choices. It is not used to persist sensitive credentials.',
      ],
      [
        'Optional services',
        'Analytics and third-party integrations remain disabled unless explicitly configured by the application owner.',
      ],
    ]}
  />
);
