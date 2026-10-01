// ==========================================
// AI Agent & PII Scrubber Unit Tests
// ==========================================
// Validates security-first PII sanitization and
// pedagogical flashcard generation safety.

import { describe, it, expect, beforeEach } from 'vitest';
import { AIAgentHarness } from '../utils/ai-agent';

describe('AIAgentHarness — Security & PII Sanitization', () => {
  let agent: AIAgentHarness;

  beforeEach(() => {
    agent = new AIAgentHarness();
  });

  it('redacts standard email addresses', () => {
    const raw = 'Student submission from arjun.sharma2026@gmail.com on thermodynamics';
    const scrubbed = agent.scrubPII(raw);
    expect(scrubbed).not.toContain('arjun.sharma2026@gmail.com');
    expect(scrubbed).toContain('[REDACTED_EMAIL]');
    expect(scrubbed).toBe('Student submission from [REDACTED_EMAIL] on thermodynamics');
  });

  it('redacts multiple emails in a single document', () => {
    const raw = 'Contact primary: dev@studybuddy.ai or backup: prof.kumar@iitd.ac.in';
    const scrubbed = agent.scrubPII(raw);
    expect(scrubbed).not.toContain('dev@studybuddy.ai');
    expect(scrubbed).not.toContain('prof.kumar@iitd.ac.in');
    expect(scrubbed.match(/\[REDACTED_EMAIL\]/g)?.length).toBe(2);
  });

  it('redacts international and standard phone numbers', () => {
    const raw = 'Please WhatsApp lecture audio to +91 98765 43210 or call (555) 123-4567';
    const scrubbed = agent.scrubPII(raw);
    expect(scrubbed).not.toContain('98765 43210');
    expect(scrubbed).not.toContain('(555) 123-4567');
    expect(scrubbed).toContain('[REDACTED_PHONE]');
  });

  it('redacts SSN and national ID format numbers', () => {
    const raw = 'Student registration verification number: 123-45-6789 for exam hall';
    const scrubbed = agent.scrubPII(raw);
    expect(scrubbed).not.toContain('123-45-6789');
    expect(scrubbed).toContain('[REDACTED_SSN]');
  });

  it('preserves scientific formulas and legitimate study text without false positives', () => {
    const formulaText = 'E = mc^2, Delta G = Delta H - T * Delta S, pH = -log[H+]';
    const scrubbed = agent.scrubPII(formulaText);
    expect(scrubbed).toBe(formulaText);
  });

  it('preserves mathematical equations with dashes and dots', () => {
    const mathText = 'Calculus derivative: d/dx(x^3 - 3.14*x) = 3*x^2 - 3.14';
    const scrubbed = agent.scrubPII(mathText);
    expect(scrubbed).toBe(mathText);
  });

  it('enforces immutability: returns a new string without mutating original', () => {
    const original = 'test@example.com notes on Newton laws';
    const result = agent.scrubPII(original);
    expect(result).not.toBe(original);
    expect(original).toBe('test@example.com notes on Newton laws');
  });
});
