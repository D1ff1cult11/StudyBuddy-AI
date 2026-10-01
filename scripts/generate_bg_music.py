import numpy as np
from scipy.io import wavfile
import os

SAMPLE_RATE = 44100
DURATION = 92.0  # seconds (matches 1:30 min video)
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)

def note_freq(note_name):
    # Mapping note names to frequencies in Hz
    notes = {
        'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99,
    }
    return notes.get(note_name, 440.0)

def generate_tone(freq, duration_sec, decay=3.0):
    t = np.linspace(0, duration_sec, int(SAMPLE_RATE * duration_sec), endpoint=False)
    # Fundamental + harmonics for warm Rhodes/pad timbre
    wave = 0.55 * np.sin(2 * np.pi * freq * t)
    wave += 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    wave += 0.12 * np.sin(2 * np.pi * freq * 3 * t)
    wave += 0.05 * np.sin(2 * np.pi * freq * 4 * t)
    # Smooth exponential envelope
    env = np.exp(-t / decay) * (1.0 - np.exp(-t * 20.0))  # soft attack
    return wave * env

def build_chord(notes, duration_sec, decay=3.5):
    samples = int(SAMPLE_RATE * duration_sec)
    chord = np.zeros(samples)
    for n in notes:
        tone = generate_tone(note_freq(n), duration_sec, decay)
        chord += tone[:samples]
    return chord / max(1, len(notes))

def run():
    print("Synthesizing ambient chill tech background track...")
    
    # Chord progression: 4 bars looped (approx 7.0 seconds per progression)
    progression = [
        (['C3', 'E4', 'G4', 'B4', 'D5'], 3.6),   # Cmaj9
        (['A3', 'C4', 'E4', 'G4', 'B4'], 3.6),   # Am9
        (['F3', 'A3', 'C4', 'E4', 'G4'], 3.6),   # Fmaj9
        (['G3', 'B3', 'D4', 'F4', 'A4'], 3.6),   # G9sus
    ]

    prog_duration = sum(dur for _, dur in progression)
    loops = int(np.ceil(DURATION / prog_duration)) + 1

    left_channel = np.zeros(TOTAL_SAMPLES)
    right_channel = np.zeros(TOTAL_SAMPLES)

    cursor = 0
    for loop in range(loops):
        for chord_notes, dur in progression:
            chord_wave = build_chord(chord_notes, dur * 1.5, decay=dur * 1.2)
            n_samples = len(chord_wave)
            if cursor >= TOTAL_SAMPLES:
                break
            
            end = min(TOTAL_SAMPLES, cursor + n_samples)
            actual_len = end - cursor

            # Subtle stereo width
            left_channel[cursor:end] += chord_wave[:actual_len] * 0.95
            right_channel[cursor:end] += chord_wave[:actual_len] * 1.05

            cursor += int(dur * SAMPLE_RATE)
        if cursor >= TOTAL_SAMPLES:
            break

    # Add gentle rhythmic shaker / ambient pulse
    pulse_t = np.linspace(0, DURATION, TOTAL_SAMPLES, endpoint=False)
    pulse = 0.04 * np.sin(2 * np.pi * 2.0 * pulse_t) * np.random.normal(0, 0.1, TOTAL_SAMPLES)
    left_channel += pulse
    right_channel += pulse

    # Master Fade In & Fade Out
    fade_in_len = int(SAMPLE_RATE * 1.5)
    left_channel[:fade_in_len] *= np.linspace(0, 1, fade_in_len)
    right_channel[:fade_in_len] *= np.linspace(0, 1, fade_in_len)

    fade_out_len = int(SAMPLE_RATE * 3.5)
    left_channel[-fade_out_len:] *= np.linspace(1, 0, fade_out_len)
    right_channel[-fade_out_len:] *= np.linspace(1, 0, fade_out_len)

    # Normalize to -6dB peak
    max_val = max(np.max(np.abs(left_channel)), np.max(np.abs(right_channel)))
    if max_val > 0:
        left_channel = (left_channel / max_val) * 0.5
        right_channel = (right_channel / max_val) * 0.5

    stereo = np.column_stack((left_channel, right_channel))
    int16_audio = np.int16(stereo * 32767)

    output_path = os.path.join(os.path.dirname(__file__), "..", "background_music.wav")
    wavfile.write(output_path, SAMPLE_RATE, int16_audio)
    print(f"Background music saved to: {output_path} ({DURATION}s)")

if __name__ == "__main__":
    run()
