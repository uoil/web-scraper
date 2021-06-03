const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const chanScraper = require('./4chan')
const redditScraper = require('./reddit')
const app = new express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname + '/public'));

app.post('/scrapeChanThread', urlencodedParser, function (request, response) {
    console.log("Downloading 4chan thread (" + request.body.fullUrl + ") ...");
	chanScraper.scrapeThread(request.body.fullUrl);
	response.redirect('/');
	response.end();
});

app.post('/scrapeChanBoard', urlencodedParser, function (request, response) {
    console.log("Downloading 4chan board (" + request.body.fullUrl + ") ...");
	chanScraper.scrapeBoard(request.body.fullUrl);
	response.redirect('/');
	response.end();
});

app.post('/scrapeReddit', urlencodedParser, function (request, response) {
    console.log("Downloading subreddit (" + request.body.fullUrl + ") ...");
    if (!request.body.fullUrl.includes("reddit.com")) {
        redditScraper.unlock("https://old.reddit.com/over18?dest=https://old.reddit.com/r/" + request.body.fullUrl + "/");
        redditScraper.scrape("https://old.reddit.com/r/" + request.body.fullUrl + "/");
    } else {
        redditScraper.unlock("https://old.reddit.com/over18?dest=" + request.body.fullUrl);
        redditScraper.scrape(request.body.fullUrl);
    }
	response.redirect('/');
	response.end();
});

app.post('/findBookLibgen', urlencodedParser, function (request, response) {
	console.log("Finding book on libgen (" + request.body.bookTitle + ") ...");
	response.redirect('//libgen.fun/search.php?req=' + request.body.bookTitle);
	response.end();
});

app.post('/findBookZlibrary', urlencodedParser, function (request, response) {
	console.log("Finding book on zlibrary (" + request.body.bookTitle + ") ...");
	response.redirect('//1lib.us/s/' + request.body.bookTitle);
	response.end();
});

app.post('/findBookArchive', urlencodedParser, function (request, response) {
	console.log("Finding book on archive (" + request.body.bookTitle + ") ...");
	response.redirect('//archive.org/details/texts?query=' + request.body.bookTitle);
	response.end();
});


app.listen(8000);