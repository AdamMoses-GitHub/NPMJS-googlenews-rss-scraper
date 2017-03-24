## About

This package scrapes a Google News RSS feed for data.

The information returned includes news stories based on a specified topic or query.

Topics available are headlines (the default), US National news, world news, entertainment, business, sports, sci/tech, and technology. 

Queries can be anything in the style of a comma-delimited list string, i.e. "poker" or "space,spaceships,stars,astronomy". 

For each news story some information will be returned:
* Title
* Source; i.e. 'Washington Times' or 'New York Times'
* Category
* Publishing Date
* URL; both the full and cleaned URLs
* Description; both the full and cleaned descriptions

## Installation

```
npm install googlenews-rss-scraper
```

## Usage

There is only one method to this package: ```getGoogleNewsRSSScraperData(params, callback)```

This method requries a params object, which has two fields: newsType and newsTypeTerms. These parameters are specified in more detail in the parameters section.

This method requires the use of a callback, which can be specified or anonymous. The callback has one parameters in the form of ```function(data)```. This data object is described in more detail in the return

If there was an error, like failed HTML request or bad parsing, **error** will be true and **data** will be **null**. Otherwise, **error** will be false and **data** will be a javascript object. 

## Paramters Format

The method ```getGoogleNewsRSSScraperData(params, callback)``` requires use of a parameters variable. 

This variable is a JSON object containing two members: **newsType** and **newsTypeTerms**.

**newsType** specifies the type of news to gather, which can either be a pre-defined topic that Google already organizes news by, or it can be a specific query that you request. To get news based on a topic **newsType** should be set to ```'TOPIC'`` and to get news based on a query **newsType** should be set to ```'T'``.

**newsTypeTerms** specifies the complimentary topic type or query search terms following the selection set in **newsType**. Examples values for a **newsTypeTerms** for a topic are ```'HEADLINES'`` or ```'SPORTS'```.  Example values for a **newsTypeTerms** for a query are ```'nintendo,mario,gaming'`` or ```'spiders,moths,insects'``.

### Specifying A Topic Type

The list below specifies the currently available topic types Google News has available. Note this list is subject to change at anytime. Note also that these Google News topic types where developed in the United States, so use in other countries may vary, especially in the case of the 'NATIONAL' news topic type. 

When setting the **newsTypeTerms** the value must be an exact match for a value below, otherwise an error may be returned.

* HEADLINES
* NATIONAL
* WORLD
* ENTERTAINMENT
* BUSINESS
* SPORTS
* SCI/TECH
* TECHNOLOGY

### Specifying A Query

Queries are specified as a single string containing comma-seperated values. The news returned will be based on Google News searches of those values, and are considered to be working on under an OR operation instead of an AND.

In the event of specifying a query that is very niche or not currently news-worthy, it is possible to gather no news.

### Parameter Examples

```javascript

{  newsType: 'TOPIC', newsTypeTerms: 'SPORTS' }

{  newsType: 'TOPIC', newsTypeTerms: 'NATIONAL' }

{  newsType: 'TOPIC', newsTypeTerms: 'SCI/TECH' }

{  newsType: 'QUERY', newsTypeTerms: 'lions,tigers' }

{  newsType: 'QUERY', newsTypeTerms: 'miami dolphins' }

{  newsType: 'QUERY', newsTypeTerms: 'restaurants,food' }
```


The **data** object has three keys: **openingThisWeek**, **boxOffice**, **comingSoon**. Each of these keys has for a value an array of movie objects. 

Each movie object contains a **title** and **meter** key, where **title** is the name of the movie and **meter** is it's Rotten Tomato meter score. Note that if no score is available this value can be equal to "No Score Yet" rather than "93%" or "45%".

The **openingThisWeek** and *comingSoon** keys will have movies with a **date** which references the movie's release date. This value will be in the form of "Mar 3" or "Sep 12".

The **boxOffice** key will have movies with a **gross** which references the US domestic gross of that movie. This value will be in the form of "$11.2M" or "$120.7M"

Examine the usage and data return examples for best results.

