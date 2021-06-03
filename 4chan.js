const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

var chanThreadUrl = '';
var chanBoardUrl = '';

function scrapeThread(_chanThreadUrl) {
    chanThreadUrl = _chanThreadUrl.replace(/\/+$/, ''); // remove trailing slash
    axios.get(chanThreadUrl).then(response => {
        getDataFromThread(response.data)
    }).catch(error => {
        console.log(error)
    });
}

function scrapeBoard(_chanBoardUrl) {
    chanBoardUrl = _chanBoardUrl.replace(/\/+$/, ''); // remove trailing slash
    axios.get(chanBoardUrl).then(response => {
        getDataFromBoard(response.data)
    }).catch(error => {
        console.log(error)
    });
}

function getDataFromThread(_html) {
    data = [];
    const $ = cheerio.load(_html);
    $('a.fileThumb').each((i, elem) => {
        let href = $(elem).attr('href');

        data.push({
            link: href
        });

        let threadUrl = chanThreadUrl.substr((chanThreadUrl.lastIndexOf('/') + 1));
        fs.mkdir("images/" + threadUrl, {
            recursive: true
        }, (err) => {
            if (err) throw err;
        });

        axios({
                method: 'get',
                url: "https:" + href,
                responseType: 'stream'
            })
            .then(function(response) {
                let extension = href.substr((href.lastIndexOf('.') + 1));
                let imageName = Math.floor(Math.random() * 1000000000) + '.' + extension;
                response.data.pipe(fs.createWriteStream("images/" + threadUrl + "/" + imageName))
            });
    });
}

function getDataFromBoard(_html) {
    const $ = cheerio.load(_html + "/catalog");
    $('img#thumb').each((i, elem) => {
        //let href = $(elem).attr('href');
        console.log($(elem).attr('id'));
        //getDataFromThread("https://boards.4chan.org" + href);
    });
}

exports.scrapeThread = scrapeThread;
exports.scrapeBoard = scrapeBoard;