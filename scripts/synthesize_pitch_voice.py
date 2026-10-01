import os
import sys
import asyncio
import edge_tts
import requests

# 90-Second Investor & Hackathon Pitch Script
SCRIPT_TEXT = (
    "Every semester, millions of students drown in hundreds of pages of lecture notes, "
    "only to forget seventy percent within twenty-four hours due to the Ebbinghaus forgetting curve. "
    "StudyBuddy AI transforms this painful cycle forever. "
    "From first launch, StudyBuddy guides students through an effortless onboarding flow, "
    "establishing client-side privacy where all notes are scrubbed of personal data before AI processing. "
    "The Home dashboard acts as your personal learning copilot, displaying real-time retention streaks, "
    "mastery analytics, and intelligent review cues calibrated by the SuperMemo SM-two algorithm. "
    "With Magic Scan, simply snap messy handwritten notes or paste lecture transcripts. "
    "In seconds, Gemini one point five Flash analyzes the material, synthesizing atomic active-recall flashcards "
    "complete with mnemonic memory hooks. "
    "In Study Mode, physics-based three-D cards test memory with spatial flips and audio micro-haptics. "
    "Four scientific rating tiers dynamically schedule your optimal next review interval right before memory decay. "
    "And now, introducing our all-new Gemini Live Hands-Free Voice Tutor. "
    "Students can practice verbally while walking to class; StudyBuddy listens, evaluates answers Socratically in real-time, "
    "and responds with audio coaching. "
    "For academic workflows, our University LMS Hub connects directly to Canvas and Blackboard via certified LTI one point three. "
    "Import syllabi and course readings with one tap, and seamlessly pass back quiz grades to your institution's gradebook. "
    "Need focus? Enter the Study Arena: join synchronized Pomodoro sprints with classmates worldwide, "
    "challenge peers to real-time recall duels, and climb global university leaderboards. "
    "Export seamlessly to Anki or Obsidian, or unlock unlimited scans with our RevenueCat Pro tier. "
    "StudyBuddy AI: study smarter, retain longer, excel faster."
)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_VOICE = os.path.join(BASE_DIR, "voiceover_90s.mp3")

ELEVENLABS_KEY = os.getenv("ELEVENLABS_API_KEY", sys.argv[1] if len(sys.argv) > 1 else "")
VOICE_ID = "pNInz6obpgDQGcFmaJgB"  # Adam

def try_elevenlabs():
    print(f"Attempting ElevenLabs synthesis ({len(SCRIPT_TEXT)} characters)...")
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
            "stability": 0.52,
            "similarity_boost": 0.82,
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
    print("Synthesizing with Edge-TTS (Christopher Neural, ultra-crisp pitch tone)...")
    communicate = edge_tts.Communicate(SCRIPT_TEXT, "en-US-ChristopherNeural", rate="+6%", pitch="+0Hz")
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
