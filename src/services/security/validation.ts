export type PasswordRequirement = {
  label: string;
  met: boolean;
};

const unsafeMarkup = /<\/?[a-z][\s\S]*>/i;
const suspiciousInjection =
  /(?:--|\/\*|\*\/|<\s*script|javascript:|\b(?:select|insert|delete|drop|union)\s+(?:from|into|table|database|all)\b)/i;

export function hasUnsafeInput(value: string) {
  return unsafeMarkup.test(value) || suspiciousInjection.test(value);
}

export function normalizeText(value: string, maxLength = 1_000) {
  const withoutControlCharacters = Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 || code === 9 || code === 10 || code === 13;
    })
    .join('');
  return withoutControlCharacters.normalize('NFKC').trim().slice(0, maxLength);
}

export function validateSafeText(
  value: string,
  fieldName: string,
  maxLength = 1_000,
) {
  const normalized = normalizeText(value, maxLength);
  if (!normalized) return `${fieldName} is required.`;
  if (unsafeMarkup.test(normalized)) return `${fieldName} cannot contain HTML.`;
  if (suspiciousInjection.test(normalized))
    return `${fieldName} contains unsafe characters.`;
  return true;
}

export function validateEmail(value: string) {
  const normalized = normalizeText(value, 254).toLowerCase();
  if (!normalized) return 'Enter your email address.';
  if (unsafeMarkup.test(normalized) || suspiciousInjection.test(normalized)) {
    return 'Enter a valid email address.';
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(normalized)
    ? true
    : 'Enter a valid email address.';
}

export function validateSafeUrl(value: string) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol)
      ? true
      : 'Use an http or https URL.';
  } catch {
    return 'Enter a valid URL.';
  }
}

export function passwordRequirements(password: string): PasswordRequirement[] {
  return [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/u.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/u.test(password) },
    { label: 'Number', met: /\d/u.test(password) },
    { label: 'Special character', met: /[^A-Za-z0-9]/u.test(password) },
  ];
}

export function validateStrongPassword(password: string) {
  return passwordRequirements(password).every((requirement) => requirement.met)
    ? true
    : 'Use 8+ characters with uppercase, lowercase, a number, and a special character.';
}
