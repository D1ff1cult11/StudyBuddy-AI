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
  console.log('🚀 Launching Edge for God-Level Product Video Demo...');
  
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

  console.log('📱 Step 1: Loading Onboarding Experience...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await sleep(1800);

  // Check if onboarding is visible
  const continueBtn = page.locator('button:has-text("Continue")');
  if (await continueBtn.count() > 0) {
    console.log('✨ Onboarding Slide 1: Scan. Learn. Master.');
    await sleep(1500);
    await continueBtn.click();

    console.log('✨ Onboarding Slide 2: Spaced Repetition (SM-2)...');
    await sleep(1800);
    await continueBtn.click();

    console.log('✨ Onboarding Slide 3: Privacy First & PII Shield...');
    await sleep(1800);
    const getStartedBtn = page.locator('button:has-text("Get Started")');
    await getStartedBtn.click();
    await sleep(1500);
  }

  console.log('🏠 Step 2: Exploring Home Dashboard...');
  await sleep(1500);
  await page.mouse.wheel(0, 220);
  await sleep(1400);
  await page.mouse.wheel(0, -220);
  await sleep(1200);

  console.log('📷 Step 3: Navigating to Magic Scan...');
  const scanButton = page.locator('text=Scan Notes Now').first();
  await scanButton.click();
  await sleep(1800);

  console.log('📝 Step 4: Selecting Sample Notes & Triggering AI Synthesis...');
  const pasteTab = page.locator('button:has-text("Paste Notes")');
  await pasteTab.click();
  await sleep(1200);

  // Click quick sample chip for Cell Biology
  const sampleChip = page.locator('button:has-text("Cell Biology")').first();
  await sampleChip.click();
  await sleep(1400);

  // Trigger synthesis
  const generateBtn = page.locator('button:has-text("Generate Flashcards with AI")');
  await generateBtn.click();

  console.log('⚡ Step 5: AI Digitizing & Synthesizing (Waiting for Deck)...');
  await page.waitForSelector('text=Deck Synthesized!', { timeout: 20000 });
  await sleep(2500);

  console.log('🧠 Step 6: Launching Active Recall Study Mode...');
  const studyBtn = page.locator('button:has-text("Study Now")');
  await studyBtn.click();
  await sleep(1800);

  // Card 1
  console.log('🃏 Card 1 Flip & SM-2 Rating...');
  await page.keyboard.press('Space');
  await sleep(2000);
  const goodBtn1 = page.locator('button:has-text("Good")');
  await goodBtn1.click();
  await sleep(1500);

  // Card 2
  console.log('🃏 Card 2 Flip...');
  await page.keyboard.press('Space');
  await sleep(2000);
  const easyBtn2 = page.locator('button:has-text("Easy")');
  await easyBtn2.click();
  await sleep(1500);

  // Card 3
  console.log('🃏 Card 3 Flip...');
  await page.keyboard.press('Space');
  await sleep(2000);
  const goodBtn3 = page.locator('button:has-text("Good")');
  await goodBtn3.click();
  await sleep(1500);

  // Card 4
  console.log('🃏 Card 4 Flip & Mastery Celebration...');
  await page.keyboard.press('Space');
  await sleep(2000);
  const easyBtn4 = page.locator('button:has-text("Easy")');
  await easyBtn4.click();
  await sleep(3000); // Admire confetti celebration & fanfare

  console.log('🎯 Step 7: Testing AI Diagnostic Quiz...');
  await page.goto('http://localhost:3000/quiz', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Question 1/', { timeout: 15000 });
  await sleep(1600);

  // Select an option
  const optionBtn = page.locator('.glass-panel button').first();
  if (await optionBtn.count() > 0) {
    await optionBtn.click();
    await sleep(1500);
    const nextQBtn = page.locator('button:has-text("Next Question")');
    if (await nextQBtn.count() > 0) {
      await nextQBtn.click();
      await sleep(1500);
    }
  }

  console.log('📚 Step 8: Navigating to Library & Universal Export...');
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await sleep(1600);

  // Click Copy Markdown
  const copyBtn = page.locator('button[title="Copy as Markdown"]').first();
  if (await copyBtn.count() > 0) {
    await copyBtn.click();
    await sleep(1500);
  }

  console.log('💎 Step 9: Demonstrating Pro Tier & Commercial Monetization...');
  await page.goto('http://localhost:3000/paywall', { waitUntil: 'networkidle' });
  await sleep(2200);

  // Smooth scroll paywall features
  await page.mouse.wheel(0, 180);
  await sleep(1800);

  console.log('🎬 Final Step: Concluding recording session...');
  await sleep(1500);

  await context.close();
  await browser.close();

  // Find the video file generated
  const files = fs.readdirSync(RECORDING_DIR).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    // Sort by mtime to get newest
    const sorted = files.map(f => ({
      name: f,
      time: fs.statSync(path.join(RECORDING_DIR, f)).mtime.getTime()
    })).sort((a, b) => b.time - a.time);

    const latestVideo = path.join(RECORDING_DIR, sorted[0].name);
    const targetVideo = path.join(ARTIFACT_DIR, 'studybuddy_official_demo.webm');
    fs.copyFileSync(latestVideo, targetVideo);
    console.log(`✅ Success! Video recorded and saved to: ${targetVideo}`);
    console.log(`Size: ${(fs.statSync(targetVideo).size / (1024 * 1024)).toFixed(2)} MB`);
  } else {
    console.warn('No video file found in recording directory.');
  }
}

run().catch(err => {
  console.error('Error recording demo:', err);
  process.exit(1);
});
