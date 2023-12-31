import config from './config.js';
import { currencyFlagsToCurrencyName } from './staticArrays.js';

let currencyNames = [];
let cryptoCurrencyNames = [];
let rawMaterialsCurrencyNames = [];
let currencys = [];
let lastUpdatedCurrencies = null;

export let strongestNameP = null;
export let strongestRateP = null;
export let weakestNameP = null;
export let weakestRateP = null;
export let baseCode = "USD";

export async function initCurrencyExchanger() {
    const inputElementFrom = document.querySelector('#input-from');
    inputElementFrom.value = 100;
    await getAllCurrenciesAndNames();
    console.log(currencyNames);
}

export async function addEventListenersForCurrencyExchanger() {

    // getAllCurrencys();
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

    const revertArrowsBtn = document.querySelector(".arrows-convert-btn");

    revertArrowsBtn.addEventListener("click", async function() {
      // Kör funktionen revertFromAndToCurrencys när klickhändelsen inträffar
      revertFromAndToCurrencys();
      
      // Kör calculateExchange() asynkront efter revertFromAndToCurrencys är klar
      await calculateExchange();
    });
    
}

function addEventListenerForShowingDropdown() {
    const dropdownChoicesFrom = document.querySelector('#dropdown-choices-from');
    const dropdownChoicesTo = document.querySelector('#dropdown-choices-to');
    const dropdownInputFrom = document.querySelector('.dropdown-input-from');
    const dropdownInputTo = document.querySelector('.dropdown-input-to');

    const fromInputContainer = document.querySelector(".input-from-container");

    let isDropdownOpen = false; // Håller reda på om dropdownen är öppen

    fromInputContainer.addEventListener('mousedown', (event) => {
        // Förhindra att input-fältet får fokus och därmed förhindra att det går att skriva
        event.preventDefault();

        // Öppna dropdown om den är stängd
        if (!isDropdownOpen) {
            renderDropdownElementsFromButton();
            dropdownChoicesFrom.classList.add('show-dropdown');
            isDropdownOpen = true;
        }
    });

    const toInputContainer = document.querySelector(".input-to-container");
    toInputContainer.addEventListener('mousedown', (event) => {
        // Förhindra att input-fältet får fokus och därmed förhindra att det går att skriva
        event.preventDefault();

        // Öppna dropdown om den är stängd
        if (!isDropdownOpen) {
            renderDropdownElementsToButton();
            dropdownChoicesTo.classList.add('show-dropdown');
            isDropdownOpen = true;
        }
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

    const dropdownWrapperFrom = document.querySelector('.dropdown-wrapper-from');
    const dropdownWrapperTo = document.querySelector('.dropdown-wrapper-to');


    dropdownWrapperFrom.addEventListener('mouseleave', () => {
        isDropdownOpen = false;
        dropdownChoicesFrom.classList.remove('show-dropdown');
        dropdownChoicesTo.classList.remove('show-dropdown');
    });

    dropdownWrapperTo.addEventListener('mouseleave', () => {
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
        dropdownInputFrom.value = chosenCurrency ?? "SEK";
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

function revertFromAndToCurrencys() {
    const dropdownInputFrom = document.querySelector('.dropdown-input-from');
    const fromValue = dropdownInputFrom.value;

    const dropdownInputTo = document.querySelector('.dropdown-input-to');
    const toValue = dropdownInputTo.value;

    dropdownInputFrom.value = "";
    dropdownInputFrom.value = toValue;

    dropdownInputTo.value = "";
    dropdownInputTo.value = fromValue;
}

function validateCurrencyName(currencyName) {
    // Kontrollera om valutanamnet finns i listan currencyNames
    return currencyNames.includes(currencyName);
}
function searchInDropdownFrom() {
    const dropdownChoicesFrom = document.querySelector('#dropdown-choices-from');
    const dropdownInputFrom = document.querySelector('.dropdown-input-from');
    const formElement = document.querySelector('main');

    const searchIconFrom = document.querySelector("#search-icon-from");
    const inputFrom = document.querySelector(".dropdown-input-from");
    searchIconFrom.addEventListener("click", function () {
        inputFrom.disabled = false; // Aktivera input-fältet
        inputFrom.value = ""; // Töm input-fältet
        inputFrom.removeAttribute("disabled");
        inputFrom.focus();
    });

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

    const searchIconTo = document.querySelector("#search-icon-to");
    const inputTo = document.querySelector(".dropdown-input-to");
    searchIconTo.addEventListener("click", function () {
        inputTo.disabled = false; // Aktivera input-fältet
        inputTo.value = ""; // Töm input-fältet
        inputTo.removeAttribute("disabled");
        inputTo.focus();
    });

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
    baseCode = baseCurrencyElement.textContent;
}

function changeBaseCurrency() {
    const arrowLeft = document.querySelector(".fa-chevron-circle-left");
    const arrowRight = document.querySelector(".fa-chevron-circle-right");
    // let baseCode;

    arrowLeft.addEventListener("click", () => {
        updateTheBaseCurrencyName("left");
        showTheStrongestAndWeakestCurrencys(baseCode);
    });

    arrowRight.addEventListener("click", () => {
        updateTheBaseCurrencyName("right");
        showTheStrongestAndWeakestCurrencys(baseCode);
    });
}

async function showTheStrongestAndWeakestCurrencys(baseCode = null) {

    strongestNameP = document.querySelector("#strongest-currency-name");
    strongestRateP = document.querySelector("#strongest-currency-rate");
    weakestNameP = document.querySelector("#weakest-currency-name");
    weakestRateP = document.querySelector("#weakest-currency-rate");

    const strongestAndWeakestCurrencys = await getTheStrongestAndWeakestCurrency(baseCode);

    strongestNameP.textContent = strongestAndWeakestCurrencys.strongest.code;
    strongestRateP.textContent = strongestAndWeakestCurrencys.strongest.rate;
    weakestNameP.textContent = strongestAndWeakestCurrencys.weakest.code;
    weakestRateP.textContent = strongestAndWeakestCurrencys.weakest.rate;
}
async function getTheStrongestAndWeakestCurrency(baseCode = null) {
    let strongest;
    let weakest;

    if (baseCode === null || baseCode === undefined) {
        baseCode = "USD";
    }
    const allCurrencys = await getAllCurrencysWithBase(baseCode);

    for (const currency of allCurrencys) {
        if (!strongest || currency.rate < strongest.rate) {
            strongest = currency;
        } else if (!weakest || currency.rate > weakest.rate) {
            weakest = currency;
        }
    }
    return { strongest, weakest };
}


async function getAllCurrenciesAndNames() {
    const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${config.API_KEY}`;

    const storedlastUpdatedCurrencies = localStorage.getItem('lastUpdatedCurrencies');
    const storedCurrencyNames = localStorage.getItem('currencyNames');
    const storedAllCurrencies = localStorage.getItem('currencys');

    try {
        if (
            storedlastUpdatedCurrencies &&
            Date.now() - parseInt(storedlastUpdatedCurrencies) < 24 * 60 * 60 * 1000 &&
            storedCurrencyNames
        ) {
            // Använd cachad data
            currencyNames = JSON.parse(storedCurrencyNames);
            currencys = JSON.parse(storedAllCurrencies);

        } else {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const currencyRates = data.data;
            const foundCurrencyNames = Object.keys(currencyRates);

            for (const name of foundCurrencyNames) {
                if (name == "ADA" || name == "AVAX" || name == "BNB" || name == "BTC"
                    || name == "DAI" || name == "DOT" || name == "ETH" || name == "MATIC"
                    || name == "LTC" || name == "SOL" || name == "XRP" || name == "BUSD"
                    || name == "USDT" || name == "ARB") {

                    cryptoCurrencyNames.push(name);
                }
                else if (name == "XAG" || name == "XAU" || name == "XPD" || name == "XPT") {
                    rawMaterialsCurrencyNames.push(name);
                }
                else {
                    currencyNames.push(name);
                }
            }

            // currencyNames = foundCurrencyNames;

            for (const currencyCode in currencyRates) {
                if (currencyRates.hasOwnProperty(currencyCode)) {
                    const currency = {
                        code: currencyCode,
                        rate: currencyRates[currencyCode]
                    };
                    currencys.push(currency);
                }
            }
            // Uppdatera senaste uppdateringstidpunkt
            lastUpdatedCurrencies = Date.now();

            localStorage.setItem('lastUpdateCurrencyNames', lastUpdatedCurrencies.toString());
            localStorage.setItem('currencyNames', JSON.stringify(currencyNames));

            localStorage.setItem('lastUpdatedAllCurrencies', JSON.stringify(currencys));
        }
    } catch (error) {
        console.log(error);
        debugger;
    }


}




// async function getAllCurrencysWithBase(currencyCode) {
//     const storedCurrenciesWithBase = localStorage.getItem('currenciesWithBase');
//     const storedLastUpdatedCurrenciesWithBase = localStorage.getItem('lastUpdatedCurrenciesWithBase');

//     try {
//         if (
//             storedCurrenciesWithBase &&
//             storedLastUpdatedCurrenciesWithBase &&
//             Date.now() - parseInt(storedLastUpdatedCurrenciesWithBase) < 24 * 60 * 60 * 1000 &&
//             currencyCode in JSON.parse(storedCurrenciesWithBase)
//         ) {
//             // Använd cachad data
//             return JSON.parse(storedCurrenciesWithBase)[currencyCode];
//         } else {
//             const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${config.API_KEY}&base_currency=${currencyCode}`;
//             const response = await fetch(apiUrl);
//             const data = await response.json();
//             const currencyRates = data.data;

//             const currenciesToReturn = [];

//             for (const currencyCode in currencyRates) {
//                 if (currencyRates.hasOwnProperty(currencyCode)) {
//                     const currency = {
//                         code: currencyCode,
//                         rate: currencyRates[currencyCode].value
//                     };
//                     currenciesToReturn.push(currency);
//                 }
//             }

//             const currenciesWithBase = JSON.parse(storedCurrenciesWithBase) || {};
//             currenciesWithBase[currencyCode] = currenciesToReturn;

//             localStorage.setItem('currenciesWithBase', JSON.stringify(currenciesWithBase));
//             localStorage.setItem('lastUpdatedCurrenciesWithBase', Date.now().toString());

//            return currenciesToReturn;
//         }
//     } catch (error) {
//         console.log(error);
//         debugger;
//     }
// }


async function getAllCurrencysWithBase(currencyCode, isCrypto = false) {

    let apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${config.API_KEY}&base_currency=${currencyCode}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const currencyRates = data.data;

        const currencysToReturn = [];

        for (const currencyCode in currencyRates) {
            if (currencyRates.hasOwnProperty(currencyCode)) {
                //om det inte är krypto - ta bara med om currencyCode matchar namnen i currencyNames
                if (!isCrypto || isCrypto === undefined) {
                    if (currencyNames.includes(currencyCode)) {
                        const currency = {
                            code: currencyCode,
                            rate: currencyRates[currencyCode].value
                        };
                        currencysToReturn.push(currency);
                    }
                }
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

    const fromInputContainer = document.createElement("div");
    fromInputContainer.classList.add("input-from-container");

    const fromSearchIcon = document.createElement("i");
    fromSearchIcon.classList.add("fas", "fa-search");
    fromSearchIcon.setAttribute("id", "search-icon-from");

    const fromInput = document.createElement('input');
    fromInput.classList.add("dropdown-input-from");
    fromInput.value = "SEK";
    //sätt att man inte kan fylla i något som default förrän man trycker på sök
    fromInput.disabled = true;

    fromInputContainer.appendChild(fromInput);
    fromInputContainer.appendChild(fromSearchIcon);

    const toInputContainer = document.createElement("div");
    toInputContainer.classList.add("input-to-container");

    const toSearchIcon = document.createElement("i");
    toSearchIcon.classList.add("fas", "fa-search");
    toSearchIcon.setAttribute("id", "search-icon-to");

    const toInput = document.createElement('input');
    toInput.classList.add("dropdown-input-to");
    toInput.value = "USD";

    toInput.disabled = true;

    toInputContainer.appendChild(toInput);
    toInputContainer.appendChild(toSearchIcon);

    dropdownDivFrom.appendChild(fromInputContainer);
    dropdownDivTo.appendChild(toInputContainer);

}

function renderDropdownElementsFromButton(listOfSpecificCodes = null) {

    const dropdownDiv = document.querySelector("#dropdown-choices-from");
    dropdownDiv.innerHTML = "";

    if (listOfSpecificCodes == null || listOfSpecificCodes == undefined) {
        currencyNames.forEach(currencyName => {
            const optionElement = document.createElement("a");
            optionElement.setAttribute("data-currency-code", currencyName);

            optionElement.value = currencyName;

            const currencyEntry = currencyFlagsToCurrencyName.find(entry => entry.code === currencyName);

            if (currencyEntry) {
                const flagImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                flagImage.classList.add("flag-icon");
                flagImage.innerHTML = `<use xlink:href="Flags/${currencyEntry.flag}.svg#flag-icons-${currencyEntry.flag}"></use>`;

                optionElement.appendChild(flagImage);
            }

            optionElement.appendChild(document.createTextNode(currencyName));

            dropdownDiv.appendChild(optionElement);

        });
    }
    else {
        listOfSpecificCodes.forEach(code => {
            const optionElement = document.createElement("a");
            optionElement.setAttribute("data-currency-code", code);
            optionElement.value = code;


            const currencyEntry = currencyFlagsToCurrencyName.find(entry => entry.code === code);

            if (currencyEntry) {
                const flagImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                flagImage.classList.add("flag-icon");
                flagImage.innerHTML = `<use xlink:href="Flags/${currencyEntry.flag}.svg#flag-icons-${currencyEntry.flag}"></use>`;

                optionElement.appendChild(flagImage);
            }

            optionElement.appendChild(document.createTextNode(code));

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

            const currencyEntry = currencyFlagsToCurrencyName.find(entry => entry.code === currencyName);

            if (currencyEntry) {
                const flagImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                flagImage.classList.add("flag-icon");
                flagImage.innerHTML = `<use xlink:href="Flags/${currencyEntry.flag}.svg#flag-icons-${currencyEntry.flag}"></use>`;

                optionElement.appendChild(flagImage);
            }

            optionElement.appendChild(document.createTextNode(currencyName));

            dropdownDiv.prepend(optionElement);

        });
    } else {
        listOfSpecificCodes.forEach(code => {
            const optionElement = document.createElement("a");
            optionElement.setAttribute("data-currency-code", code);
            optionElement.value = code;

            const currencyEntry = currencyFlagsToCurrencyName.find(entry => entry.code === code);

            if (currencyEntry) {
                const flagImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                flagImage.classList.add("flag-icon");
                flagImage.innerHTML = `<use xlink:href="Flags/${currencyEntry.flag}.svg#flag-icons-${currencyEntry.flag}"></use>`;

                optionElement.appendChild(flagImage);
            }

            optionElement.appendChild(document.createTextNode(code));
            dropdownDiv.prepend(optionElement);

        });
    }
}