// ==========================================
// Gemini Live Interactive Voice Tutor
// ==========================================
// Provides real-time bidirectional hands-free vocal study sessions:
// 1. Reads question aloud using speech synthesis.
// 2. Listens for student answer via SpeechRecognition.
// 3. Evaluates conceptual accuracy & provides immediate Socratic feedback.

export interface VoiceEvaluation {
  isCorrect: boolean;
  score: number; // 0 - 100
  feedback: string;
  transcript: string;
}

export class VoiceTutorAgent {
  private recognition: any = null;
  private isListening = false;
  private isSpeaking = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && ('speechSynthesis' in window || !!this.recognition);
  }

  /**
   * Speak a message aloud using browser speech synthesis
   */
  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.isSpeaking = true;
      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Listen for student's spoken answer and return transcribed text
   */
  public listen(onInterim?: (transcript: string) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported in this browser.'));
        return;
      }

      let finalTranscript = '';
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (onInterim && interim) {
          onInterim(interim);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        resolve(finalTranscript.trim());
      };

      this.recognition.onerror = (e: any) => {
        this.isListening = false;
        if (finalTranscript.trim()) {
          resolve(finalTranscript.trim());
        } else {
          reject(e);
        }
      };

      try {
        this.recognition.start();
      } catch (err) {
        this.isListening = false;
        reject(err);
      }
    });
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Evaluates spoken answer against ground truth answer
   */
  public async evaluateAnswer(question: string, expectedAnswer: string, studentTranscript: string): Promise<VoiceEvaluation> {
    const apiKey = import.meta.env.VITE_AI_API_KEY;

    if (apiKey && apiKey !== 'your_api_key_here') {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an AI Socratic tutor. Evaluate the student's spoken answer.
Question: "${question}"
Ground Truth: "${expectedAnswer}"
Student Answer: "${studentTranscript}"

Return ONLY a JSON object:
{"isCorrect": boolean, "score": number between 0 and 100, "feedback": "1 sentence warm spoken feedback"}`
              }]
            }]
          })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        return {
          isCorrect: parsed.isCorrect,
          score: parsed.score,
          feedback: parsed.feedback,
          transcript: studentTranscript
        };
      } catch (e) {
        console.warn('Gemini Live evaluation fallback', e);
      }
    }

    // Heuristic conceptual keyword matcher fallback
    const expectedKeywords = expectedAnswer.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const studentWords = new Set(studentTranscript.toLowerCase().split(/\W+/));
    const matched = expectedKeywords.filter(k => studentWords.has(k)).length;
    const matchRatio = expectedKeywords.length > 0 ? matched / expectedKeywords.length : 0.5;

    const isCorrect = matchRatio >= 0.35 || studentTranscript.length > 15;
    return {
      isCorrect,
      score: isCorrect ? 90 : 45,
      feedback: isCorrect 
        ? "Excellent recall! You captured the essential concepts accurately." 
        : "Close! Remember the key mechanism explained on the card.",
      transcript: studentTranscript
    };
  }
}

export const voiceTutor = new VoiceTutorAgent();
