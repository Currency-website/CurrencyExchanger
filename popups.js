

export async function renderExclamationMarkPopup(clickX, clickY) {

    const divElement = document.createElement('div');
    divElement.classList.add('exclamation-popup-div');

    divElement.style.left = clickX + 200 + 'px';
    divElement.style.top = clickY  + 70 + 'px';

    const popupHeader = document.createElement('div');
    popupHeader.classList.add('popup-header');

    const titleElement = document.createElement('h3');
    titleElement.classList.add('popup-date');
    titleElement.textContent = "Information" ?? "Laddar datum...";

    
    const icon = document.createElement('i');
    icon.classList.add('fa', 'fa-window-close');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('id', 'popup-close-icon');

    const text = document.createElement('h4');
    text.classList.add('popup-title');
    text.innerHTML = "För tillfället hanterar vi inte alla valutor, för att se vilka som är med i beräkningen<br>vänligen se listan för knapparna ovan" ?? "Laddar text...";
    popupHeader.appendChild(titleElement);
    popupHeader.appendChild(icon);


    //här sätter jag de olika elementen till själva popupen
    divElement.appendChild(popupHeader);
    divElement.appendChild(text);

    //och här sätts hela popupen som barn till DOMen
    document.body.appendChild(divElement);

    //lägger eventlyssnare här för att stänga popupen
    const closePopupIcon = document.querySelector('#popup-close-icon');
    closePopupIcon.addEventListener('click', closeExclamationPopup);

}


function closeExclamationPopup() {
    const popUpDiv = document.querySelector('.exclamation-popup-div');
    if (popUpDiv !== null) {
      popUpDiv.remove();
    }
  }