import config from './config.js';

export async function initChartRendering() {
    await renderChart();
}

async function renderChart() {

    const dataset = await getAYearsDataForSpecificCurrency();

    const chartTitle = dataset[0].title;
    const canvas = document.getElementById('chartContainer');
    var chart = new CanvasJS.Chart(canvas,
        {

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
            data: [
                {
                    type: "line",

                    dataPoints: dataset
                }
            ]
        });

    chart.render();
}

async function getAYearsDataForSpecificCurrency() {

    const todaysDate = new Date();
    const yesterDaysDate = new Date(todaysDate);
    yesterDaysDate.setDate(todaysDate.getDate() - 1);

    const formattedYesterdaysDate = yesterDaysDate.toISOString().split('T')[0];

    const aYearFromYesterdaysDateDate = new Date(yesterDaysDate.getFullYear() - 1, yesterDaysDate.getMonth(), yesterDaysDate.getDate());
    const formattedDateAYearFromYesterday = aYearFromYesterdaysDateDate.toISOString().split('T')[0];

    const apiUrl = `https://api.freecurrencyapi.com/v1/historical?&currencies=SEK&apikey=${config.API_KEY}&date_from=${formattedDateAYearFromYesterday}&date_to=${formattedYesterdaysDate}`;
    let data = [];

    try {
        const response = await fetch(apiUrl);
        data = await response.json();

        const currencyRates = data.data;             // detta är y-axeln själva värderna
        const dateList = Object.keys(data['data']);  //detta är ju x-axeln datumen
        const currencyCode = Object.keys(data['data'][dateList[0]])[0];  //namnet på valutan

        const dataset = dateList.map(date => ({
            x: new Date(date),
            y: currencyRates[date][currencyCode],
            title: currencyCode
        }));

        return dataset;
    }
    catch (error) {
        console.log(error);
        debugger;
    }
}
