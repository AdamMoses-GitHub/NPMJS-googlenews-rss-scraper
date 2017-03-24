// Usage example of googlenews-rss-scraper package
// See https://www.npmjs.com/package/googlenews-rss-scraper

var iGoogleNewsRSSScraper = require('googlenews-rss-scraper');

console.log('Usage example of the googlenews-rss-scraper package.')

iGoogleNewsRSSScraper.getGoogleNewsRSSScraperData( function(data) {
        if (!data.error) {
            console.log(JSON.stringify(data, null, 2));      
        }
        else {
            console.log('Some error occured.');
        }
    });