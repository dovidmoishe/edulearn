import { BadRequestException, ConflictException } from '@nestjs/common';

export function validateUsername(
  value: unknown,
  currentUsername?: string | null,
): asserts value is string {
  // Existing handles remain usable without a data migration or forced rename.
  if (typeof value === 'string' && value && value === currentUsername) return;

  if (typeof value !== 'string' || !/^[a-z0-9_]{3,30}$/.test(value)) {
    throw new BadRequestException(
      'Username must be 3–30 characters using lowercase letters, numbers, and underscores',
    );
  }
}

export function rethrowUsernameConflict(error: unknown): void {
  // Drizzle can wrap the PostgreSQL error in a cause.
  let current = error;
  for (let depth = 0; depth < 5 && current; depth++) {
    if (typeof current !== 'object') return;
    const detail = current as {
      code?: string;
      constraint?: string;
      constraint_name?: string;
      cause?: unknown;
    };
    if (
      detail.code === '23505' &&
      /username/.test(detail.constraint_name || detail.constraint || '')
    ) {
      throw new ConflictException('Username is already taken');
    }
    current = detail.cause;
  }
}
