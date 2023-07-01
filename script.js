document.addEventListener('DOMContentLoaded', main);

let currencyNames = [];
let currencys = [];

async function main() {
  renderButtons();
  currencyNames = await getAllCurrencyNames();
  currencys = await getAllCurrencys();
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
}

async function getAllCurrencyNames() {
  const apiUrl = "https://v6.exchangerate-api.com/v6/ddf6ee9624da92869f6b9028/latest/sek";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const currencyNames = Object.keys(data.conversion_rates);

    return currencyNames;

  } catch (error) {
    console.log(error);
    debugger;
  }

}

async function getAllCurrencys() {
  const apiUrl = "https://v6.exchangerate-api.com/v6/ddf6ee9624da92869f6b9028/latest/sek";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const currencyRates = data.conversion_rates;
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
  currencyNames.forEach(currencyName => {
    const optionElement = document.createElement("a");
    optionElement.value = currencyName;
    optionElement.text = currencyName;

    dropdownDiv.appendChild(optionElement);

  });

}

function renderDropdownElementsToButton() {
  const dropdownDiv = document.querySelector("#dropdown-choices-to");
  currencyNames.forEach(currencyName => {
    const optionElement = document.createElement("a");
    optionElement.value = currencyName;
    optionElement.text = currencyName;

    dropdownDiv.prepend(optionElement);

  });

}

function getConvertedCurrency(currencyName, value) {
  const currency = currencys.find(c => c.code == currencyName);
  return currency.rate * value;
}

