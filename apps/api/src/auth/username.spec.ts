import { BadRequestException, ConflictException } from '@nestjs/common';
import { rethrowUsernameConflict, validateUsername } from './username';

describe('EduLearn usernames', () => {
  it.each(['ada', 'learner_123', 'a'.repeat(30)])('accepts %s', (username) => {
    expect(() => validateUsername(username)).not.toThrow();
  });

  it.each([
    '',
    'ab',
    'a'.repeat(31),
    'Ada',
    '@ada',
    'ada smith',
    ' ada ',
    null,
    42,
  ])('rejects invalid new handle %s', (username) => {
    expect(() => validateUsername(username)).toThrow(BadRequestException);
  });

  it('allows an unchanged legacy handle but requires valid rules when renamed', () => {
    expect(() => validateUsername('Old.Handle', 'Old.Handle')).not.toThrow();
    expect(() => validateUsername('New.Handle', 'Old.Handle')).toThrow(
      BadRequestException,
    );
    expect(() => validateUsername('', '')).toThrow(BadRequestException);
  });

  it.each(['user_username_unique', 'user_username_idx'])(
    'returns a conflict when a simultaneous write hits %s',
    (constraint_name) => {
      const error = { cause: { code: '23505', constraint_name } };
      expect(() => rethrowUsernameConflict(error)).toThrow(ConflictException);
    },
  );

  it('does not relabel other database failures as username conflicts', () => {
    expect(() =>
      rethrowUsernameConflict({
        code: '23505',
        constraint: 'user_email_unique',
      }),
    ).not.toThrow();
    expect(() =>
      rethrowUsernameConflict(new Error('Database offline')),
    ).not.toThrow();
  });
});
