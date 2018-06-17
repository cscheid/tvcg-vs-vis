const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto('https://ieeexplore.ieee.org/xpl/tocresult.jsp?isnumber=6078463&punumber=2945',
                    { waitUntil: "networkidle2" });
    await page.screenshot({ path: 'screenshots/tvcg.png' });
  
    browser.close();
}

run();
