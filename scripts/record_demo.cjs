const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/9790a926-f263-4d66-ac00-048b5b77afce';
const RECORDING_DIR = path.join(__dirname, '../demo_recording');

if (!fs.existsSync(RECORDING_DIR)) {
  fs.mkdirSync(RECORDING_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Launching Edge for 2-Minute Master Pitch Product Demo...');
  
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: RECORDING_DIR,
      size: { width: 440, height: 880 }
    },
    viewport: { width: 440, height: 880 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  // Reset local storage for pristine onboarding sequence
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.removeItem('onboarding_complete');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await sleep(1500);

  // ==========================================
  // CHAPTER 1: ONBOARDING FLOW (0:00 - 0:13)
  // ==========================================
  console.log('📱 Chapter 1: Onboarding 3-Slide Story (Unhurried)...');
  const continueBtn = page.locator('button:has-text("Continue")');
  if (await continueBtn.count() > 0) {
    console.log('   Slide 1: Scan. Learn. Master.');
    await sleep(3500);
    await continueBtn.click();

    console.log('   Slide 2: Spaced Repetition (SM-2)...');
    await sleep(3500);
    await continueBtn.click();

    console.log('   Slide 3: Privacy First & PII Shield...');
    await sleep(3500);
    const getStartedBtn = page.locator('button:has-text("Get Started")');
    await getStartedBtn.click();
    await sleep(2000);
  }

  // ==========================================
  // CHAPTER 2: HOME DASHBOARD (0:13 - 0:28)
  // ==========================================
  console.log('🏠 Chapter 2: Home Command Center & Spaced Review Cues...');
  await sleep(2500);
  // Smooth scroll down to review streak multipliers and active decks
  await page.mouse.wheel(0, 320);
  await sleep(4000);
  // Smooth scroll back up
  await page.mouse.wheel(0, -320);
  await sleep(3500);

  // ==========================================
  // CHAPTER 3: MAGIC SCAN & AI EXTRACTION (0:28 - 0:50)
  // ==========================================
  console.log('📷 Chapter 3: Magic Note Scanner & Gemini Multimodal AI...');
  const scanButton = page.locator('text=Scan Notes Now').first();
  await scanButton.click();
  await sleep(3000);

  // Select Paste Notes tab
  const pasteTab = page.locator('button:has-text("Paste Notes")');
  await pasteTab.click();
  await sleep(2000);

  // Select Cell Biology chip
  const sampleChip = page.locator('button:has-text("Cell Biology")').first();
  await sampleChip.click();
  await sleep(3000);

  // Trigger Gemini synthesis
  console.log('   Triggering Gemini 1.5 Flash synthesis...');
  const generateBtn = page.locator('button:has-text("Generate Flashcards with AI")');
  await generateBtn.click();

  // Wait for deck synthesis & admire the atomic cards
  await page.waitForSelector('text=Deck Synthesized!', { timeout: 25000 });
  await sleep(8000); // 8 seconds to admire synthesized cards, tags, and memory hooks

  // ==========================================
  // CHAPTER 4: 3D STUDY MODE & SM-2 ENGINE (0:52 - 1:18)
  // ==========================================
  console.log('🧠 Chapter 4: 3D Active Recall & SM-2 Rating Engine...');
  const studyBtn = page.locator('button:has-text("Study Now")');
  await studyBtn.click();
  await sleep(3500);

  // Card 1
  console.log('   Card 1: Flip & Rate Good');
  await page.keyboard.press('Space');
  await sleep(4000);
  const goodBtn1 = page.locator('button:has-text("Good")');
  await goodBtn1.click();
  await sleep(2500);

  // Card 2
  console.log('   Card 2: Flip & Rate Easy');
  await page.keyboard.press('Space');
  await sleep(4000);
  const easyBtn2 = page.locator('button:has-text("Easy")');
  await easyBtn2.click();
  await sleep(2500);

  // Card 3
  console.log('   Card 3: Flip & Rate Good');
  await page.keyboard.press('Space');
  await sleep(4000);
  const goodBtn3 = page.locator('button:has-text("Good")');
  await goodBtn3.click();
  await sleep(2500);

  // Card 4
  console.log('   Card 4: Flip & Rate Easy -> Confetti Celebration!');
  await page.keyboard.press('Space');
  await sleep(4000);
  const easyBtn4 = page.locator('button:has-text("Easy")');
  await easyBtn4.click();
  await sleep(5500); // Admire confetti celebration & fanfare

  // ==========================================
  // CHAPTER 5: GEMINI LIVE VOICE TUTOR (1:18 - 1:42)
  // ==========================================
  console.log('🎙️ Chapter 5: Gemini Live Hands-Free Socratic Voice Tutor...');
  const reviewAgainBtn = page.locator('button:has-text("Review Again")');
  await reviewAgainBtn.click();
  await sleep(3000);

  // Toggle Gemini Live Voice mode
  const voiceToggleBtn = page.locator('button[title="Toggle Gemini Live Voice Tutor"]');
  if (await voiceToggleBtn.count() > 0) {
    console.log('   Activating Live Voice Mode...');
    await voiceToggleBtn.click();
    await sleep(8000); // Show live wave visualizer & speaking indicator

    // Flip card manually to show feedback
    await page.keyboard.press('Space');
    await sleep(6500);

    // Rate good to advance
    const goodBtnVoice = page.locator('button:has-text("Good")');
    if (await goodBtnVoice.count() > 0) {
      await goodBtnVoice.click();
      await sleep(3500);
    }
  }

  // ==========================================
  // CHAPTER 6: UNIVERSITY LMS HUB (1:42 - 2:02)
  // ==========================================
  console.log('🏛️ Chapter 6: Canvas LMS & Blackboard Integration Hub...');
  await page.goto('http://127.0.0.1:3000/lms', { waitUntil: 'networkidle' });
  await sleep(4000);

  // Click Sync on MCB 102 assignment
  const syncBtn = page.locator('button:has-text("Sync to Flashcards")').first();
  if (await syncBtn.count() > 0) {
    console.log('   Syncing Course Syllabus to Deck...');
    await syncBtn.click();
    await sleep(5500);
  }

  // Click Submit Grade to Canvas
  const gradeBtn = page.locator('button:has-text("Submit Grade")').first();
  if (await gradeBtn.count() > 0) {
    console.log('   Submitting 95% grade back to Canvas Gradebook...');
    await gradeBtn.click();
    await sleep(5500);
  }

  // ==========================================
  // CHAPTER 7: STUDY ARENA & LEADERBOARD (2:02 - 2:18)
  // ==========================================
  console.log('⚔️ Chapter 7: Collaborative Study Arena & Leaderboard...');
  await page.goto('http://127.0.0.1:3000/arena', { waitUntil: 'networkidle' });
  await sleep(4000);

  // Switch to Leaderboard tab
  const leaderboardTab = page.locator('button:has-text("Campus Leaderboard")');
  if (await leaderboardTab.count() > 0) {
    console.log('   Viewing Global Campus Leaderboard...');
    await leaderboardTab.click();
    await sleep(5500);
  }

  // ==========================================
  // CHAPTER 8: UNIVERSAL EXPORT (2:12 - 2:19)
  // ==========================================
  console.log('📦 Chapter 8: Library & Universal Export (Anki + Markdown)...');
  await page.goto('http://127.0.0.1:3000/library', { waitUntil: 'networkidle' });
  await sleep(2500);

  // Click Copy as Markdown
  const copyMdBtn = page.locator('button[title="Copy as Markdown"]').first();
  if (await copyMdBtn.count() > 0) {
    await copyMdBtn.click();
    await sleep(2500);
  }

  // ==========================================
  // CHAPTER 9: REVENUECAT PRO PAYWALL (2:19 - 2:27)
  // ==========================================
  console.log('💎 Chapter 9: RevenueCat Commercial Paywall & Vision Call-to-Action...');
  await page.goto('http://127.0.0.1:3000/paywall', { waitUntil: 'networkidle' });
  await sleep(3000);

  // Smooth scroll through Pro benefits
  await page.mouse.wheel(0, 240);
  await sleep(3500);

  console.log('🎬 Concluding 2-Minute Demo Recording...');
  await sleep(2000);

  await context.close();
  await browser.close();

  // Find generated video
  const files = fs.readdirSync(RECORDING_DIR).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const sorted = files.map(f => ({
      name: f,
      time: fs.statSync(path.join(RECORDING_DIR, f)).mtime.getTime()
    })).sort((a, b) => b.time - a.time);

    const latestVideo = path.join(RECORDING_DIR, sorted[0].name);
    const targetVideo = path.join(ARTIFACT_DIR, 'studybuddy_2min_demo.webm');
    const localVideo = path.join(__dirname, '../studybuddy_2min_demo.webm');
    
    fs.copyFileSync(latestVideo, targetVideo);
    fs.copyFileSync(latestVideo, localVideo);
    
    console.log(`✅ Success! 2-Minute Video recorded and saved to: ${targetVideo}`);
    console.log(`Local copy: ${localVideo}`);
    console.log(`Size: ${(fs.statSync(targetVideo).size / (1024 * 1024)).toFixed(2)} MB`);
  } else {
    console.warn('No video file found in recording directory.');
  }
}

run().catch(err => {
  console.error('Error recording demo:', err);
  process.exit(1);
});
