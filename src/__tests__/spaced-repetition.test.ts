// ==========================================
// SM-2 Spaced Repetition Algorithm Tests
// ==========================================
// Validates the core learning science engine
// against the published SuperMemo SM-2 specification.

import { describe, it, expect } from 'vitest';
import {
  calculateNextReview,
  createInitialReview,
  getDueCards,
  type CardReview,
  type ReviewQuality,
} from '../utils/spaced-repetition';

describe('SM-2 Spaced Repetition Engine', () => {
  describe('createInitialReview', () => {
    it('should create a review with default ease factor of 2.5', () => {
      const review = createInitialReview(42);
      expect(review.cardId).toBe(42);
      expect(review.easeFactor).toBe(2.5);
      expect(review.interval).toBe(0);
      expect(review.repetitions).toBe(0);
      expect(review.lastReview).toBe(0);
    });

    it('should set nextReview to approximately now', () => {
      const before = Date.now();
      const review = createInitialReview(1);
      const after = Date.now();
      expect(review.nextReview).toBeGreaterThanOrEqual(before);
      expect(review.nextReview).toBeLessThanOrEqual(after);
    });
  });

  describe('calculateNextReview — correct responses', () => {
    it('should set interval to 1 day on first correct response', () => {
      const initial = createInitialReview(1);
      const result = calculateNextReview(initial, 4);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
    });

    it('should set interval to 6 days on second correct response', () => {
      const initial = createInitialReview(1);
      const afterFirst = calculateNextReview(initial, 4);
      const afterSecond = calculateNextReview(afterFirst, 4);
      expect(afterSecond.interval).toBe(6);
      expect(afterSecond.repetitions).toBe(2);
    });

    it('should multiply interval by ease factor on third correct response', () => {
      const initial = createInitialReview(1);
      const r1 = calculateNextReview(initial, 4); // interval = 1
      const r2 = calculateNextReview(r1, 4);       // interval = 6
      const r3 = calculateNextReview(r2, 4);       // interval = 6 * EF
      // EF after two quality-4 reviews: 2.5 + 0.1 - (5-4)*(0.08+(5-4)*0.02) = 2.5
      // Actually: 2.5 + (0.1 - 1*(0.08 + 1*0.02)) = 2.5 + (0.1 - 0.10) = 2.5
      expect(r3.interval).toBe(Math.round(6 * r2.easeFactor));
      expect(r3.repetitions).toBe(3);
    });

    it('should return a new object (immutability)', () => {
      const initial = createInitialReview(1);
      const result = calculateNextReview(initial, 4);
      expect(result).not.toBe(initial);
      expect(initial.repetitions).toBe(0); // Original unchanged
    });
  });

  describe('calculateNextReview — incorrect responses', () => {
    it('should reset repetitions to 0 on quality < 3', () => {
      const initial = createInitialReview(1);
      const r1 = calculateNextReview(initial, 5);
      const r2 = calculateNextReview(r1, 5);
      const failed = calculateNextReview(r2, 1); // Fail after 2 successes
      expect(failed.repetitions).toBe(0);
      expect(failed.interval).toBe(1);
    });

    it('should reset interval to 1 on quality 0 (total blackout)', () => {
      const review: CardReview = {
        cardId: 1,
        easeFactor: 2.5,
        interval: 15,
        repetitions: 5,
        nextReview: Date.now(),
        lastReview: Date.now() - 86400000,
      };
      const result = calculateNextReview(review, 0);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0);
    });
  });

  describe('Ease Factor bounds', () => {
    it('should never drop ease factor below 1.3', () => {
      let review = createInitialReview(1);
      // Repeatedly fail — EF should bottom out at 1.3
      for (let i = 0; i < 20; i++) {
        review = calculateNextReview(review, 0 as ReviewQuality);
      }
      expect(review.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('should increase ease factor on perfect (quality 5) responses', () => {
      const initial = createInitialReview(1);
      const r1 = calculateNextReview(initial, 5);
      expect(r1.easeFactor).toBeGreaterThan(initial.easeFactor);
    });

    it('should maintain ease factor on quality 4 responses', () => {
      const initial = createInitialReview(1);
      const r1 = calculateNextReview(initial, 4);
      // Quality 4: EF + 0.1 - (5-4)*(0.08 + (5-4)*0.02) = EF + 0
      expect(r1.easeFactor).toBe(initial.easeFactor);
    });
  });

  describe('getDueCards', () => {
    it('should return cards whose nextReview is in the past', () => {
      const reviews: CardReview[] = [
        { cardId: 1, easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: Date.now() - 10000, lastReview: 0 },
        { cardId: 2, easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: Date.now() + 86400000, lastReview: 0 },
        { cardId: 3, easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: Date.now() - 5000, lastReview: 0 },
      ];
      const due = getDueCards(reviews);
      expect(due.length).toBe(2);
      expect(due[0].cardId).toBe(1); // Earlier due date first
      expect(due[1].cardId).toBe(3);
    });

    it('should return empty array when no cards are due', () => {
      const reviews: CardReview[] = [
        { cardId: 1, easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: Date.now() + 86400000, lastReview: 0 },
      ];
      expect(getDueCards(reviews)).toEqual([]);
    });
  });

  describe('nextReview timestamp', () => {
    it('should set nextReview to now + interval in milliseconds', () => {
      const before = Date.now();
      const review = createInitialReview(1);
      const result = calculateNextReview(review, 4); // interval = 1 day
      const after = Date.now();

      const expectedMs = 1 * 24 * 60 * 60 * 1000; // 1 day in ms
      expect(result.nextReview).toBeGreaterThanOrEqual(before + expectedMs);
      expect(result.nextReview).toBeLessThanOrEqual(after + expectedMs);
    });
  });
});
