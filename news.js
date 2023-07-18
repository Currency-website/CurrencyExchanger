import config from "./config.js";

let news = [];

export async function initNews() {
    await get5LatestNewsFromApi();
    await renderNews();
}

async function renderNews() {
    const newsUl = document.querySelector("#news-list");

    news.forEach(article => {
        let newsLi = document.createElement("li");
        let aElement = document.createElement("a");
        aElement.classList.add("news-links");
        // const title = article.title;
        // const author = article.author;
        // const publishedDate = new Date(article.published_utc).toLocaleString();
        aElement.setAttribute('href', article.url);
        aElement.textContent = article.title;

        // console.log("Title:", title);
        // console.log("Author:", author);
        // console.log("Published Date:", publishedDate);
        // console.log("Article URL:", articleUrl);
        newsLi.appendChild(aElement);
        newsUl.appendChild(newsLi);
    });

}

async function get5LatestNewsFromApi() {
    const apiUrl = `https://newsapi.org/v2/everything?q=ekonomi%20OR%20aktier%20OR%20valuta%20OR%20finans&apiKey=${config.API_KEY_NEWSAPI}&language=sv`;

    const storedlastUpdatedNews = localStorage.getItem('lastUpdatedNews');
    const storedNews = localStorage.getItem('news');

    try {
        if (
            storedlastUpdatedNews &&
            Date.now() - parseInt(storedlastUpdatedNews) < 24 * 60 * 60 * 1000 &&
            storedNews
        ) {
            news = JSON.parse(storedNews);

        } else {
            const response = await fetch(apiUrl);
            const data = await response.json();

            news = data.articles.slice(0, 5);

            const lastUpdatesNews = Date.now();

            localStorage.setItem('lastUpdatedNews', lastUpdatesNews.toString());
            localStorage.setItem('news', JSON.stringify(news));


        }
    } catch (error) {
        console.log(error);
        debugger;
    }
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