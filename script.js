document.addEventListener('DOMContentLoaded', main);


function main() {
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




