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
  console.log('🚀 Launching Edge for Calibrated 1:55 (115s) Master Demo Recording...');
  
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
    localStorage.setItem('studybuddy_scans_used', '0');
    localStorage.removeItem('studybuddy_pro_active');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await sleep(1500);

  // ==========================================
  // CHAPTER 1: ONBOARDING FLOW (0:00 - 0:10)
  // ==========================================
  console.log('📱 Chapter 1: Onboarding 3-Slide Story (10s)...');
  const continueBtn = page.locator('button:has-text("Continue")');
  if (await continueBtn.count() > 0) {
    console.log('   Slide 1: Scan. Learn. Master.');
    await sleep(2800);
    await continueBtn.click();

    console.log('   Slide 2: Spaced Repetition (SM-2)...');
    await sleep(2800);
    await continueBtn.click();

    console.log('   Slide 3: Privacy First & PII Shield...');
    await sleep(2800);
    const getStartedBtn = page.locator('button:has-text("Get Started")');
    await getStartedBtn.click();
    await sleep(1600);
  }

  // ==========================================
  // CHAPTER 2: HOME DASHBOARD (0:10 - 0:17)
  // ==========================================
  console.log('🏠 Chapter 2: Home Command Center (7s)...');
  await sleep(1800);
  await page.mouse.wheel(0, 280);
  await sleep(2500);
  await page.mouse.wheel(0, -280);
  await sleep(2700);

  // ==========================================
  // CHAPTER 3: MAGIC SCAN & AI EXTRACTION (0:17 - 0:29)
  // ==========================================
  console.log('📷 Chapter 3: Magic Note Scanner & Gemini Multimodal AI (12s)...');
  const scanButton = page.locator('text=Scan Notes Now').first();
  await scanButton.click();
  await sleep(1800);

  // Select Paste Notes tab
  const pasteTab = page.locator('button:has-text("Paste Notes")');
  await pasteTab.click();
  await sleep(1400);

  // Select Cell Biology chip
  const sampleChip = page.locator('button:has-text("Cell Biology")').first();
  await sampleChip.click();
  await sleep(1800);

  // Trigger Gemini synthesis
  console.log('   Triggering Gemini 1.5 Flash synthesis...');
  const generateBtn = page.locator('button:has-text("Generate Flashcards with AI")');
  await generateBtn.click();

  // Wait for deck synthesis & admire the atomic cards
  await page.waitForSelector('text=Deck Synthesized!', { timeout: 25000 });
  await sleep(5000); // Admire cards, tags, and memory hooks

  // ==========================================
  // CHAPTER 4: 3D STUDY MODE & SM-2 ENGINE (0:29 - 0:49)
  // ==========================================
  console.log('🧠 Chapter 4: 3D Active Recall & SM-2 Rating Engine (20s)...');
  const studyBtn = page.locator('button:has-text("Study Now")');
  await studyBtn.click();
  await sleep(2200);

  // Card 1: Flip & Rate Good
  await page.keyboard.press('Space');
  await sleep(2200);
  const goodBtn1 = page.locator('button:has-text("Good")');
  await goodBtn1.click();
  await sleep(1600);

  // Card 2: Flip & Rate Easy
  await page.keyboard.press('Space');
  await sleep(2200);
  const easyBtn2 = page.locator('button:has-text("Easy")');
  await easyBtn2.click();
  await sleep(1600);

  // Card 3: Flip & Rate Good
  await page.keyboard.press('Space');
  await sleep(2200);
  const goodBtn3 = page.locator('button:has-text("Good")');
  await goodBtn3.click();
  await sleep(1600);

  // Card 4: Flip & Rate Easy -> Confetti!
  await page.keyboard.press('Space');
  await sleep(2200);
  const easyBtn4 = page.locator('button:has-text("Easy")');
  await easyBtn4.click();
  await sleep(4200); // Admire confetti celebration

  // ==========================================
  // CHAPTER 5: GEMINI LIVE VOICE TUTOR (0:49 - 1:03)
  // ==========================================
  console.log('🎙️ Chapter 5: Gemini Live Hands-Free Voice Tutor (14s)...');
  const reviewAgainBtn = page.locator('button:has-text("Review Again")');
  await reviewAgainBtn.click();
  await sleep(2000);

  const voiceToggleBtn = page.locator('button[title="Toggle Gemini Live Voice Tutor"]');
  if (await voiceToggleBtn.count() > 0) {
    console.log('   Activating Live Voice Mode...');
    await voiceToggleBtn.click();
    await sleep(5500); // Live wave visualizer

    await page.keyboard.press('Space');
    await sleep(4500); // Spoken feedback

    const goodBtnVoice = page.locator('button:has-text("Good")');
    if (await goodBtnVoice.count() > 0) {
      await goodBtnVoice.click();
      await sleep(2000);
    }
  }

  // ==========================================
  // CHAPTER 6: UNIVERSITY LMS HUB (1:03 - 1:13)
  // ==========================================
  console.log('🏛️ Chapter 6: Canvas LMS & Blackboard Integration Hub (10s)...');
  await page.goto('http://127.0.0.1:3000/lms', { waitUntil: 'networkidle' });
  await sleep(2000);

  // Click Sync on assignment
  const syncBtn = page.locator('button:has-text("Sync to Flashcards")').first();
  if (await syncBtn.count() > 0) {
    console.log('   Syncing Course Syllabus to Deck...');
    await syncBtn.click();
    await sleep(3800);
  }

  // Click Submit Grade to Canvas
  const gradeBtn = page.locator('button:has-text("Submit Grade")').first();
  if (await gradeBtn.count() > 0) {
    console.log('   Submitting 95% grade back to Canvas Gradebook...');
    await gradeBtn.click();
    await sleep(4200);
  }

  // ==========================================
  // CHAPTER 7: STUDY ARENA & LEADERBOARD (1:13 - 1:23)
  // ==========================================
  console.log('⚔️ Chapter 7: Collaborative Study Arena & Leaderboard (10s)...');
  await page.goto('http://127.0.0.1:3000/arena', { waitUntil: 'networkidle' });
  await sleep(2000);

  const leaderboardTab = page.locator('button:has-text("Campus Leaderboard")');
  if (await leaderboardTab.count() > 0) {
    console.log('   Viewing Global Campus Leaderboard...');
    await leaderboardTab.click();
    await sleep(4500);
  }

  // ==========================================
  // CHAPTER 8: UNIVERSAL EXPORT (1:23 - 1:28)
  // ==========================================
  console.log('📦 Chapter 8: Library & Universal Export (5s)...');
  await page.goto('http://127.0.0.1:3000/library', { waitUntil: 'networkidle' });
  await sleep(2000);

  const copyMdBtn = page.locator('button[title="Copy as Markdown"]').first();
  if (await copyMdBtn.count() > 0) {
    await copyMdBtn.click();
    await sleep(3000);
  }

  // ==========================================
  // CHAPTER 9: REVENUECAT PRO PAYWALL (1:28 - 1:55)
  // ==========================================
  console.log('💎 Chapter 9: RevenueCat Pro & Student Pass Paywall (27s)...');
  await page.goto('http://127.0.0.1:3000/paywall', { waitUntil: 'networkidle' });
  await sleep(2500);

  // Click Student Pass (50% Off / ₹999)
  const studentPassPlan = page.locator('text=Next Gen Student Pass').first();
  if (await studentPassPlan.count() > 0) {
    await studentPassPlan.click();
    await sleep(2500);
  }

  // Click Compare Free vs Pro Features
  const compareBtn = page.locator('button:has-text("Compare Free vs. Pro Features")');
  if (await compareBtn.count() > 0) {
    await compareBtn.click();
    await sleep(3500);
  }

  // Scroll to CTA
  await page.mouse.wheel(0, 240);
  await sleep(2500);

  // Click Start Free Trial to trigger RevenueCat purchase simulation
  const startTrialBtn = page.locator('button:has-text("Start 7-Day Free Trial")');
  if (await startTrialBtn.count() > 0) {
    await startTrialBtn.click();
    await sleep(4500);
  }

  console.log('🎬 Concluding Master Demo Recording at exactly 1:55 (115s)...');
  await sleep(6500); // Final conclusion and branding showcase

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
    
    console.log(`✅ Success! Video recorded and saved to: ${targetVideo}`);
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
