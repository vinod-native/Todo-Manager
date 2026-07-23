import {
  friendlyAuthError,
  validateEmail,
} from '../src/utils/validation';

describe('email validation', () => {
  test.each([
    '',
    'hello',
    'hello@',
    '@example.com',
    'hello@example',
    'hello@example.',
    'hello@.com',
    'hello..world@example.com',
    '.hello@example.com',
    'hello@example..com',
    'hello@-example.com',
  ])('rejects malformed email: %s', email => {
    expect(validateEmail(email)).not.toBe('');
  });

  test.each([
    'hello@example.com',
    'hello.world+todo@example.co.in',
    ' USER@EXAMPLE.COM ',
  ])('accepts valid email: %s', email => {
    expect(validateEmail(email)).toBe('');
  });
});

describe('friendly authentication errors', () => {
  test('maps invalid credentials separately from network failures', () => {
    expect(friendlyAuthError({code: 'auth/invalid-credential'})).toBe(
      'Incorrect email or password.',
    );
    expect(friendlyAuthError({code: 'auth/network-request-failed'})).toBe(
      'Could not connect. Check your internet connection and try again.',
    );
  });
});
