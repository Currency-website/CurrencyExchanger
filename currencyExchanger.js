import config from './config.js';

let currencyNames = [];
const currencys = [];

let lastUpdateCurrencyNames = null;
let lastUpdateCurrenciesWithBase = null;
let lastUpdateAllCurrencies = null;


export async function initCurrencyExchanger() {
    const inputElementFrom = document.querySelector('#input-from');
    inputElementFrom.value = 100;

    await getAllCurrencyNames();
    //kan skippas sedan och endast använda av currencys
}

export async function addEventListenersForCurrencyExchanger() {

    getAllCurrencys();
    renderButtons();
    renderDropdownElementsFromButton();
    renderDropdownElementsToButton();

    addEventListenerForShowingDropdown();
    renderDropdownElementsFromButton();
    renderDropdownElementsToButton();

    addEventListenerForWhenChoosingCurrencyFrom();
    addEventListenerForWhenChoosingCurrencyTo();
    searchInDropdownFrom();
    searchInDropdownTo();
    changeBaseCurrency();

    setTheBaseCurrencyName();
    await showTheStrongestAndWeakestCurrencys("USD");
    await calculateExchange();
    await addEventListenerForWhenSubmittingValue();
}

function addEventListenerForShowingDropdown() {
    const dropdownChoicesFrom = document.querySelector('#dropdown-choices-from');
    const dropdownChoicesTo = document.querySelector('#dropdown-choices-to');
    const dropdownInputFrom = document.querySelector('.dropdown-input-from');
    const dropdownInputTo = document.querySelector('.dropdown-input-to');

    let isDropdownOpen = false; // Håller reda på om dropdownen är öppen

    dropdownInputFrom.addEventListener('click', () => {
        dropdownInputFrom.value = "";
        renderDropdownElementsFromButton();
        dropdownChoicesFrom.classList.add('show-dropdown');
        isDropdownOpen = true;
    });

    dropdownInputTo.addEventListener('click', () => {
        dropdownInputTo.value = "";
        renderDropdownElementsToButton();
        dropdownChoicesTo.classList.add('show-dropdown');
        isDropdownOpen = true;
    });

    dropdownInputFrom.addEventListener('blur', (event) => {
        if (!isMouseOverDropdown(event)) {
            dropdownChoicesFrom.classList.remove('show-dropdown');
        }
    });

    dropdownInputTo.addEventListener('blur', (event) => {
        if (!isMouseOverDropdown(event)) {
            dropdownChoicesTo.classList.remove('show-dropdown');
        }
    });

    dropdownChoicesFrom.addEventListener('mouseleave', () => {
        isDropdownOpen = false;
    });

    dropdownChoicesTo.addEventListener('mouseleave', () => {
        isDropdownOpen = false;
    });

    const dropdownWrapper = document.querySelector('.dropdown-wrapper');

    dropdownWrapper.addEventListener('mouseleave', () => {
        isDropdownOpen = false;
        dropdownChoicesFrom.classList.remove('show-dropdown');
        dropdownChoicesTo.classList.remove('show-dropdown');
    });

}

function addEventListenerForWhenChoosingCurrencyFrom() {
    const dropdownChoicesFrom = document.querySelector('#dropdown-choices-from');
    dropdownChoicesFrom.addEventListener('click', (event) => {
        const chosenCurrency = event.target.getAttribute("data-currency-code"); // Hämta vald valutakod från attribut
        const dropdownInputFrom = document.querySelector('.dropdown-input-from');
        dropdownInputFrom.value = chosenCurrency;
        dropdownChoicesFrom.classList.remove('show-dropdown'); // Ta bort klassen efter valet
    });
}


function addEventListenerForWhenChoosingCurrencyTo() {
    const dropdownChoicesTo = document.querySelector('#dropdown-choices-to');
    dropdownChoicesTo.addEventListener('click', (event) => {
        const chosenCurrency = event.target.getAttribute("data-currency-code");
        const dropdownInputto = document.querySelector('.dropdown-input-to');
        dropdownInputto.value = chosenCurrency;
        dropdownChoicesTo.classList.remove('show-dropdown'); // Ta bort klassen efter valet
    });
}

