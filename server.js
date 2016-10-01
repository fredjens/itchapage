var express = require('express');
var bodyParser = require('body-parser');
var og = require('open-graph');
var scrape = require('scrape-url');

var app = express();
const port = process.env.PORT || 8080;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function(req, res) {
    res.end("Itch a page");
});

router.get('/itch/', function(req, res) {
    var url = req.query.url;

    if (url.length > 8) {
        og(url, function(err, meta) {
            if (meta.title) {
                var image = null;
                if (meta.image) {
                    image = meta.image.url;
                }
                res.json({
                    title: meta.title,
                    intro: meta.description,
                    image:  image,
                    source:  meta.url
                })
            } else {
                scrape(url, ['h1'], function (err, h1) {
                    var title = null;
                    if (h1.length > 0) {
                        title = h1[0].text().replace(/(\r\n|\n|\r|\t)/gm,"");

                    }
                    res.json({
                        title: title,
                        source:  url
                    });
                });
            }
        })
    } else {
        res.end('enter a correct url');
    }
});

app.use('/', router);

app.listen(port);
console.log('Magic happens on ' + port);
