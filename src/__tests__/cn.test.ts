import { describe, it, expect } from 'vitest';
import { cn } from '../utils/cn';

describe('cn utility (Tailwind + clsx merge)', () => {
  it('combines simple class names', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('handles conditional classes properly', () => {
    const isPro = true;
    const isFree = false;
    expect(cn('badge', isPro && 'badge-pro', isFree && 'badge-free')).toBe('badge badge-pro');
  });

  it('resolves conflicting tailwind classes', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6');
    expect(cn('text-red-500', 'text-green-500')).toBe('text-green-500');
  });

  it('handles falsy values and undefined gracefully', () => {
    expect(cn('card', null, undefined, false, 'active')).toBe('card active');
  });
});
