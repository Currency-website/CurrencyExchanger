import config from "./config";

async function get5LatestNewsFromApi(){
    const apiUrl = `https://api.polygon.io/v2/reference/news?apiKey=${config.API_KEY_POLYGON}&limit=5`;

   // "results": [
        //     {
        //         "id": "UjsZFc7xXYOjgsj_PfieM3ool2zDNN0ihUaLWVwumrk",
        //         "publisher": {
        //             "name": "GlobeNewswire Inc.",
        //             "homepage_url": "https://www.globenewswire.com",
        //             "logo_url": "https://s3.polygon.io/public/assets/news/logos/globenewswire.svg",
        //             "favicon_url": "https://s3.polygon.io/public/assets/news/favicons/globenewswire.ico"
        //         },
        //         "title": "REMINDER - Boralex will release its 2023 second quarter financial results on August 14",
        //         "author": "Boralex Inc.",
        //         "published_utc": "2023-08-11T13:30:00Z",
        //         "article_url": "https://www.globenewswire.com/news-release/2023/08/11/2705204/0/en/REMINDER-Boralex-will-release-its-2023-second-quarter-financial-results-on-August-14.html",
        //         "tickers": [
        //             "BLX"
        //         ],
        //         "amp_url": "https://www.globenewswire.com/news-release/2023/08/11/2705204/0/en/REMINDER-Boralex-will-release-its-2023-second-quarter-financial-results-on-August-14.html",
        //         "image_url": "https://ml.globenewswire.com/Resource/Download/bca4d4bc-d0eb-4927-b313-645094ff8821",
        //         "description": "MONTREAL, Aug.  11, 2023  (GLOBE NEWSWIRE) -- Boralex inc. (“Boralex” or the “Company”) (TSX: BLX) announces that the release of the 2023 second quarter results will take place on Monday, August 14, 2023, at 9 a.m.",
        //         "keywords": [
        //             "Calendar of Events"
        //         ]
        //     },
}