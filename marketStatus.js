import config from "./config.js";

let marketStatus = [];
const isStockExchangeOpenNow = isStockExchangeOpen();

export async function initMarketStatus() {
    renderSwedenOpenHours();
}

async function renderSwedenOpenHours() {
    const marketStatusUl = document.querySelector("#marketstatus-list");

    let marketStatusLi = document.createElement("li");

    marketStatusLi.textContent = `Stockholmsbörsen idag: ${isStockExchangeOpenNow.result}`;
    marketStatusUl.appendChild(marketStatusLi);


    marketStatusUl.appendChild(marketStatusLi);
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

function isStockExchangeOpen() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    // Helgdagar och speciella avvikande dagar
    const holidays = [
        { date: new Date(now.getFullYear(), 0, 5), name: "Halvdag" },
        { date: new Date(now.getFullYear(), 0, 6), name: "Trettondagen" },
        { date: new Date(now.getFullYear(), 3, 6), name: "Halvdag" },
        { date: new Date(now.getFullYear(), 3, 7), name: "Långfredagen" },
        { date: new Date(now.getFullYear(), 3, 10), name: "Annandag påsk" },
        { date: new Date(now.getFullYear(), 4, 1), name: "Första maj" },
        { date: new Date(now.getFullYear(), 4, 17), name: "Halvdag" },
        { date: new Date(now.getFullYear(), 4, 18), name: "Kristi himmelsfärd" },
        { date: new Date(now.getFullYear(), 5, 6), name: "Sveriges nationaldag" },
        { date: new Date(now.getFullYear(), 5, 23), name: "Midsommarafton" },
        { date: new Date(now.getFullYear(), 10, 3), name: "Halvdag" },
        { date: new Date(now.getFullYear(), 11, 25), name: "Juldagen" },
        { date: new Date(now.getFullYear(), 11, 26), name: "Annandag jul" }
    ];

    // Kontrollera om det är helgdag eller avvikande dag
    for (const holiday of holidays) {
        if (now.getTime() === holiday.date.getTime()) {
            if (holiday.name === "Halvdag" && hour < 12) {
                return { result: "Halvdag" }; // Börsen öppen halvdag
            } else {
                return { result: "Stängt" }; // Börsen stängd helgdag eller avvikande dag
            }
        }
    }

    // Kontrollera vardagar
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        if (hour >= 9 && hour < 17) {
            return { result: "09:00-17:30" }; // Börsen öppen vardagar 09:00-17:00
        } else if (hour === 17 && minutes <= 30) {
            return { result: "09:00-17:30" };  // Börsen öppen vardagar 09:00-17:30
        }
    }

    // Börsen stängd på helgen
    return { result: "Stängt" };
}

