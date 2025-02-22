import { chromium } from 'playwright';
import { createServer } from 'vite';

async function recordGigVideo(gigType) {
    const server = await createServer({
        server: {
            port: 5173
        }
    });
    await server.listen();
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: { dir: './videos/', size: { width: 1280, height: 720 } }
    });

    const page = await context.newPage();
    await page.goto(`http://localhost:5173/index.html?gig=${gigType}`);

    // Wait for assets and animations to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(16000); // Ensure full 16s recording

    console.log(`Recording finished for ${gigType}`);

    // Close browser and save video
    await context.close();
    await browser.close();
    await server.close();
}

// List of gigs to record
const gigs = ['website', 'chatbot', 'e2e', 'cloud', 'serverless'];

(async () => {
    for (const gig of gigs) {
        console.log(`Recording video for: ${gig}`);
        await recordGigVideo(gig);
    }
    console.log('All videos recorded successfully!');
})();