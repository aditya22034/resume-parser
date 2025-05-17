const puppeteer = require('puppeteer');

async function scrapeJobs(keyword = 'software developer') {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const query = keyword.replace(/\s+/g, '+');
  await page.goto(`https://www.indeed.com/jobs?q=${query}&l=`);

  const jobs = await page.evaluate(() => {
    const jobCards = document.querySelectorAll('.result');
    const scraped = [];

    jobCards.forEach(card => {
      const title = card.querySelector('h2.jobTitle')?.innerText || '';
      const company = card.querySelector('.companyName')?.innerText || '';
      const location = card.querySelector('.companyLocation')?.innerText || '';
      const description = card.querySelector('.job-snippet')?.innerText || '';
      const url = card.querySelector('a')?.href || '';

      if (title && description) {
        scraped.push({ title, company, location, description, url });
      }
    });

    return scraped;
  });

  await browser.close();
  return jobs;
}

module.exports = scrapeJobs;
