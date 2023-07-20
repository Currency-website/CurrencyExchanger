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
    const apiUrl = `https://gnews.io/api/v4/search?q=inflation%20OR%20stockmarket%20OR%20crypto%20OR%20currency&lang=en&country=sv&max=10&apikey=${config.API_KEY_GNEWS}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        let save5latestNews = [];

        let counter = 0;

        if (data.articles) {
            for (const article of data.articles) {
                if (counter === 5) {
                    break;
                }
                save5latestNews.push(article);
                counter++;
            }
            news = save5latestNews;

            const lastUpdatesNews = Date.now();

            localStorage.setItem('lastUpdatedNews', lastUpdatesNews.toString());
            localStorage.setItem('news', JSON.stringify(news));

            await renderNews(); // Uppdatera nyhetslistan efter att nyheterna har hämtats och sparats
        }
    } catch (error) {
        console.log(error);
        debugger;
    }
}
