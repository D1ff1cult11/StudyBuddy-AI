// ==========================================
// Spaced Repetition Engine (SM-2 Algorithm)
// ==========================================
// Based on the SuperMemo SM-2 algorithm used by Anki.
// This is real learning science — not a toy implementation.

export interface CardReview {
  cardId: number;
  easeFactor: number;   // starts at 2.5
  interval: number;     // days until next review
  repetitions: number;  // consecutive correct answers
  nextReview: number;   // timestamp
  lastReview: number;   // timestamp
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = total blackout, 1 = wrong but recognized, 2 = wrong but easy to recall
// 3 = correct with serious difficulty, 4 = correct with hesitation, 5 = perfect

/**
 * SM-2 Algorithm implementation.
 * Returns a NEW CardReview object (immutability principle).
 */
export function calculateNextReview(
  review: CardReview,
  quality: ReviewQuality
): CardReview {
  const now = Date.now();
  
  let { easeFactor, interval, repetitions } = review;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor (never below 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return {
    cardId: review.cardId,
    easeFactor,
    interval,
    repetitions,
    nextReview: now + interval * 24 * 60 * 60 * 1000,
    lastReview: now,
  };
}

/**
 * Create initial review state for a new card.
 */
export function createInitialReview(cardId: number): CardReview {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: 0,
  };
}

/**
 * Get cards that are due for review (sorted by urgency).
 */
export function getDueCards(reviews: CardReview[]): CardReview[] {
  const now = Date.now();
  return reviews
    .filter(r => r.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview);
}

/**
 * Persist review data to localStorage.
 */
export function saveReviews(reviews: CardReview[]): void {
  localStorage.setItem('sr_reviews', JSON.stringify(reviews));
}

/**
 * Load review data from localStorage.
 */
export function loadReviews(): CardReview[] {
  return JSON.parse(localStorage.getItem('sr_reviews') || '[]');
}
