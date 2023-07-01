document.addEventListener('DOMContentLoaded', main);

let currencyNames = [];

async function main() {
  currencyNames = await getAllCurrencyNames();
  addEventListeners();
}

function addEventListeners() {
  const dropdownChoicesFrom = document.querySelector('#dropdown-choices-from');
  const dropdownChoicesTo = document.querySelector('#dropdown-choices-to');
  const dropdownButtonFrom = document.querySelector('.dropdown-button-from');
  const dropdownButtonTo = document.querySelector('.dropdown-button-to');

  dropdownButtonFrom.addEventListener('mouseover', () => {
    dropdownChoicesFrom.classList.add('show-dropdown');
  });
  dropdownButtonFrom.addEventListener('mouseover', renderDropdownElements);

  dropdownButtonFrom.addEventListener('mouseleave', () => {
    dropdownChoicesFrom.classList.remove('show-dropdown');
  });


  dropdownButtonTo.addEventListener('mouseover', () => {
    dropdownChoicesTo.classList.add('show-dropdown');
  });

  dropdownButtonTo.addEventListener('mouseleave', () => {
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

function renderDropdownElements() {
  const dropdownDiv = document.querySelector("#dropdown-choices-from");
  currencyNames.forEach(currencyName => {
    const optionElement = document.createElement("a");
    optionElement.value = currencyName;
    optionElement.text = currencyName;

    dropdownDiv.appendChild(optionElement);

  });

}