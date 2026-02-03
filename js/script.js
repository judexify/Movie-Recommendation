"use strict";

const menuIcon = document.querySelector('[name="menu-outline"]');
const nav = document.querySelector("nav");
const closeIcon = document.querySelector('[name="close-outline"]');
const overlay = document.querySelector(".overlay");
const container = document.querySelector(".body-container");
const recommendForMeBtn = document.querySelector(".recommend-btn");

const controlOverLay = function () {
  nav.classList.toggle("hidden");
  menuIcon.classList.toggle("hidden");
  overlay.classList.toggle("show");
};

const controlMenuBar = function (...icons) {
  icons.forEach((icon) => {
    if (icon) {
      icon.addEventListener("click", controlOverLay);
    }
  });

  window.addEventListener("click", function (e) {
    const target = e.target;
    if (target === overlay) {
      controlOverLay();
    }
  });
};

controlMenuBar(menuIcon, closeIcon);

const generateMarkupInputField = function () {
  const inputContainer = document.createElement("div");
  inputContainer.className = "inputContainer";

  const form = document.createElement("form");
  form.className = "input-form";

  const inputWrapper = document.createElement("div");
  inputWrapper.className = "input-wrapper";

  const input = document.createElement("input");
  input.type = "text";
  input.name = "query";
  // input.required = true;
  input.placeholder = "Enter a movie name....";

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Get Recommendation";

  inputWrapper.appendChild(input);
  form.append(inputWrapper, button);
  inputContainer.appendChild(form);

  let typingTimeout;
  let spinnerTimeout;

  input.addEventListener("input", function () {
    clearTimeout(typingTimeout);
    clearTimeout(spinnerTimeout);

    const existingSpinner = inputWrapper.querySelector(".spinner");
    if (existingSpinner) existingSpinner.remove();

    if (input.value.trim().length > 0) {
      typingTimeout = setTimeout(() => {
        const spinner = generateMarkupSpinner(inputWrapper);

        spinnerTimeout = setTimeout(() => {
          if (spinner) {
            spinner.remove();
          }
        }, 2000);
      }, 300);
    }
  });

  return { inputContainer, form };
};

const generateMarkupSpinner = function (parentEl) {
  const spinner = document.createElement("div");
  spinner.className = "spinner";

  parentEl.appendChild(spinner);
  return spinner;
};

function generateMarkupModal(error = "You are good to go") {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const text = document.createElement("p");
  text.textContent = error;

  modalContent.appendChild(text);
  modal.appendChild(modalContent);

  showModal(modal);
  // document.body.appendChild(modal);
}

const showModal = function (modal) {
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("show"), 10);

  // Auto-close the modal after 2 seconds
  setTimeout(() => {
    modal.classList.remove("show");
  }, 2000);
};

if (recommendForMeBtn) {
  recommendForMeBtn.addEventListener("click", function () {
    container.innerHTML = "";

    const { inputContainer, form } = generateMarkupInputField();
    container.appendChild(inputContainer);
    requestAnimationFrame(() => {
      inputContainer.classList.add("is-visible");
    });

    collectFormData(form);
  });
}

const collectFormData = function (form) {
  if (!form) return console.log("form not found");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.query)
      return generateMarkupModal("Invalid! You didnt input any query.");
  });
};
