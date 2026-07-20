export function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const levels = [
    { label: 'Too short', color: 'bg-[#d96757]' },
    { label: 'Weak', color: 'bg-[#d96757]' },
    { label: 'Fair', color: 'bg-[#c4933d]' },
    { label: 'Strong', color: 'bg-[#3a9a60]' },
    { label: 'Excellent', color: 'bg-[#227a4c]' },
    { label: 'Excellent', color: 'bg-[#227a4c]' },
  ];
  return { score, ...levels[score] };
}
