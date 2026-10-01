import os
import sys
import subprocess
import imageio_ffmpeg

def get_duration(media_path, ffmpeg_exe):
    cmd = [ffmpeg_exe, "-i", media_path]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
    for line in res.stderr.splitlines():
        if "Duration:" in line:
            # Duration: 00:01:28.50, start: ...
            parts = line.strip().split(",")[0].replace("Duration:", "").strip().split(":")
            hours = float(parts[0])
            mins = float(parts[1])
            secs = float(parts[2])
            return hours * 3600 + mins * 60 + secs
    return 90.0

def run():
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    artifact_dir = "C:/Users/Admin/.gemini/antigravity-ide/brain/9790a926-f263-4d66-ac00-048b5b77afce"

    video_file = os.path.join(base_dir, "studybuddy_90s_demo.webm")
    voice_file = os.path.join(base_dir, "elevenlabs_voiceover.mp3")
    bg_music_file = os.path.join(base_dir, "background_music.wav")
    
    output_mp4_local = os.path.join(base_dir, "studybuddy_90s_pitch_master.mp4")
    output_mp4_artifact = os.path.join(artifact_dir, "studybuddy_90s_pitch_master.mp4")

    if not os.path.exists(video_file):
        print(f"Error: Video file not found: {video_file}")
        sys.exit(1)
    if not os.path.exists(voice_file):
        print(f"Error: Voice file not found: {voice_file}")
        sys.exit(1)
    if not os.path.exists(bg_music_file):
        print(f"Error: BG music file not found: {bg_music_file}")
        sys.exit(1)

    vid_dur = get_duration(video_file, ffmpeg_exe)
    voice_dur = get_duration(voice_file, ffmpeg_exe)
    bg_dur = get_duration(bg_music_file, ffmpeg_exe)

    print(f"=== Audio / Video Sync Calibration ===")
    print(f"Video Duration : {vid_dur:.2f}s ({vid_dur/60:.2f} min)")
    print(f"Voice Duration : {voice_dur:.2f}s")
    print(f"Music Duration : {bg_dur:.2f}s")

    # Audio alignment:
    # Introduce 1.2s lead-in for voiceover
    # Slight tempo adjustment if needed to align voice smoothly to video
    # Effective voice duration with 1.2s delay = 1.2 + voice_dur
    # Target voice end around vid_dur - 2.5s (to let final chords ring out)
    target_voice_dur = max(10.0, vid_dur - 4.0)
    tempo_ratio = voice_dur / target_voice_dur
    # Bound tempo between 0.95 and 1.15
    tempo = max(0.95, min(1.15, tempo_ratio))

    fade_out_start = max(1.0, vid_dur - 3.5)

    print(f"Voice tempo adjustment: {tempo:.4f}")
    print(f"Music fade out start : {fade_out_start:.2f}s")

    filter_complex = (
        f"[1:a]adelay=1200|1200,atempo={tempo:.4f},volume=1.20[voice];"
        f"[2:a]volume=0.13,afade=t=in:st=0:d=1.5,afade=t=out:st={fade_out_start:.2f}:d=3.5[bg];"
        f"[voice][bg]amix=inputs=2:duration=first:dropout_transition=2[aout]"
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
        "-crf", "18",
        "-preset", "medium",
        "-c:a", "aac",
        "-b:a", "192k",
        "-ar", "44100",
        "-t", f"{vid_dur:.2f}",
        output_mp4_local,
        "-y"
    ]

    print("Executing FFmpeg multiplex...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        size_mb = os.path.getsize(output_mp4_local) / (1024 * 1024)
        print(f"SUCCESS! Master MP4 created at: {output_mp4_local} ({size_mb:.2f} MB)")
        
        # Copy to artifact dir
        import shutil
        shutil.copyfile(output_mp4_local, output_mp4_artifact)
        print(f"Copied to artifact directory: {output_mp4_artifact}")
    else:
        print(f"FFmpeg error ({res.returncode}):")
        print(res.stderr)
        sys.exit(1)

if __name__ == "__main__":
    run()
