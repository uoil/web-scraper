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

app.post('/scrapeChan', urlencodedParser, function (request, response) {
	chanScraper.scrape(request.body.fullUrl);
	console.log("Downloading 4chan thread (" + request.body.fullUrl + ") ...");
	response.redirect('/');
	response.end();
});

app.post('/scrapeReddit', urlencodedParser, function (request, response) {
	redditScraper.scrape(request.body.fullUrl);
	console.log("Downloading subreddit (" + request.body.fullUrl + ") ...");
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