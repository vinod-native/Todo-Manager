export const validateEmail = value => {
  const email = value.trim();
  if (!email) return 'Email is required.';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.';
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
    'auth/email-already-in-use': 'An account already exists for this email.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/network-request-failed': 'Network unavailable. Check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };
  return messages[error?.code] || 'Something went wrong. Please try again.';
};
