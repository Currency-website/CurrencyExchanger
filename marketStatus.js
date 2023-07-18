import config from "./config.js";

let marketStatus = [];

export async function initMarketStatus() {
    await getMarketStatusFromApi();
    await renderMarketStatus();
}

async function renderMarketStatus() {
    const marketStatusUl = document.querySelector("#marketstatus-list");

    let marketStatusLi = document.createElement("li");
    // let aElement = document.createElement("a");
    // aElement.classList.add("marketStatusLinks");
    // aElement.textContent = `${market}: ${status}`;

    for (const market in marketStatus) {
        const status = marketStatus[market];

        let marketStatusLi = document.createElement("li");
        marketStatusLi.textContent = `${market}: ${status}`;
        marketStatusUl.appendChild(marketStatusLi);
    }

    marketStatusUl.appendChild(marketStatusLi);
}


async function getMarketStatusFromApi() {
    const apiUrl = `https://api.polygon.io/v1/marketstatus/now?apiKey=${config.API_KEY_POLYGON}`;

    //ddatumet då det senast uppdaterades till LS
    const storedlastUpdatedMarketStatus = localStorage.getItem('lastUpdatedMarketStatus');
    const storedMarketStatus = localStorage.getItem('marketStatus');

    try {
        if (
            storedlastUpdatedMarketStatus &&
            Date.now() - parseInt(storedlastUpdatedMarketStatus) < 24 * 60 * 60 * 1000 &&
            storedMarketStatus
        ) {
            marketStatus = JSON.parse(storedMarketStatus);

        } else {
            const response = await fetch(apiUrl);
            const data = await response.json();

            marketStatus = {
                afterHours: data.afterHours,
                currencies: data.currencies,
                earlyHours: data.earlyHours,
                exchanges: data.exchanges,
                indicesGroups: data.indicesGroups,
                market: data.market,
                serverTime: data.serverTime
            };

            const lastUpdatedMarketStatus = Date.now();

            localStorage.setItem('lastUpdatedMarketStatus', lastUpdatedMarketStatus.toString());
            localStorage.setItem('marketStatus', JSON.stringify(marketStatus));


        }
    } catch (error) {
        console.log(error);
        debugger;
    }

    // {
    //     "afterHours": false,
    //     "currencies": {
    //         "crypto": "open",
    //         "fx": "open"
    //     },
    //     "earlyHours": true,
    //     "exchanges": {
    //         "nasdaq": "extended-hours",
    //         "nyse": "extended-hours",
    //         "otc": "extended-hours"
    //     },
    //     "indicesGroups": {
    //         "s_and_p": "open",
    //         "societe_generale": "open",
    //         "msci": "closed",
    //         "ftse_russell": "closed",
    //         "mstar": "open",
    //         "mstarc": "open",
    //         "cccy": "open",
    //         "nasdaq": "closed",
    //         "dow_jones": "closed"
    //     },
    //     "market": "extended-hours",
    //     "serverTime": "2023-07-18T09:04:11-04:00"
    // }
}