let isPopupOpen = false;

export async function initPopupRender() {
  addEventListenerForPopups();
}

async function addEventListenerForPopups() {
  const exclamationMarkIcons = document.querySelectorAll('.fa-circle-exclamation');

  for (let i = 0; i < exclamationMarkIcons.length; i++) {
    const icon = exclamationMarkIcons[i];
    icon.addEventListener('click', async (event) => {
      const clickX = event.clientX;
      const clickY = event.clientY;
      await toggleExclamationPopup(clickX, clickY);
    });
  }

  const closePopupIcons = document.querySelector('.popup-close-icon');
  closePopupIcons.addEventListener('click', closeExclamationPopup);
}

async function renderExclamationMarkPopup(clickX, clickY) {
  debugger;
  const divElement = document.createElement('div');
  divElement.classList.add('exclamation-popup-div');

  if (window.innerWidth <= 768) {
    // Mobilstorlek - ändra positionen
    divElement.style.left = clickX + 120 + 'px';
    divElement.style.top = clickY + 50 + 'px';
  } else {
    // Annars använd tidigare positionering
    divElement.style.left = clickX + 200 + 'px';
    divElement.style.top = clickY + 70 + 'px';
  }

  const popupHeader = document.createElement('div');
  popupHeader.classList.add('popup-header');

  const titleElement = document.createElement('h3');
  titleElement.classList.add('popup-date');
  titleElement.textContent = "Information" ?? "Laddar datum...";

  //LÄGGER TILL DENA IGEN MED FUNKTION NÄR TID FINNS
  // const icon = document.createElement('i');
  // icon.classList.add('fa', 'fa-window-close', 'popup-close-icon'); // Lägger till klassen 'popup-close-icon'
  // icon.setAttribute('aria-hidden', 'true');

  const text = document.createElement('h4');
  text.classList.add('popup-title');
  text.innerHTML = "För tillfället hanterar vi inte alla valutor, för att se vilka som är med i beräkningen<br>vänligen se listan för knapparna ovan" ?? "Laddar text...";
  popupHeader.appendChild(titleElement);
  // popupHeader.appendChild(icon);

  // Här sätter jag de olika elementen till själva popupen
  divElement.appendChild(popupHeader);
  divElement.appendChild(text);

  // Och här sätts hela popupen som barn till DOMen
  document.body.appendChild(divElement);
}

async function toggleExclamationPopup(clickX, clickY) {

  if (isPopupOpen) {
    const popUpDiv = document.querySelector('.exclamation-popup-div');
    popUpDiv.remove(); // Stäng popupen om den är öppen
    isPopupOpen = false;
  } else {
    await renderExclamationMarkPopup(clickX, clickY);
    isPopupOpen = true;
  }
}


function closeExclamationPopup() {
  const popUpDiv = document.querySelector('.exclamation-popup-div');
  if (popUpDiv !== null) {
    popUpDiv.remove();
  }
}
