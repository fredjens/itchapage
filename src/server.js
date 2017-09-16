const express = require('express');
const bodyParser = require('body-parser');
const og = require('open-graph');
const scrape = require('scrape-url');

const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Configure router
 */

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');

    if ('OPTIONS' == req.method) {
      res.send(200);
    }

    else {
      next();
    }
});

/**
 * Set a default route
 */

router.get('/', function(req, res) {
    res.send('🐭 Itch a page');
});

/**
 * Set up itching route
 */

router.get('/itch', function(req, res) {
    const { url } = req.query;

    /**
     * Fix the source
     */
    let sourceUrl = url;

    if (!sourceUrl.startsWith("http://") || !sourceUrl.startsWith("https://")) {
        sourceUrl = `http://${url}`;
    }

    const domain = url
    .replace('http://', '')
    .replace('https://', '')
    .replace('www.', '')
    .split('.')[0];


    /**
     * Check if there was submited something
     */

    if (!url) {
        console.log('🐭 no url');
        res.json(500, {
           error: '🐭 enter a correct url'
        });
    }

    if (url.length < 2) {
        console.log('🐭 to short url');
        res.json(500, {
           error: '🐭 enter a correct url'
        });
    }

    /**
     * Regular web scraping
     */

    function scrapeUrl(url) {
        console.log('🐭  try to scrape instead...');

        scrape(url, ['h1'], function (err, h1) {
            if (err) {
                console.log('🐭 invalud url when trying to scrape ', err);
                res.json(500, {
                   error: '🐭 did not manage to scrape'
                });
            }

            if (!h1) {
                console.log('🐭 no title found');
                res.json(500, {
                   error: '🐭 no title found'
                });
            }

            /**
             * Try to pull out correct title
             */

            let title = null;
            console.log(h1);

            if (h1.length > 0) {
                title = h1[0].text().replace(/(\r\n|\n|\r|\t)/gm,'');
            }

            if (!title) {
                console.log('🐭 no title');
                res.json(500, {
                    error: '🐭 did not find anyting here...'
                });
            }

            res.json({
                title: title,
                source,
                source: {
                    url: sourceUrl,
                    domain,
                }
            });
        });
    }

    /**
     * Open graph
     */

    return og(url, function(err, meta) {
        if (err) {
            console.log('🐭 invalid url');
            res.json(500, {
                error: '🐭 enter a correct url'
            });
        }

        if (!meta.title) {
            return scrapeUrl(url);
        }

        console.log('🐭 found open graph tags');

        const image = null;

        if (meta.image) {
            const { url: image } = meta.image;

            if (Array.isArray(image)) {
                image = image[0];
            }
        }

        res.json({
            title: meta.title,
            intro: meta.description,
            image,
            source: {
                url: sourceUrl,
                domain,
            }
        })
    })
});

app.use('/', router);

app.listen(port);

console.log('🐭 Itching on ' + port);
