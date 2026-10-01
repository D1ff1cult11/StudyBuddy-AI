import os
import sys
import requests

API_KEY = os.getenv("ELEVENLABS_API_KEY", sys.argv[1] if len(sys.argv) > 1 else "")

# Adam voice ID (one of ElevenLabs' most popular, natural narration voices)
VOICE_ID = "pNInz6obpgDQGcFmaJgB" 

SCRIPT_TEXT = (
    "Every semester, students drown in hundreds of pages of lecture notes, "
    "forgetting seventy percent within twenty-four hours due to the Ebbinghaus curve. "
    "StudyBuddy AI transforms this completely. "
    "From first launch, our privacy shield scrubs personal data client-side before any AI processing. "
    "The Home dashboard acts as your learning copilot, tracking retention streaks, "
    "mastery analytics, and SM-two review cues. "
    "With Magic Scan, snap messy handwritten notes or paste transcripts. "
    "In seconds, Gemini one point five Flash extracts atomic active-recall flashcards with mnemonic memory hooks. "
    "In Study Mode, physics-based 3D cards test memory with spatial flips and audio haptics, "
    "while four SM-two rating tiers schedule your optimal review interval right before decay. "
    "Our new Gemini Live Hands-Free Voice Tutor allows students to study aloud while on the move, "
    "providing instant Socratic audio feedback. "
    "For academia, our University LMS Hub connects directly to Canvas and Blackboard via LTI one point three, "
    "auto-syncing syllabi and passing back quiz grades to the institution gradebook. "
    "Ready for focus? The Study Arena hosts synchronized Pomodoro sprints, real-time peer recall duels, "
    "and global campus leaderboards. "
    "Export cleanly to Anki or Obsidian, or unlock unlimited scans with RevenueCat Pro. "
    "StudyBuddy AI: study smarter, retain longer, excel faster."
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
            "stability": 0.52,
            "similarity_boost": 0.82,
            "speed": 1.15
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
