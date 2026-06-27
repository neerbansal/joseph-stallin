import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:4173');
  await page.screenshot({ path: 'landing.png', fullPage: true });

  await page.click('button:has-text("Get Started")');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: 'desktop.png', fullPage: true });

  await browser.close();
})();
