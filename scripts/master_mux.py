import os
import subprocess
import imageio_ffmpeg

def run():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    video_file = os.path.join(base_dir, "studybuddy_official_demo.webm")
    voice_file = os.path.join(base_dir, "elevenlabs_voiceover.mp3")
    bg_music_file = os.path.join(base_dir, "background_music.wav")
    output_mp4 = os.path.join(base_dir, "studybuddy_elevenlabs_master.mp4")

    print(f"Master Muxing with FFmpeg: {ffmpeg_exe}")
    print(f"Video: {video_file}")
    print(f"Voice: {voice_file}")
    print(f"Background: {bg_music_file}")
    print(f"Output: {output_mp4}")

    # Voice duration is 65.10s, Video is 56.04s -> atempo = 65.10 / 56.04 = 1.1617
    # Audio filter graph:
    # 1. Voice: atempo=1.1617, volume=1.25 -> [voice]
    # 2. BG: volume=0.14, afade=out:st=53:d=3 -> [bg]
    # 3. Mix: [voice][bg] amix=inputs=2:duration=first:dropout_transition=2 -> [aout]
    filter_complex = (
        "[1:a]atempo=1.1617,volume=1.25[voice];"
        "[2:a]volume=0.14,afade=t=out:st=53:d=3[bg];"
        "[voice][bg]amix=inputs=2:duration=first:dropout_transition=2[aout]"
    )

    cmd = [
        ffmpeg_exe,
        "-i", video_file,
        "-i", voice_file,
        "-i", bg_music_file,
        "-filter_complex", filter_complex,
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "19",
        "-preset", "medium",
        "-c:a", "aac",
        "-b:a", "192k",
        "-ar", "44100",
        "-shortest",
        output_mp4,
        "-y"
    ]

    print("Running command...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        file_size_mb = os.path.getsize(output_mp4) / (1024 * 1024)
        print(f"SUCCESS! Master MP4 created: {output_mp4} ({file_size_mb:.2f} MB)")
    else:
        print(f"ERROR ({res.returncode}):")
        print(res.stderr)

if __name__ == "__main__":
    run()
