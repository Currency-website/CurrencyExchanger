let isPopupOpen = false;
let isFeedbackOpen = false;

export async function initPopupRender() {
  addEventListenerForPopups();
}

async function addEventListenerForPopups() {
  const exclamationMarkIcons = document.querySelectorAll('.fa-circle-exclamation');

  const feedbackBtn = document.querySelector("#feedback-btn");
  feedbackBtn.addEventListener("click", await toggleFeedbackPopup);

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

  await addEventListenerForSendingFeedback();
}

// async function saveFeedback() {
//   const inputElement = document.querySelector('.feedback-textarea');
//   const feedback = inputElement.value;
//   const feedbackData = { feedback };

//   localStorage.setItem('feedbackData', JSON.stringify(feedbackData));
//   alert('Data saved to localStorage');
//   await downloadFeedbackAsJSON();
// }

// async function downloadFeedbackAsJSON() {
//   const googleFormsLink = 'https://docs.google.com/forms/d/e/your-form-id/viewform'; // Byt ut med din Google Forms-länk
//   window.open(googleFormsLink, '_blank');
// }


async function toggleFeedbackPopup() {

  if (isFeedbackOpen) {
    const popUpDiv = document.querySelector('.feedback-popup-div');
    popUpDiv.remove(); // Stäng popupen om den är öppen
    isFeedbackOpen = false;
  } else {
    await renderFeedbackPopup();
    isFeedbackOpen = true;
  }
}

// async function renderFeedbackPopup() {
//   const divElement = document.createElement('div');
//   divElement.classList.add('feedback-popup-div');

//   const popupHeader = document.createElement('div');
//   popupHeader.classList.add('popup-header');

//   const titleElement = document.createElement('h3');
//   titleElement.classList.add('popup-date');
//   titleElement.textContent = "Skicka gärna feedback till oss";

//   const inputElement = document.createElement("textarea");
//   inputElement.classList.add('feedback-textarea');


//   const sendButton = document.createElement("button");
//   sendButton.classList.add("send-mail-btn");
//   sendButton.textContent = "Skicka";
//   sendButton.addEventListener("click", await saveFeedback);

//   const buttonDiv = document.createElement("div");
//   buttonDiv.classList.add("flex-center");
//   buttonDiv.appendChild(sendButton);

//   divElement.appendChild(popupHeader);
//   divElement.appendChild(titleElement);
//   divElement.appendChild(inputElement);
//   divElement.appendChild(buttonDiv);

//   document.body.appendChild(divElement);
// }

async function renderFeedbackPopup() {
  const divElement = document.createElement('div');
  divElement.classList.add('feedback-popup-div');

  const popupHeader = document.createElement('div');
  popupHeader.classList.add('popup-header');

  const titleElement = document.createElement('h3');
  titleElement.classList.add('popup-date');
  titleElement.textContent = "Skicka gärna feedback till oss";

  const formLink = document.createElement("a");
  formLink.classList.add("send-mail-btn");
  formLink.innerHTML = "Till Google forms";

  formLink.href = "https://docs.google.com/forms/d/1ce0VHPeDesKB6EHJ6vvnmQji77ocqcJTaRU1sGQz_D8/edit"; // Byt ut med din Google Forms-länk

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("flex-center");
  buttonDiv.appendChild(formLink);

  divElement.appendChild(popupHeader);
  divElement.appendChild(titleElement);
  divElement.appendChild(buttonDiv);

  document.body.appendChild(divElement);
}

async function renderExclamationMarkPopup(clickX, clickY) {
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
