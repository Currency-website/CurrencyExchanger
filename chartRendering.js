import config from './config.js';

export async function initChartRendering() {
    await renderChart();
}

async function renderChart() {
    const dataset = await getAYearsDataForSpecificCurrency();

    const chartTitle = dataset[0].title;
    const canvas = document.getElementById('chartContainer');

    try {
        var chart = new CanvasJS.Chart(canvas, {
            title: {
                text: chartTitle
            },
            axisX: {
                valueFormatString: "DD MMM YYYY",
                interval: 30,
                intervalType: "day"
            },
            axisY: {
                includeZero: false
            },
            data: [{
                type: "candlestick", // Ändra typen till "candlestick"
                risingColor: "#008000", // Färg för stigande staplar (bättre valuta)
                fallingColor: "	#FF0000", // Färg för fallande staplar (sämre valuta)
                dataPoints: dataset.map(data => ({
                    x: data.x,
                    y: [data.y.open, data.y.high, data.y.low, data.y.close]
                }))
            }]
        });

        chart.render();
    }
    catch {
        console.log(error);
        debugger;
    }

}


async function getAYearsDataForSpecificCurrency() {
    const todaysDate = new Date();
    const yesterDaysDate = new Date(todaysDate);
    yesterDaysDate.setDate(todaysDate.getDate() - 1);

    const formattedYesterdaysDate = yesterDaysDate.toISOString().split('T')[0];

    const aYearFromYesterdaysDateDate = new Date(yesterDaysDate.getFullYear() - 1, yesterDaysDate.getMonth(), yesterDaysDate.getDate());
    const formattedDateAYearFromYesterday = aYearFromYesterdaysDateDate.toISOString().split('T')[0];

    // curl -G https://api.currencyapi.com/v3/historical?date=2022-01-01 \
    // -H "apikey: YOUR-API-KEY"
    //VI MÅSTE ÄNDRA HÄR DÅ RANGE INTE FUNKAR MED SMALL SUBSCRIPTION

    const apiUrl = `https://api.forexrateapi.com/v1/timeframe?start_date=${formattedDateAYearFromYesterday}&end_date=${formattedYesterdaysDate}&currencies=SEK&api_key=${config.API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const currencyRates = data.data;
        const dateList = Object.keys(data['data']);
        const currencyCode = Object.keys(data['data'][dateList[0]])[0];

        const dataset = dateList.map((date, index) => {
            const currencyData = currencyRates[date][currencyCode];
            const open = index === 0 ? currencyData : currencyRates[dateList[index - 1]][currencyCode];
            const lastIndex = dateList.length - 1;
            const close = index === lastIndex ? currencyData : currencyRates[dateList[index + 1]][currencyCode];
            const currencyValues = Object.values(currencyRates[date]);
            const high = Math.max(open, ...currencyValues, close);
            const low = Math.min(open, ...currencyValues, close);

            return {
                x: new Date(date),
                y: {
                    open,
                    close,
                    high,
                    low
                },
                title: currencyCode
            };
        });

        return dataset;

    } catch (error) {
        console.log(error);
        debugger;
    }
}