function validateCurrencyName(currencyName) {
    // Kontrollera om valutanamnet finns i listan currencyNames
    return currencyNames.includes(currencyName);
}
function searchInDropdownFrom() {
    const dropdownChoicesFrom = document.querySelector('#dropdown-choices-from');
    const dropdownInputFrom = document.querySelector('.dropdown-input-from');
    const formElement = document.querySelector('main');

    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();
    });

    dropdownInputFrom.addEventListener('keyup', async () => {
        const searchQuery = dropdownInputFrom.value.toUpperCase();

        let foundCurrencyCodes = [];
        currencyNames.forEach(name => {
            if (name.includes(searchQuery)) {
                foundCurrencyCodes.push(name);
            }
        });

        renderDropdownElementsFromButton(foundCurrencyCodes);
        dropdownChoicesFrom.classList.add('show-dropdown');
    });

    dropdownInputFrom.addEventListener('mouseover', () => {
        dropdownChoicesFrom.classList.add('show-dropdown');
    });
}


function searchInDropdownTo() {
    const dropdownChoicesTo = document.querySelector('#dropdown-choices-to');
    const dropdownInputTo = document.querySelector('.dropdown-input-to');
    const formElement = document.querySelector('main');

    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();
    });

    dropdownInputTo.addEventListener('keyup', async () => {
        const searchQuery = dropdownInputTo.value.toUpperCase();

        let foundCurrencyCodes = [];
        currencyNames.forEach(name => {
            if (name.includes(searchQuery)) {
                foundCurrencyCodes.push(name);
            }
        });

        renderDropdownElementsToButton(foundCurrencyCodes);
        dropdownChoicesTo.classList.add('show-dropdown');
    });

    dropdownInputTo.addEventListener('mouseover', () => {
        dropdownChoicesTo.classList.add('show-dropdown');
    });
}


async function addEventListenerForWhenSubmittingValue() {
    const formElement = document.querySelector('main');
    const inputElementFrom = document.querySelector('#input-from');

    const dropdownInputFrom = document.querySelector('.dropdown-input-from');
    const dropdownInputTo = document.querySelector('.dropdown-input-to');

    const dropdownChoicesFrom = document.querySelector('#dropdown-choices-from');
    const dropdownChoicesTo = document.querySelector('#dropdown-choices-to');

    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();
        await calculateExchange();
    });

    inputElementFrom.addEventListener('input', async () => {
        formElement.dispatchEvent(new Event('submit'));
    });

    dropdownInputFrom.addEventListener('click', () => {
        dropdownInputFrom.value = "";
        renderDropdownElementsFromButton();
        dropdownChoicesFrom.classList.add('show-dropdown');
    });

    dropdownInputFrom.addEventListener('input', async () => {
        formElement.dispatchEvent(new Event('submit'));
    });

    dropdownChoicesFrom.addEventListener('click', (event) => {
        const chosenCurrency = event.target.getAttribute("data-currency-code");
        dropdownInputFrom.value = chosenCurrency;
        formElement.dispatchEvent(new Event('submit'));
    });

    dropdownInputTo.addEventListener('click', () => {
        dropdownInputTo.value = "";
        renderDropdownElementsToButton();
        dropdownChoicesTo.classList.add('show-dropdown');
    });

    dropdownInputTo.addEventListener('input', async () => {
        formElement.dispatchEvent(new Event('submit'));
    });

    dropdownChoicesTo.addEventListener('click', (event) => {
        const chosenCurrency = event.target.getAttribute("data-currency-code");
        dropdownInputTo.value = chosenCurrency;
        formElement.dispatchEvent(new Event('submit'));
    });

    inputElementFrom.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            formElement.dispatchEvent(new Event('submit'));
            // await renderExchangeResult();
        }
    });

}

