const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const dom = require('linkedom');

var redditUrl = '';
var redditUrlUnlock = '';

function unlock(_redditUrlUnlock) {
    redditUrlUnlock = _redditUrlUnlock.replace(/\/+$/, ''); // remove trailing slash

    axios.get(redditUrlUnlock).then(response => {
        const {
          window, document, customElements,
          HTMLElement,
          Event, CustomEvent
        } = dom.parseHTML(response.data);
        const button = document.querySelectorAll("button.c-btn.c-btn-primary")[1];
        button.click();
    }).catch(error => {
        console.log(error)
    });
}

function scrape(_redditUrl) {
    redditUrl = _redditUrl.replace(/\/+$/, ''); // remove trailing slash

    axios.get(redditUrl).then(response => {
        getData(response.data)
    }).catch(error => {
        console.log(error)
    });
}

let getData = html => {
    data = [];
    const $ = cheerio.load(html);
    $('div.link').each((i, elem) => {
        let dataUrl = $(elem).attr('data-url');
        if (!dataUrl.includes("i.redd.it"))
            return;

        data.push({
            link: dataUrl
        });

        let subUrl = redditUrl.substr((redditUrl.lastIndexOf('/') + 1));
        fs.mkdir("images/" + subUrl, {
            recursive: true
        }, (err) => {
            if (err) throw err;
        });

        axios({
            method: 'get',
            url: dataUrl,
            responseType: 'stream'
        }).then(function(response) {
            let href = dataUrl;
            let extension = href.substr((href.lastIndexOf('.') + 1));
            let imageName = Math.floor(Math.random() * 1000000000) + '.' + extension;
            response.data.pipe(fs.createWriteStream("images/" + subUrl + "/" + imageName))
        }).catch(error => {
            console.log('error: ', error)
        });
    });
    console.log(data);
}

exports.unlock = unlock;
exports.scrape = scrape;
/*
    module.exports = {
    scrape
    }
*/