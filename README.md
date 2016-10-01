# :mouse: Itch a page

Itch a page is a simple API To scrape title, intro and image from an webpage using Open Graph with web scraping as fallback.

[http://itchapage.herokuapp.com/?url=your_url](http://itchapage.herokuapp.com/itch?url=your_url)

Url: Need to be a full url, i.e.: `https://medium.com/front-end-hacking/react-for-designers-3fbc7b6560dd#.9kman3j7w`

[Test request](http://itchapage.herokuapp.com/itch?url=http://iallenkelhet.no/2016/01/14/cookie-advarselen-ma-doy/)

## Dependencies
* NodeJS
* Express
* [open-graph](https://www.npmjs.com/package/open-graph)
* [scrape-url](https://www.npmjs.com/package/scrape-url)