async function calculateExchange() {

    const inputElementFrom = document.querySelector('#input-from');
    const inputElementTo = document.querySelector('#input-to');

    let currencyFrom;
    let currencyToConvertTo;
    let convertFromValue;
    let convertedValue;

    const dropdownInputFrom = document.querySelector('.dropdown-input-from');
    const convertFromCurrency = dropdownInputFrom.value;

    if (!validateCurrencyName(convertFromCurrency)) {
        return;
    }

    const currencysToConvert = await getAllCurrencysWithBase(convertFromCurrency);

    currencyFrom = currencysToConvert.find(c => c.code === convertFromCurrency);

    convertFromValue = inputElementFrom.value * currencyFrom.rate;

    const dropdownInputTo = document.querySelector('.dropdown-input-to');
    const convertToCurrency = dropdownInputTo.value;

    if (!validateCurrencyName(convertToCurrency)) {
        return;
    }

    currencyToConvertTo = currencysToConvert.find(c => c.code === convertToCurrency);

    convertedValue = convertFromValue * currencyToConvertTo.rate;

    inputElementTo.value = convertedValue.toFixed(2);
}

function setTheBaseCurrencyName() {
    const baseCurrencyP = document.querySelector("#base-currency-name");
    baseCurrencyP.textContent = "USD";
}

function updateTheBaseCurrencyName(direction) {
    const baseCurrencyElement = document.querySelector("#base-currency-name");
    const currentBaseCurrency = baseCurrencyElement.textContent;
    const index = currencys.findIndex(c => c.code == currentBaseCurrency);

    if (direction == "right") {
        baseCurrencyElement.textContent = currencys[index + 1].code;
    }
    else if (direction == "left") {
        baseCurrencyElement.textContent = currencys[index - 1].code;
    }
    return baseCurrencyElement.textContent;
}

function changeBaseCurrency() {
    const arrowLeft = document.querySelector(".fa-chevron-circle-left");
    const arrowRight = document.querySelector(".fa-chevron-circle-right");
    let baseCode;

    arrowLeft.addEventListener("click", () => {
        baseCode = updateTheBaseCurrencyName("left");
        showTheStrongestAndWeakestCurrencys(baseCode);
    });

    arrowRight.addEventListener("click", () => {
        baseCode = updateTheBaseCurrencyName("right");
        showTheStrongestAndWeakestCurrencys(baseCode);
    });
}

async function showTheStrongestAndWeakestCurrencys(baseCode = null) {

    const strongestNameP = document.querySelector("#strongest-currency-name");
    const strongestRateP = document.querySelector("#strongest-currency-rate");
    const weakestNameP = document.querySelector("#weakest-currency-name");
    const weakestRateP = document.querySelector("#weakest-currency-rate");

    const strongestAndWeakestCurrencys = await getTheStrongestAndWeakestCurrency(baseCode);

    strongestNameP.textContent = strongestAndWeakestCurrencys.strongest.code;
    strongestRateP.textContent = strongestAndWeakestCurrencys.strongest.rate;
    weakestNameP.textContent = strongestAndWeakestCurrencys.weakest.code;
    weakestRateP.textContent = strongestAndWeakestCurrencys.weakest.rate;
}


async function getTheStrongestAndWeakestCurrency(baseCode = null) {
    let strongest;
    let weakest;

    if (baseCode == null || baseCode == undefined) {
        baseCode = "USD";
    }
    const allCurrencys = await getAllCurrencysWithBase(baseCode);

    // const baseCurrency = currencys.find(c => c.code == baseCode);

    for (const currency of allCurrencys) {
        if (!strongest || currency.rate < strongest.rate) {
            strongest = currency;
        }
        else if (!weakest || currency.rate > weakest.rate) {
            weakest = currency;
        }
    }
    return { strongest, weakest };
}


