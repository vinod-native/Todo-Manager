export const validateEmail = value => {
  const email = value.trim();
  if (!email) return 'Email is required.';
  if (email.length > 254) return 'Email address is too long.';

  const parts = email.split('@');
  if (parts.length !== 2) return 'Enter a valid email address.';

  const [local, domain] = parts;
  if (
    !local ||
    local.length > 64 ||
    local.startsWith('.') ||
    local.endsWith('.') ||
    local.includes('..') ||
    !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)
  ) {
    return 'Enter a valid email address.';
  }

  const domainParts = domain.split('.');
  if (
    domainParts.length < 2 ||
    domainParts.some(
      part =>
        !part ||
        part.startsWith('-') ||
        part.endsWith('-') ||
        !/^[A-Z0-9-]+$/i.test(part),
    ) ||
    domainParts[domainParts.length - 1].length < 2
  ) {
    return 'Enter a valid email address, like name@example.com.';
  }

  return '';
};

export const validatePassword = value => {
  if (!value) return 'Password is required.';
  if (value.length < 6) return 'Password must be at least 6 characters.';
  return '';
};

export const required = (value, label, max = 80) => {
  if (!value.trim()) return `${label} is required.`;
  if (value.trim().length > max) return `${label} must be ${max} characters or fewer.`;
  return '';
};

export const friendlyAuthError = error => {
  const messages = {
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/invalid-login-credentials': 'Incorrect email or password.',
    'auth/user-not-found': 'No account was found for this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account already exists for this email.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/missing-email': 'Email is required.',
    'auth/missing-password': 'Password is required.',
    'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/operation-not-allowed': 'Email sign-in is currently unavailable.',
    'auth/network-request-failed':
      'Could not connect. Check your internet connection and try again.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/internal-error': 'Authentication service is temporarily unavailable.',
  };
  return messages[error?.code] || 'Something went wrong. Please try again.';
};
