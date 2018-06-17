const puppeteer = require('puppeteer');

// https://github.com/GoogleChrome/puppeteer/issues/651
function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto('https://ieeexplore.ieee.org/xpl/tocresult.jsp?isnumber=6078463&punumber=2945',
                    { waitUntil: "networkidle2" });
    
    const ids = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("h3 span")).map(x => x.id.split("-")[3]);
    });
    for (var i=0; i<ids.length; ++i) {
        var id = ids[i];
        await delay(10000); // nice and slow, let's not poke the bee's nest
        await page.goto('https://ieeexplore.ieee.org/document/' + id + '/',
                        { waitUntil: "networkidle2" });
        await page.screenshot({ path: 'screenshots/' + id + '.png' });
        var doi = await page.evaluate(() => {
            return document.querySelector("div.stats-document-abstract-doi a").textContent;
        });
        var title = await page.evaluate(() => {
            return document.querySelector("h1.document-title span").textContent.trim();
        });
        console.log("DOI: ", doi, "Title: '", title, "'");
    }
    browser.close();
}

run();
