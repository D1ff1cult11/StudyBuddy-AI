import os
import sys
import asyncio
import edge_tts
import requests

# 2-Minute Investor & Hackathon Pitch Script (Measured, Unhurried, Story-Driven Cadence)
SCRIPT_TEXT = (
    "Every semester, university students drown in hundreds of pages of lecture notes, "
    "forgetting seventy percent within twenty-four hours due to the Ebbinghaus forgetting curve. "
    "Built by a nineteen-year-old student developer from India, StudyBuddy AI transforms this cycle forever. "
    "From first launch, our privacy shield scrubs personal data client-side before any AI processing. "
    "The Home dashboard acts as your learning copilot, displaying retention streaks, "
    "mastery analytics, and review cues calibrated by the SuperMemo SM-two algorithm. "
    "With Magic Scan, simply snap messy handwritten notes or paste transcripts. "
    "In seconds, Gemini one point five Flash extracts atomic active-recall flashcards with mnemonic memory hooks. "
    "In Study Mode, physics-based 3D cards test recall with spatial flips and audio micro-haptics, "
    "while four SM-two rating tiers schedule your optimal review right before memory decay occurs. "
    "Our new Gemini Live Hands-Free Voice Tutor allows students to study aloud on the go, "
    "providing instant Socratic audio feedback. "
    "For academia, our University LMS Hub connects directly to Canvas and Blackboard via LTI one point three, "
    "auto-syncing syllabi and passing back grades to your institution's gradebook. "
    "Ready for focus? The Study Arena hosts synchronized Pomodoro sprints with peers worldwide "
    "and global campus leaderboards. "
    "Export cleanly to Anki and Markdown, or unlock unlimited scans and our fifty percent off Next Gen Student Pass powered by RevenueCat. "
    "StudyBuddy AI: study smarter, retain longer, and excel faster."
)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_VOICE = os.path.join(BASE_DIR, "elevenlabs_voiceover.mp3")

ELEVENLABS_KEY = os.getenv("ELEVENLABS_API_KEY", sys.argv[1] if len(sys.argv) > 1 else "sk_74576e204ce75a17a554ed3174f5ad6408dc718979812f6d")
VOICE_ID = "pNInz6obpgDQGcFmaJgB"  # Adam

def try_elevenlabs():
    print(f"Attempting ElevenLabs synthesis ({len(SCRIPT_TEXT)} characters, calibrated 1:55 cadence)...")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_KEY
    }
    payload = {
        "text": SCRIPT_TEXT,
        "model_id": "eleven_turbo_v2_5",
        "voice_settings": {
            "stability": 0.58,
            "similarity_boost": 0.85,
            "speed": 1.05
        }
    }
    resp = requests.post(url, json=payload, headers=headers)
    if resp.status_code == 200:
        with open(OUTPUT_VOICE, "wb") as f:
            f.write(resp.content)
        print(f"ElevenLabs synthesis succeeded! Saved to {OUTPUT_VOICE} ({len(resp.content)} bytes)")
        return True
    else:
        print(f"ElevenLabs response {resp.status_code}: {resp.text}")
        return False

async def fallback_edge_tts():
    print("Synthesizing with Edge-TTS (Christopher Neural, calm presentation tone)...")
    communicate = edge_tts.Communicate(SCRIPT_TEXT, "en-US-ChristopherNeural", rate="-4%", pitch="+0Hz")
    await communicate.save(OUTPUT_VOICE)
    print(f"Edge-TTS synthesis succeeded! Saved to {OUTPUT_VOICE}")

async def main():
    success = False
    try:
        success = try_elevenlabs()
    except Exception as e:
        print(f"ElevenLabs call failed with error: {e}")
    
    if not success:
        await fallback_edge_tts()

if __name__ == "__main__":
    asyncio.run(main())
