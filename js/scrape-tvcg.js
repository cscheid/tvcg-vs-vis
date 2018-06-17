const fs = require('fs');
const process = require('process');
const puppeteer = require('puppeteer');
const util = require('util');
const readFile = util.promisify(fs.readFile);

// https://github.com/GoogleChrome/puppeteer/issues/651
function delay(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

async function run() {
    var urls = await readFile("../tvcg-urls.json");
    urls = JSON.parse(String(urls));
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //////////////////////////////////////////////////////////////////////////

    for (var i=0; i<urls.length; ++i) {
        var url = urls[i];
        
        process.stderr.write("Will load " + url + "\n");
        var pageNo = url.slice(55).split('&')[0];
        var outFd = fs.openSync("output/" + pageNo + '.out', 'w');
        await page.goto(url, { waitUntil: "networkidle2" });
    
        const ids = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("h3 span")).map(x => x.id.split("-")[3]);
        });
        
        for (var j=0; j<ids.length; ++j) {
            var id = ids[j];
            await delay(10000); // nice and slow, let's not poke the bee's nest
            process.stderr.write("Will load " + id + "\n");
            await page.goto('https://ieeexplore.ieee.org/document/' + id + '/',
                            { waitUntil: "networkidle2" });
            await page.screenshot({ path: 'screenshots/' + id + '.png' });
            var doi = await page.evaluate(() => {
                return document.querySelector("div.stats-document-abstract-doi a").textContent;
            });
            var title = await page.evaluate(() => {
                return document.querySelector("h1.document-title span").textContent.trim();
            });
            fs.writeSync(outFd, doi + "\n");
            fs.writeSync(outFd, title + "\n");
        }

        fs.closeSync(outFd);
    }
    
    browser.close();
}

run();
