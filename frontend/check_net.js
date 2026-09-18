import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('response', async (response) => {
    if (response.url().includes('all-data')) {
      console.log('API Response URL:', response.url());
      console.log('Status:', response.status());
      const data = await response.json().catch(()=>null);
      if (data && data.departments) {
        const d = data.departments.find(x => x.id === 4);
        console.log('Posts in API response:', d.department_posts ? d.department_posts.length : 'MISSING');
      }
    }
  });
  
  await page.goto('http://localhost:3000/#/departments/4', { waitUntil: 'networkidle0' });
  await browser.close();
})();
