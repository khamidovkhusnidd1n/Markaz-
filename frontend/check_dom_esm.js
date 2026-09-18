import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log("Navigating to page...");
  await page.goto('http://localhost:3000/#/departments/4', { waitUntil: 'networkidle0' });
  
  console.log("Evaluating DOM...");
  const hasSection = await page.evaluate(() => {
    return document.body.innerHTML.includes("Qilingan ishlar");
  });
  
  const hasTest = await page.evaluate(() => {
    return document.body.innerHTML.includes("TEST:");
  });
  
  const text = await page.evaluate(() => {
    return document.body.innerText;
  });
  
  console.log("Contains section:", hasSection);
  console.log("Contains TEST box:", hasTest);
  console.log("First 500 chars:", text.substring(0, 500));
  
  await browser.close();
})();