async function getAllCurrencyNames() {
    const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${config.API_KEY}`;

    const storedLastUpdateCurrencyNames = localStorage.getItem('lastUpdateCurrencyNames');
    const storedCurrencyNames = localStorage.getItem('currencyNames');

    try {
        if (
            storedLastUpdateCurrencyNames &&
            Date.now() - parseInt(storedLastUpdateCurrencyNames) < 24 * 60 * 60 * 1000 &&
            storedCurrencyNames
        ) {
            // Använd cachad data
            alert('rätt');
            currencyNames = JSON.parse(storedCurrencyNames);

        } else {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const currencyRates = data.data;
            const foundCurrencyNames = Object.keys(currencyRates);
            currencyNames = foundCurrencyNames;

            // Uppdatera senaste uppdateringstidpunkt
            lastUpdateCurrencyNames = Date.now();

            localStorage.setItem('lastUpdateCurrencyNames', lastUpdateCurrencyNames.toString());
            localStorage.setItem('currencyNames', JSON.stringify(currencyNames));

            return currencyNames;
        }
    } catch (error) {
        console.log(error);
        debugger;
    }
}

async function getAllCurrencys() {

    let apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${config.API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const currencyRates = data.data;

        for (const currencyCode in currencyRates) {
            if (currencyRates.hasOwnProperty(currencyCode)) {
                const currency = {
                    code: currencyCode,
                    rate: currencyRates[currencyCode]
                };
                currencys.push(currency);
            }
        }

    } catch (error) {
        console.log(error);
        debugger;
    }

}

async function getAllCurrencysWithBase(currencyCode) {

    let apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${config.API_KEY}&base_currency=${currencyCode}`;


    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const currencyRates = data.data;

        const currencysToReturn = [];

        for (const currencyCode in currencyRates) {
            if (currencyRates.hasOwnProperty(currencyCode)) {
                const currency = {
                    code: currencyCode,
                    rate: currencyRates[currencyCode].value
                };
                currencysToReturn.push(currency);
            }
        }
        return currencysToReturn;

    } catch (error) {
        console.log(error);
        debugger;
    }

}

function renderButtons() {

    const dropdownDivFrom = document.querySelector(".dropdown-div-from");
    const dropdownDivTo = document.querySelector(".dropdown-div-to");

    const fromInput = document.createElement('input');
    fromInput.classList.add("dropdown-input-from");
    fromInput.value = "SEK";

    const toInput = document.createElement('input');
    toInput.classList.add("dropdown-input-to");
    toInput.value = "USD";

    dropdownDivFrom.appendChild(fromInput);
    dropdownDivTo.appendChild(toInput);

}


function renderDropdownElementsFromButton(listOfSpecificCodes = null) {

    const dropdownDiv = document.querySelector("#dropdown-choices-from");
    dropdownDiv.innerHTML = "";

    if (listOfSpecificCodes == null || listOfSpecificCodes == undefined) {
        currencyNames.forEach(currencyName => {
            const optionElement = document.createElement("a");
            optionElement.setAttribute("data-currency-code", currencyName);
            optionElement.value = currencyName;
            optionElement.text = currencyName;

            dropdownDiv.appendChild(optionElement);

        });
    }
    else {
        listOfSpecificCodes.forEach(code => {
            const optionElement = document.createElement("a");
            optionElement.setAttribute("data-currency-code", code);
            optionElement.value = code;
            optionElement.text = code;

            dropdownDiv.appendChild(optionElement);

        });
    }

}

function renderDropdownElementsToButton(listOfSpecificCodes = null) {
    const dropdownDiv = document.querySelector("#dropdown-choices-to");
    dropdownDiv.innerHTML = "";

    if (listOfSpecificCodes == null || listOfSpecificCodes == undefined) {
        currencyNames.forEach(currencyName => {
            const optionElement = document.createElement("a");
            optionElement.setAttribute("data-currency-code", currencyName);
            optionElement.value = currencyName;
            optionElement.text = currencyName;

            dropdownDiv.prepend(optionElement);

        });
    } else {
        listOfSpecificCodes.forEach(code => {
            const optionElement = document.createElement("a");
            optionElement.setAttribute("data-currency-code", code);
            optionElement.value = code;
            optionElement.text = code;

            dropdownDiv.prepend(optionElement);

        });
    }


}