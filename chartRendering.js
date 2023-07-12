import config from './config.js';

export async function initChartRendering() {
    await renderChart();
}

async function renderChart() {
    const dataset = await getAYearsDataForSpecificCurrency();

    const chartTitle = dataset[0].title;
    const canvas = document.getElementById('chartContainer');

    try
    {
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
    catch{
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
  
    const apiUrl = `https://api.freecurrencyapi.com/v1/historical?&currencies=SEK&apikey=${config.API_KEY}&date_from=${formattedDateAYearFromYesterday}&date_to=${formattedYesterdaysDate}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      const currencyRates = data.data;
      const dateList = Object.keys(data['data']);
      const currencyCode = Object.keys(data['data'][dateList[0]])[0];
  
      const dataset = dateList.map((date, index) => {
        const currencyData = currencyRates[date][currencyCode];
        const open = index === 0 ? currencyData : currencyRates[dateList[index - 1]][currencyCode];
        const close = currencyData;
        const high = currencyData;
        const low = currencyData;
  

        console.log(open, close, high, low);
  
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
  