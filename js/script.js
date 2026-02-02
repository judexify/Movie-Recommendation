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

const renderInputFieldHtml = function () {
  container.innerHTML = "";

  const inputContainer = document.createElement("div");
  inputContainer.className = "inputContainer";

  const input = document.createElement("input");
  input.type = "text";
  input.required = true;
  input.placeholder = "Enter a movie name....";

  const button = document.createElement("button");
  button.textContent = "Get Recommendation";

  inputContainer.append(input, button);
  return inputContainer;
};

if (recommendForMeBtn) {
  recommendForMeBtn.addEventListener("click", function () {
    const inputandBtn = renderInputFieldHtml();
    container.appendChild(inputandBtn);
  });
}
