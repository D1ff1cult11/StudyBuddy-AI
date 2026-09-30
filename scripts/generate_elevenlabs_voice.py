import os
import sys
import requests

API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
if not API_KEY and len(sys.argv) > 1:
    API_KEY = sys.argv[1]

# Adam voice ID (one of ElevenLabs' most popular, natural narration voices)
VOICE_ID = "pNInz6obpgDQGcFmaJgB" 

SCRIPT_TEXT = (
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

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "elevenlabs_voiceover.mp3")

def run():
    print(f"Characters to synthesize: {len(SCRIPT_TEXT)} (well within free tier)")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY
    }
    payload = {
        "text": SCRIPT_TEXT,
        "model_id": "eleven_turbo_v2_5",
        "voice_settings": {
            "stability": 0.55,
            "similarity_boost": 0.80,
            "speed": 1.08  # slightly brisk, energetic pace to match 56-second video
        }
    }

    print("Requesting voiceover from ElevenLabs...")
    resp = requests.post(url, json=payload, headers=headers)
    if resp.status_code == 200:
        with open(OUTPUT_FILE, "wb") as f:
            f.write(resp.content)
        print(f"Success! ElevenLabs voiceover saved to: {OUTPUT_FILE} ({len(resp.content)} bytes)")
    else:
        print(f"Error {resp.status_code}: {resp.text}")
        sys.exit(1)

if __name__ == "__main__":
    run()
