document.addEventListener('DOMContentLoaded', main);

let currencyNames = [];
let currencys = [];

async function main() {
  renderButtons();
  currencyNames = await getAllCurrencyNames();
  currencys = await getAllCurrencys();
  console.log(currencys);
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
    const chosenCurrency = event.target.getAttribute("data-currency-code"); // Hämta vald valutakod från attribut
    const dropdownButtonto = document.querySelector('.dropdown-button-to');
    dropdownButtonto.textContent = chosenCurrency;
  });
}
function addEventListenerForWhenSubmittingValue() {
  //först hitta from och till knappens valuta-namn värde
  //sedan hitta currencyn på FROM och sen TILL 
  const formElement = document.querySelector('main');

  //tex 1
  const inputElementFrom = document.querySelector('#input-from');

  //0
  const inputElementTo = document.querySelector('#input-to');

  formElement.addEventListener('submit', (event) => {
    event.preventDefault();

    const dropdownButtonFrom = document.querySelector('.dropdown-button-from');
    //tex SEK
    const convertFromCurrency = dropdownButtonFrom.textContent;
    const currencyFrom = currencys.find(c => c.code === convertFromCurrency);
    const convertFromValue = inputElementFrom.value * currencyFrom.rate;
    console.log("converted from value som ska v ara 0.9", convertFromValue);

    const dropdownButtonTo = document.querySelector('.dropdown-button-to');
    const convertToCurrency = dropdownButtonTo.textContent;

    const currencyToConvertTo = currencys.find(c => c.code === convertToCurrency);

    // const inputValueFrom = parseFloat(inputElementFrom.value);

    const convertedValue = (convertFromValue * currencyToConvertTo.rate);
    console.log("converted valkue ska vara typ 10..", convertedValue);

    inputElementTo.value = convertedValue.toFixed(2);
  });

  inputElementFrom.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      formElement.dispatchEvent(new Event('submit'));
    }
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

