const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

var chanUrl = '';

function scrape(_chanUrl) {
	chanUrl = _chanUrl.replace(/\/+$/, ''); // remove trailing slash
	
	axios.get(chanUrl).then(response => {
        getData(response.data)
		}).catch(error => {
        console.log(error)
	});
}

let getData = html => {
    data = [];
    const $ = cheerio.load(html);
    $('a.fileThumb').each((i, elem) => {
        data.push({
			link : $(elem).attr('href')
		});
		
		let threadUrl = chanUrl.substr((chanUrl.lastIndexOf('/') + 1));
		fs.mkdir("images/" + threadUrl, { recursive: true }, (err) => {
			if (err) throw err;
		});
		
        axios({
            method: 'get',
            url: "https:" + $(elem).attr('href'),
            responseType: 'stream'
		})
		.then(function (response) {
			let href = $(elem).attr('href');
			let extension = href.substr((href.lastIndexOf('.') + 1));
            let imageName = Math.floor(Math.random() * 1000000000) + '.' + extension;
            response.data.pipe(fs.createWriteStream("images/" + threadUrl + "/" + imageName))
		});
	});
}

exports.scrape = scrape;