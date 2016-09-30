var express = require('express');
var scrape = require('scrape-url');
var bodyParser = require('body-parser');

var app = express();
const port = process.env.PORT || 8080;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function(req, res) {
    var url = req.query.url;

    var title = '';
    var intro = '';
    var image = '';

    if (url.length > 8) {
        scrape(url, ['h1','p', 'img'], function (error, title, intro, image) {
            if(error) {
                console.log(error);
            }

            var title = title[0].text().replace(/(\r\n|\n|\r|\t)/gm,"");
            var intro = intro[0].text().replace(/(\r\n|\n|\r|\t)/gm,"");
            var image = image[0][0].attribs.src;

            res.json({
                title: title,
                intro: intro,
                image: image
            });
        });
    } else {
        console.log('nothing...');
    }
});

app.use('/', router);

app.listen('8081')
console.log('Magic happens on port 8081');
