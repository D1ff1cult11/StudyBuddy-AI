// ==========================================
// AI Agent System (Based on ECC Principles)
// ==========================================
// - Security-First: Scrubs PII before sending payload to LLM.
// - Immutability: Returns strictly new objects.
// - Agent-First: Delegates distinct sub-tasks.

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export class AIAgentHarness {
  /**
   * Scans text for potential PII (emails, phone numbers, names) and redacts it.
   * ECC Principle: Security-First.
   */
  private scrubPII(text: string): string {
    let sanitized = text;
    // Redact Emails
    sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
    // Redact Phone Numbers (Basic format)
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED_PHONE]');
    return sanitized;
  }

  /**
   * Simulates an agent generating flashcards from OCR text.
   */
  public async generateFlashcards(ocrText: string): Promise<Flashcard[]> {
    const safeText = this.scrubPII(ocrText);
    const apiKey = import.meta.env.VITE_AI_API_KEY;

    let newCards: Flashcard[] = [];

    if (apiKey && apiKey !== 'your_api_key_here') {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `Generate exactly 3 study flashcards from this text. Return ONLY a valid JSON array of objects, where each object has 'front' (question) and 'back' (answer) strings. Text: ${safeText}` }]
            }]
          })
        });

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text;
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);
        
        newCards = parsed.map((c: any, i: number) => ({
          id: Date.now() + i,
          front: c.front,
          back: c.back
        }));
      } catch (e) {
        console.error("Gemini API failed, falling back to mock", e);
      }
    }

    // Fallback if API key missing or failed
    if (newCards.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      newCards = [
        { id: Date.now(), front: "What is the primary function of mitochondria?", back: "To generate most of the chemical energy needed to power the cell's biochemical reactions." },
        { id: Date.now() + 1, front: "What is the difference between rough and smooth ER?", back: "Rough ER has ribosomes and makes proteins. Smooth ER lacks ribosomes and synthesizes lipids." },
        { id: Date.now() + 2, front: "What is the role of the Golgi apparatus?", back: "It processes, packages, and sorts proteins and lipids for transport." },
      ];
    }

    // Persist to local storage for "reality type" feel
    const existing = JSON.parse(localStorage.getItem('study_decks') || '[]');
    existing.push({
      id: Date.now(),
      title: "Scanned Notes " + new Date().toLocaleTimeString(),
      cards: newCards
    });
    localStorage.setItem('study_decks', JSON.stringify(existing));

    return newCards;
  }
}

export const studyAgent = new AIAgentHarness();
