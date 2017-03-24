/*
MIT License

Copyright (c) 2017 Adam Moses

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// avaible topic types, short code and longname
// h = headlines
// n = national
// w = world
// e = entertainment
// b = business
// s = sports
// t = sci/tech
// tc = technology

// parses the data returned from the RSS request
// returns the data object sent back via the callback
function parseGoogleNewsRSSData(fileData) {
    // sanity check that this is valid google news RSS
    if (fileData.indexOf('news-feedback@google.com') != -1) {
        // set an empty array of news story objects
        var allGoogleNewsData = [ ];
        var params = {normalizeWhitespace: true, xmlMode: true};
        // load the html into the cheerio doc
        var cheerio = require("cheerio");
        var fullDoc = cheerio.load(fileData, params);    
        // iterate through movies and strip useful parts, add each to return object
        fullDoc('item').each(function(i, elem) {
            // load current item
            var itemDoc = cheerio.load(fullDoc(this).html(), params);
            // break out parts of interest
            // some sections need cleaning so do that as well
            var fullTitleLine = itemDoc('title').text().trim();
            var fullTitleSplitIndex = fullTitleLine.lastIndexOf(' - ');
            var titlePart = fullTitleLine.substring(0, fullTitleSplitIndex);
            var sourcePart = fullTitleLine.substring(fullTitleSplitIndex + 3, fullTitleSplitIndex.length);
            var fullURLPart = itemDoc('link').html().trim();
            var cleanURLPart = fullURLPart.split(';url=')[1];
            var categoryPart = itemDoc('category').html();
            if (categoryPart != null)
                categoryPart = categoryPart.trim();
            var pubDatePart = itemDoc('pubDate').html().trim();
            var fullDescriptionPart = itemDoc('description').text().trim();
            var descriptionStart = fullDescriptionPart.indexOf('</font><br><font size="-1">');
            var descriptionEnd = fullDescriptionPart.indexOf('</font>', descriptionStart + 1);
            var cleanDescriptionPart = fullDescriptionPart.substring(descriptionStart, descriptionEnd);
            var cleanDescriptionPart = cleanDescriptionPart.replace('</font><br><font size="-1">', '');
            var cleanDescriptionPart = cleanDescriptionPart.replace('<b>...</b>', '...');
            // build final object for the current news story
            var fullObject = {  title: titlePart
                                , source: sourcePart
                                , category: categoryPart
                                , pubDate: pubDatePart
                                , fullURL: fullURLPart
                                , cleanURL: cleanURLPart
                                , fullDescription: fullDescriptionPart
                                , cleanDescription: cleanDescriptionPart
                             };                           
            // add thew news story obejct to the array
            allGoogleNewsData.push(fullObject);            
        });
        // return no error state and the collected news story objects
        return {error: false, data: allGoogleNewsData};
    }
    // if sanity check failed, return true error state and an error message
    return {error: errorFlag, errorMessage: 'Fetched RSS data does not contain expected content.', data: null};
}

// returns a proper return object with error and message set as specfied
function parseGoogleNewsRSSParamsErrorHelper(errorMessage) {
    return {error: true
        , errorMessage: errorMessage
        , type: null 
        , terms: null
        , url: null
        };
}

// parse the initial paremeters specfied by the original calling params
// returns well defined types for type, terms, and the calling RSS URL
function parseGoogleNewsRSSParams(params) {
    // get params of interest
    var newsType = params.newsType;
    var newsTypeTerms = params.newsTypeTerms;
    // if missing just one parameter flag error as such
    if ((newsType == undefined) && (newsTypeTerms != undefined))
        return parseGoogleNewsRSSParamsErrorHelper('Parameter newsTypeTerms set with no newsType set.');
    if ((newsType != undefined) && (newsTypeTerms == undefined))
        return parseGoogleNewsRSSParamsErrorHelper('Parameter newsType set with no newsTypeTerms set.');
    // if missing both parameters, set to default
    if ((newsType == undefined) && (newsTypeTerms == undefined)) {
        newsType = 'TOPIC';
        newsTypeTerms = 'HEADLINES';
    }
    // fix case parameters
    newsType = newsType.toUpperCase();
    newsTypeTerms = newsTypeTerms.toUpperCase();
    // expand newsType name if needed
    if (newsType == 'T')
        newsType = 'TOPIC';
    if (newsType == 'Q')
        newsType = 'QUERY';
    // if an invalid newsType set flag error as such
    if ((newsType != 'TOPIC') && (newsType != 'QUERY'))
        return parseGoogleNewsRSSParamsErrorHelper('Invalid newsType parameter specified.');
    // if type is topic
    if (newsType == 'TOPIC') {
        // init the short and long term names of the topic type
        var newsTypeTermTopicShort = null;
        var newsTypeTermTopicLong = null;
        // check the term for either short or long name and then set names accordingly
        if ((newsTypeTerms == 'H') || (newsTypeTerms == 'HEADLINES')) {
            newsTypeTermTopicShort = 'H';
            newsTypeTermTopicLong = 'HEADLINES';
        }
        if ((newsTypeTerms == 'N') || (newsTypeTerms == 'NATIONAL')) {
            newsTypeTermTopicShort = 'N';
            newsTypeTermTopicLong = 'NATIONAL';
        }
        if ((newsTypeTerms == 'W') || (newsTypeTerms == 'WORLD')) {
            newsTypeTermTopicShort = 'W';
            newsTypeTermTopicLong = 'WORLD';
        }        
        if ((newsTypeTerms == 'E') || (newsTypeTerms == 'ENTERTAINMENT')) {
            newsTypeTermTopicShort = 'E';
            newsTypeTermTopicLong = 'ENTERTAINMENT';
        }
        if ((newsTypeTerms == 'B') || (newsTypeTerms == 'BUSINESS')) {
            newsTypeTermTopicShort = 'B';
            newsTypeTermTopicLong = 'BUSINESS';
        }         
        if ((newsTypeTerms == 'S') || (newsTypeTerms == 'SPORTS')) {
            newsTypeTermTopicShort = 'S';
            newsTypeTermTopicLong = 'SPORTS';
        }
        if ((newsTypeTerms == 'T') || (newsTypeTerms == 'SCI/TECH')) {
            newsTypeTermTopicShort = 'T';
            newsTypeTermTopicLong = 'SCI/TECH';
        }
        if ((newsTypeTerms == 'TC') || (newsTypeTerms == 'TECHNOLOGY')) {
            newsTypeTermTopicShort = 'TC';
            newsTypeTermTopicLong = 'TECHNOLOGY';
        }
        // if nothing was set it was a bad topic type flag error as such
        if (newsTypeTermTopicShort == null)
            return parseGoogleNewsRSSParamsErrorHelper('Parameter newsTypeTerms is unknown for newsType TOPIC.');
        // build the request URL
        var newsURL = 'https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=' 
                        + newsTypeTermTopicShort.toLowerCase()
                        + '&output=rss';
        // build the return object                
        return {error: false, errorMessage: null,
                type: 'TOPIC', terms: newsTypeTermTopicLong, url: newsURL};
    }
    // if type is query
    if (newsType == 'QUERY') {
        var newsTypeTermsQuery = newsTypeTerms.toLowerCase().replace(',', '+OR+').replace(' ', '+');
        var newsURL = 'https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&q=' 
                        + newsTypeTermsQuery
                        + '&output=rss';     
        // build the return object                
        return {error: false, errorMessage: null,
                type: 'QUERY', terms: newsTypeTerms, url: newsURL};
    }
    // otherwise return generic error state
    return parseGoogleNewsRSSParamsErrorHelper('Unknown parameter error occured.');
    
    
}

// makes a call to get the HTML from the rotten tomatoes front page
// uses the request package to achieve this
function requestGoogleNewsRSS(params, callback) {
    // parse the params
    var returnObject = parseGoogleNewsRSSParams(params);
    returnObject.data = null;
    // if no error from the parsing object
    if (!returnObject.error) {
        // make a request to the RSS using the URL
        var request = require("request");
        request({uri: returnObject.url}, 
        function(error, response, body) {
            // if no error in the call
            if (!error) {
                // parse the RSS data
                var parsedData = parseGoogleNewsRSSData(body);
                // if parsing runs okay, add data to the return object and return it
                if (parsedData.error == false) {
                    returnObject.error = false;      
                    returnObject.errorMessage = null;
                    returnObject.data = parsedData.data;
                    callback(returnObject);
                }                    
                // otherwise parsing failed, indicate such
                else {
                    returnObject.error = true;
                    returnObject.errorMessage = 'Error with parsing data return from Google News.';
                    callback(returnObject);
                }
            }
            // otherwise indicate bad request
            else {
                returnObject.error = true;
                returnObject.errorMessage = 'Error with request for data from Google News.';
                callback(returnObject);
            }
        });        
    }
    // otherwise send back error true object from original params parsing
    else {
        callback(returnObject);
    }
}

// main export function used by the module
// params = { newsType: 'X', newsTypeTerms: 'Y' }
// callback = function(returnObject)
// specified in detail in readme.md
export.getGoogleNewsRSSScraperData = function(params, callback) {
    requestGoogleNewsRSS(params, callback);
}

// --- the end ---