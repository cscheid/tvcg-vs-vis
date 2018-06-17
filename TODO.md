* go over each link on tvcg-urls.json and collect articles (preferably by DOI + title)
  * this is kinda sorta done with `scrape-tvcg.js`, but 
  * CRITICAL: needs pagination
* join the data on vispubdata.csv
* go on google scholar and download citation numbers, preferably split over time
  * Maybe we can use some of these; the central issue 
    * https://www.npmjs.com/package/google-scholar
	* https://github.com/ckreibich/scholar.py
* Create a single CSV file that has a column "inVis", a column "citation count", a column "year", and a column "DOI"
* Write analysis
  * compare them
  * make plots
* ???
* profit
