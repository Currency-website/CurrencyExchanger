document.addEventListener('DOMContentLoaded', main);
import config from './config.js';

let currencyNames = [];

async function main() {
  renderButtons();
  currencyNames = await getAllCurrencyNames();
  addEventListeners();
}

function addEventListeners() {
  const dropdownChoicesFrom = document.querySelector('#dropdown-choices-from');
  const dropdownChoicesTo = document.querySelector('#dropdown-choices-to');
  const dropdownButtonFrom = document.querySelector('.dropdown-button-from');
  const dropdownButtonTo = document.querySelector('.dropdown-button-to');

  dropdownButtonFrom.addEventListener('mouseover', renderDropdownElementsFromButton);
  dropdownButtonFrom.addEventListener('mouseover', () => {
    dropdownChoicesFrom.classList.add('show-dropdown');
  });
  dropdownButtonFrom.addEventListener('mouseleave', () => {
    dropdownChoicesFrom.classList.remove('show-dropdown');
  });
  dropdownChoicesFrom.addEventListener('mouseover', () => {
    dropdownChoicesFrom.classList.add('show-dropdown');
  });
  dropdownChoicesFrom.addEventListener('mouseleave', () => {
    dropdownChoicesFrom.classList.remove('show-dropdown');
  });

  dropdownButtonTo.addEventListener('mouseover', renderDropdownElementsToButton);
  dropdownButtonTo.addEventListener('mouseover', () => {
    dropdownChoicesTo.classList.add('show-dropdown');
  });
  dropdownButtonTo.addEventListener('mouseleave', () => {
    dropdownChoicesTo.classList.remove('show-dropdown');
  });
  dropdownChoicesTo.addEventListener('mouseover', () => {
    dropdownChoicesTo.classList.add('show-dropdown');
  });
  dropdownChoicesTo.addEventListener('mouseleave', () => {
    dropdownChoicesTo.classList.remove('show-dropdown');
  });

  addEventListenerForWhenChoosingCurrencyFrom();
  addEventListenerForWhenChoosingCurrencyTo();
  addEventListenerForWhenSubmittingValue();
}

function addEventListenerForWhenChoosingCurrencyFrom() {
  const dropdownChoicesFrom = document.querySelector('#dropdown-choices-from');
  dropdownChoicesFrom.addEventListener('click', (event) => {
    const chosenCurrency = event.target.getAttribute("data-currency-code"); // Hämta vald valutakod från attribut
    const dropdownButtonFrom = document.querySelector('.dropdown-button-from');
    dropdownButtonFrom.textContent = chosenCurrency;
  });
}


function addEventListenerForWhenChoosingCurrencyTo() {
  const dropdownChoicesTo = document.querySelector('#dropdown-choices-to');
  dropdownChoicesTo.addEventListener('click', (event) => {
    const chosenCurrency = event.target.getAttribute("data-currency-code");
    const dropdownButtonto = document.querySelector('.dropdown-button-to');
    dropdownButtonto.textContent = chosenCurrency;
  });
}


async function addEventListenerForWhenSubmittingValue() {
  const formElement = document.querySelector('main');
  const inputElementFrom = document.querySelector('#input-from');
  const inputElementTo = document.querySelector('#input-to');

  formElement.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dropdownButtonFrom = document.querySelector('.dropdown-button-from');
    const convertFromCurrency = dropdownButtonFrom.textContent;
    const currencys = await getAllCurrencys(convertFromCurrency);

    const currencyFrom = currencys.find(c => c.code === convertFromCurrency);

    const convertFromValue = inputElementFrom.value * currencyFrom.rate;

    const dropdownButtonTo = document.querySelector('.dropdown-button-to');
    const convertToCurrency = dropdownButtonTo.textContent;

    const currencyToConvertTo = currencys.find(c => c.code === convertToCurrency);

    const convertedValue = convertFromValue * currencyToConvertTo.rate;

    inputElementTo.value = convertedValue.toFixed(2);
  });

  inputElementFrom.addEventListener('input', async () => {
    formElement.dispatchEvent(new Event('submit'));
  });

  inputElementFrom.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      formElement.dispatchEvent(new Event('submit'));
    }
  });
}

function getTheStrongestCurrency(){
  
}


async function getAllCurrencyNames() {
  const apiUrl = `https://api.freecurrencyapi.com/v1/latest?apikey=${config.API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const currencyRates = data.data;

    const currencyNames = Object.keys(currencyRates);

    return currencyNames;

  } catch (error) {
    console.log(error);
    debugger;
  }

}

async function getAllCurrencys(currencyCode) {

  const apiUrl = `https://api.freecurrencyapi.com/v1/latest?apikey=${config.API_KEY}&base_currency=${currencyCode}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const currencyRates = data.data;
    const currencys = [];

    for (const currencyCode in currencyRates) {
      if (currencyRates.hasOwnProperty(currencyCode)) {
        const currency = {
          code: currencyCode,
          rate: currencyRates[currencyCode]
        };
        currencys.push(currency);
      }
    }
    return currencys;

  } catch (error) {
    console.log(error);
    debugger;
  }

}


function renderButtons() {

  const dropdownDivFrom = document.querySelector(".dropdown-div-from");
  const dropdownDivTo = document.querySelector(".dropdown-div-to");

  const fromButton = document.createElement('button');
  fromButton.classList.add("dropdown-button-from");
  fromButton.textContent = "From";

  const toButton = document.createElement('button');
  toButton.classList.add("dropdown-button-to");
  toButton.textContent = "To";

  dropdownDivFrom.appendChild(fromButton);
  dropdownDivTo.appendChild(toButton);

}


function renderDropdownElementsFromButton() {
  const dropdownDiv = document.querySelector("#dropdown-choices-from");
  dropdownDiv.innerHTML = "";
  currencyNames.forEach(currencyName => {
    const optionElement = document.createElement("a");
    optionElement.setAttribute("data-currency-code", currencyName);
    optionElement.value = currencyName;
    optionElement.text = currencyName;

    dropdownDiv.appendChild(optionElement);

  });

}

function renderDropdownElementsToButton() {
  const dropdownDiv = document.querySelector("#dropdown-choices-to");
  dropdownDiv.innerHTML = "";
  currencyNames.forEach(currencyName => {
    const optionElement = document.createElement("a");
    optionElement.setAttribute("data-currency-code", currencyName);
    optionElement.value = currencyName;
    optionElement.text = currencyName;

    dropdownDiv.prepend(optionElement);

  });

}

function getConvertedCurrency(currencyName, value) {
  const currency = currencys.find(c => c.code == currencyName);
  return currency.rate * value;
}

