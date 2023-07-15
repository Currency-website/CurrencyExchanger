let isStrongestPopupOpen = false;
let isWeakestPopupOpen = false;
let isFeedbackOpen = false;

export async function initPopupRender() {
  addEventListenerForPopups();
}

async function addEventListenerForPopups() {
  const feedbackBtn = document.querySelector("#feedback-btn");
  feedbackBtn.addEventListener("click", await toggleFeedbackPopup);

  const strongestIcon = document.querySelector('#strongest-icon');
  const weakestIcon = document.querySelector('#weakest-icon');

  // for (let i = 0; i < exclamationMarkIcons.length; i++) {
  //   const icon = exclamationMarkIcons[i];
  //   icon.addEventListener('click', async (event) => {
  //     const clickX = event.clientX;
  //     const clickY = event.clientY;
  //     await toggleExclamationPopup(clickX, clickY);
  //   });

  strongestIcon.addEventListener('click', async (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;
    await toggleExclamationPopup(clickX, clickY, "strongest");
  });

  weakestIcon.addEventListener('click', async (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;
    await toggleExclamationPopup(clickX, clickY, "weakest");
  });

  //vi får se om detta funkar: ? men ej säkert att dom kan heta samma icons såhär utan foreach
  // const popUpDiv = document.querySelector('.exclamation-popup-div');
  // const closePopupIcons = document.querySelector('.popup-close-icon');
  // closePopupIcons.addEventListener('click', closePopup(popUpDiv));

 
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

async function renderExclamationMarkPopup(clickX, clickY, icon) {
  if (icon == "weakest") {

    const divElement = document.createElement('div');
    divElement.classList.add('exclamation-weakest-popup-div');

    // if (window.innerWidth <= 768) {
    //   // Mobilstorlek - ändra positionen
    //   divElement.style.left = clickX + 120 + 'px';
    //   divElement.style.top = clickY + 50 + 'px';
    // } else {
    //   // Annars använd tidigare positionering
    //   divElement.style.left = clickX + 200 + 'px';
    //   divElement.style.top = clickY + 70 + 'px';
    // }
    const popupHeader = document.createElement('div');
    popupHeader.classList.add('popup-header');

    const titleElement = document.createElement('h3');
    titleElement.classList.add('popup-date');
    titleElement.textContent = "Information" ?? "Laddar datum...";

    const text = document.createElement('h4');
    text.classList.add('popup-title');
    text.innerHTML = "När du växlar från {basvalutan} får du mindre av {den svagaste valutan}.";
    popupHeader.appendChild(titleElement);
    // popupHeader.appendChild(icon);

    // Här sätter jag de olika elementen till själva popupen
    divElement.appendChild(popupHeader);
    divElement.appendChild(text);

    // Och här sätts hela popupen som barn till DOMen
    document.body.appendChild(divElement);
  }
  else if (icon == "strongest") {
    const divElement = document.createElement('div');
    divElement.classList.add('exclamation-strongest-popup-div');

    const popupHeader = document.createElement('div');
    popupHeader.classList.add('popup-header');

    const titleElement = document.createElement('h3');
    titleElement.classList.add('popup-date');
    titleElement.textContent = "Information" ?? "Laddar datum...";

    const text = document.createElement('h4');
    text.classList.add('popup-title');
    text.innerHTML = "När du växlar från basvalutan får du mer av den starkaste valutan.";
    popupHeader.appendChild(titleElement);
    // popupHeader.appendChild(icon);

    // Här sätter jag de olika elementen till själva popupen
    divElement.appendChild(popupHeader);
    divElement.appendChild(text);

    // Och här sätts hela popupen som barn till DOMen
    document.body.appendChild(divElement);
  }
}

async function toggleExclamationPopup(clickX, clickY, icon) {

  if (icon == "strongest") {
    if (isStrongestPopupOpen) {
      const popUpDiv = document.querySelector('.exclamation-strongest-popup-div');
      popUpDiv.remove(); // Stäng popupen om den är öppen
      isStrongestPopupOpen = false;
    } else {
      await renderExclamationMarkPopup(clickX, clickY, "strongest");
      isStrongestPopupOpen = true;
    }
  }
  else if (icon == "weakest") {
    if (isWeakestPopupOpen) {
      const popUpDiv = document.querySelector('.exclamation-weakest-popup-div');
      popUpDiv.remove(); // Stäng popupen om den är öppen
      isWeakestPopupOpen = false;
    } else {
      await renderExclamationMarkPopup(clickX, clickY, "weakest");
      isWeakestPopupOpen = true;
    }
  }

}


// function closePopup(popupDiv) {
//   if (popUpDiv !== null) {
//     popUpDiv.remove();
//   }
// }
