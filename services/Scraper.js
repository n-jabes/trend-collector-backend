import puppeteer from 'puppeteer';

export async function scrapeGoogleTrends(keyword, region = 'US', timeframe = 'today 12-m') {
  const browser = await puppeteer.launch({ headless: false }); // Visible browser for debugging
  const page = await browser.newPage();

  try {
    // Navigate to Google Trends
    const trendsUrl = `https://trends.google.com/trends/explore?q=${encodeURIComponent(keyword)}&geo=${region}&date=${timeframe}`;
    await page.goto(trendsUrl, { waitUntil: 'domcontentloaded' });

    // Wait for the page to load (fallback to 'body' for testing)
    await page.waitForSelector('body', { timeout: 30000 });

    // Optional: Log content for debugging
    const pageContent = await page.content();
    console.log(pageContent);

    // Attempt scraping data
    const trendData = await page.evaluate(() => {
      const data = [];
      const timelineItems = document.querySelectorAll('.widget-container .graph');
      timelineItems.forEach(item => {
        const time = item.querySelector('.widget-container__date')?.innerText || '';
        const value = item.querySelector('.widget-container__value')?.innerText || '';
        if (time && value) {
          data.push({ time, value });
        }
      });
      return data;
    });

    console.log('Scraped Trend Data:', trendData);

    return trendData;

  } catch (error) {
    console.error('Error scraping Google Trends:', error);
    return null;
  } finally {
    await browser.close();
  }
}
