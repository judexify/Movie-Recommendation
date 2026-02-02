"use strict";

const menuIcon = document.querySelector('[name="menu-outline"]');
const nav = document.querySelector("nav");
const closeIcon = document.querySelector('[name="close-outline"]');
const overlay = document.querySelector(".overlay");
const container = document.querySelector(".body-container");
const recommendForMeBtn = document.querySelector(".recommend-btn");

function controlOverLay() {
  nav.classList.toggle("hidden");
  menuIcon.classList.toggle("hidden");
  overlay.classList.toggle("show");
}

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

  const inputWrapper = document.createElement("div");
  inputWrapper.className = "input-wrapper";

  const input = document.createElement("input");
  input.type = "text";
  input.required = true;
  input.placeholder = "Enter a movie name....";

  const button = document.createElement("button");
  button.textContent = "Get Recommendation";

  inputWrapper.appendChild(input);
  inputContainer.append(inputWrapper, button);

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

  return inputContainer;
};

const generateMarkupSpinner = function (parentEl, width = "", height = "") {
  const spinner = document.createElement("div");
  spinner.className = "spinner";

  parentEl.appendChild(spinner);
  return spinner;
};

if (recommendForMeBtn) {
  recommendForMeBtn.addEventListener("click", function () {
    container.innerHTML = "";

    const inputandBtn = generateMarkupInputField();
    requestAnimationFrame(() => {
      inputandBtn.classList.add("is-visible");
    });
    container.appendChild(inputandBtn);
  });
}
