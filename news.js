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

        aElement.setAttribute('href', article.url);
        aElement.textContent = article.title;

        newsLi.appendChild(aElement);
        newsUl.appendChild(newsLi);
    });

}

async function get5LatestNewsFromApi() {
    const apiUrl = `https://newsapi.org/v2/everything?q=ekonomi%20OR%20aktier%20OR%20valuta%20OR%20finans%20OR%20krypto&apiKey=${config.API_KEY_NEWSAPI}&language=sv`;

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

            // news = data.articles;

            let save5latestNews = [];

            let counter = 0;
            for (let article of data.articles) {
                if (counter == 5) {
                    break;
                }
                save5latestNews.push(article);
                counter++;
            }
            news = save5latestNews;

            const lastUpdatesNews = Date.now();

            localStorage.setItem('lastUpdatedNews', lastUpdatesNews.toString());
            localStorage.setItem('news', JSON.stringify(news));

        }
    } catch (error) {
        console.log(error);
        debugger;
    }
}