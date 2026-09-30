import os
import sys
import requests

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

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "narration_elevenlabs.mp3")

# Adam voice ID (one of ElevenLabs' most popular, natural narration voices)
VOICE_ID = "pNInz6obpgDQGcFmaJgB" 

def synthesize(api_key: str):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key.strip()
    }
    data = {
        "text": VOICEOVER_TEXT,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0,
            "use_speaker_boost": True
        }
    }

    print(f"🎙️ Sending request to ElevenLabs API (Voice ID: {VOICE_ID})...")
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        with open(OUTPUT_FILE, "wb") as f:
            f.write(response.content)
        print(f"✅ ElevenLabs voiceover saved successfully to: {OUTPUT_FILE}")
        return True
    else:
        print(f"❌ ElevenLabs error ({response.status_code}): {response.text}")
        return False

if __name__ == "__main__":
    api_key = sys.argv[1] if len(sys.argv) > 1 else os.getenv("ELEVENLABS_API_KEY", "")
    if not api_key:
        print("Usage: python scripts/elevenlabs_narration.py <YOUR_ELEVENLABS_API_KEY>")
        sys.exit(1)
    synthesize(api_key)
