import asyncio
import os
import sys
import edge_tts

# Script written to match the exact 56-second video pacing:
VOICEOVER_TEXT = (
    "Hi, I'm a student developer, and this is StudyBuddy AI. "
    "Every semester, students spend dozens of hours copying class notes, only to forget seventy percent "
    "within twenty-four hours due to the Ebbinghaus Forgetting Curve. "
    "StudyBuddy solves this completely. "
    "Simply snap a photo of your handwritten lecture notes or paste text. "
    "Our client-side privacy shield automatically scrubs sensitive data, "
    "while Gemini one point five Flash distills the core concepts into atomic, active-recall flashcards "
    "with custom mnemonics and memory hooks. "
    "In Study Mode, physics-based 3D cards test your memory, while our SuperMemo SM-two algorithm "
    "schedules future reviews right before memory decay occurs. "
    "Students can challenge themselves with AI diagnostic quizzes, "
    "export decks directly to Anki and Markdown, "
    "and unlock unlimited scans through our RevenueCat Pro tier. "
    "StudyBuddy AI is one hundred percent open-source, built for the next generation of students. "
    "Thank you for watching!"
)

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "narration.mp3")

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

async def generate():
    voice = "en-US-ChristopherNeural"  # Professional, crisp, engaging tech keynote voice
    print(f"Synthesizing neural voiceover with {voice} at +14% rate...")
    communicate = edge_tts.Communicate(VOICEOVER_TEXT, voice, rate="+14%", pitch="+0Hz")
    await communicate.save(OUTPUT_FILE)
    print(f"Voiceover saved successfully to: {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(generate())
