import config from './config.js';

export async function initChartRendering() {
    await renderChart();
  
    // await fetchDataAndSaveToFile();
}

async function fetchDataAndSaveToFile() {
    const todaysDate = new Date();
    const sixMonthsAgoDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth() - 6, todaysDate.getDate());
    const ontMonthAgo = new Date(todaysDate.getFullYear(), todaysDate.getMonth() - 1, todaysDate.getDate());
  
     const currentDate = new Date(ontMonthAgo);
    const data = [];
  
    while (currentDate <= todaysDate) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      const apiUrl = `https://api.currencyapi.com/v3/historical?date=${formattedDate}&currencies=SEK&apikey=${config.API_KEY}`;
  
      try {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
  
        const currencyCode = Object.keys(responseData.data)[0];
        const currencyValue = responseData.data[currencyCode].value;
  
        const dataPoint = {
          date: formattedDate,
          currencyCode: currencyCode,
          value: currencyValue
        };
  
        data.push(dataPoint);
  
      } catch (error) {
        console.log(error);
        debugger;
        alert("Något går fel");
        return;
      }
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chartData.json';
    link.click();
  }
  


// async function fetchDataAndSaveToFile() {
//     alert("anropas");
//     const todaysDate = new Date();
//     const sixMonthsAgoDate = new Date(todaysDate.getFullYear(), todaysDate.getMonth() - 6, todaysDate.getDate());

//     const data = [];

//     const currentDate = new Date(sixMonthsAgoDate);
//     while (currentDate <= todaysDate) {
//         const formattedDate = currentDate.toISOString().split('T')[0];
//         const apiUrl = `https://api.currencyapi.com/v3/historical?date=${formattedDate}&currencies=SEK&apikey=${config.API_KEY}`;

//         try {
//             const response = await fetch(apiUrl);
//             const data = await response.json();
//             const currencyRates = data.data;

//             const currencyCode = Object.keys(currencyRates[formattedDate])[0];
//             const values = currencyRates[formattedDate][currencyCode];

//             const open = index === 0 ? values : currencyRates[dateList[index - 1]][currencyCode];
//             const lastIndex = dateList.length - 1;
//             const close = index === lastIndex ? values : currencyRates[dateList[index + 1]][currencyCode];
//             const currencyValues = Object.values(currencyRates[date]);
//             const high = Math.max(open, ...currencyValues, close);
//             const low = Math.min(open, ...currencyValues, close);

//             dataset.push({
//                 x: new Date(formattedDate),
//                 y: {
//                     open,
//                     close,
//                     high,
//                     low
//                 },
//                 title: currencyCode
//             });

//         } catch (error) {
//             console.log(error);
//             debugger;
//             alert("Något går fel");
//             return;
//         }

//         currentDate.setDate(currentDate.getDate() + 1);
//     }

//     const jsonData = JSON.stringify(data);
//     fs.writeFileSync('chartData.json', jsonData);
//     console.log('Data saved to chartData.json');
// }


// async function renderChart() {
//     const dataset = await getAYearsDataForSpecificCurrency();

//     const chartTitle = dataset[0].title;
//     const canvas = document.getElementById('chartContainer');

//     try {
//         var chart = new CanvasJS.Chart(canvas, {
//             title: {
//                 text: chartTitle
//             },
//             axisX: {
//                 valueFormatString: "DD MMM YYYY",
//                 interval: 30,
//                 intervalType: "day"
//             },
//             axisY: {
//                 includeZero: false
//             },
//             data: [{
//                 type: "candlestick", // Ändra typen till "candlestick"
//                 risingColor: "#008000", // Färg för stigande staplar (bättre valuta)
//                 fallingColor: "	#FF0000", // Färg för fallande staplar (sämre valuta)
//                 dataPoints: dataset.map(data => ({
//                     x: data.x,
//                     y: [data.y.open, data.y.high, data.y.low, data.y.close]
//                 }))
//             }]
//         });

//         chart.render();
//     }
//     catch {
//         console.log(error);
//         debugger;
//     }

// }

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
          type: "line", // Ändra typen till "line"
          dataPoints: dataset.map(data => ({
            x: data.x,
            y: data.y // Använd hela objektet som y-värdet
          }))
        }]
      });
  
      chart.render();
    }
    catch (error) {
      console.log(error);
      debugger;
    }
  }
  

async function getAYearsDataForSpecificCurrency() {
    try {
      const response = await fetch('chartData.json');
      const data = await response.json();
  
      const dataset = data.map(dataPoint => ({
        x: new Date(dataPoint.date),
        y: dataPoint.value,
        title: dataPoint.currencyCode
      }));
  
      return dataset;
  
    } catch (error) {
      console.log(error);
      debugger;
    }
  }
  


// async function getAYearsDataForSpecificCurrency() {
    //sen när vi har fler värden för varje dag :
//     try {
//       const response = await fetch('chartData.json');
//       const data = await response.json();
  
//       const dataset = data.map((dataPoint, index) => {
//         const { date, currencyCode, value } = dataPoint;
  
//         const prevDataPoint = index > 0 ? data[index - 1] : null;
//         const nextDataPoint = index < data.length - 1 ? data[index + 1] : null;
  
//         const open = prevDataPoint ? prevDataPoint.value : value;
//         const close = nextDataPoint ? nextDataPoint.value : value;
  
//         const currencyValues = data.map(dataPoint => dataPoint.value);
//         const high = Math.max(open, ...currencyValues, close);
//         const low = Math.min(open, ...currencyValues, close);
  
//         return {
//           x: new Date(date),
//           y: {
//             open,
//             close,
//             high,
//             low
//           },
//           title: currencyCode
//         };
//       });
  
//       return dataset;
  
//     } catch (error) {
//       console.log(error);
//       debugger;
//     }
//   }
  

