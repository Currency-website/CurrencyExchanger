document.addEventListener('DOMContentLoaded', main);
import config from './config.js';
import { initCurrencyExchanger } from './currencyExchanger.js';
import { addEventListenersForCurrencyExchanger } from './currencyExchanger.js';
import { initChartRendering } from './chartRendering.js';


async function main() {

  await initCurrencyExchanger();
  await addEventListenersForCurrencyExchanger();
  await initChartRendering();
}



