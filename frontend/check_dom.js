const puppeteer = require('puppeteer');

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
  
  const posts = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3')).map(h => h.innerText);
    return headings;
  });
  
  console.log("Contains section:", hasSection);
  console.log("Headings on page:", posts);
  
  await browser.close();
})();
