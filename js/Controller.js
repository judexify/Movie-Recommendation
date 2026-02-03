import * as view from "./View.js";
import * as model from "./Model.js";

const menuIcon = document.querySelector('[name="menu-outline"]');
const nav = document.querySelector("nav");
const closeIcon = document.querySelector('[name="close-outline"]');
const overlay = document.querySelector(".overlay");
const container = document.querySelector(".body-container");
const recommendForMeBtn = document.querySelector(".recommend-btn");

const init = function () {
  menuIcon.addEventListener("click", function () {
    view.controlOverLay(nav, menuIcon, overlay);
  });

  closeIcon.addEventListener("click", function () {
    view.controlOverLay(nav, menuIcon, overlay);
  });

  overlay.addEventListener("click", function () {
    view.controlOverLay(nav, menuIcon, overlay);
  });

  if (recommendForMeBtn) {
    recommendForMeBtn.addEventListener("click", function () {
      container.innerHTML = "";

      const { inputContainer, form } = view.generateMarkupInputField();

      container.appendChild(inputContainer);

      requestAnimationFrame(() => {
        inputContainer.classList.add("is-visible");
      });

      controlCollectFormData(form);
    });
  }
};

init();

const controlCollectFormData = function (form) {
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const query = data.query?.trim();

    if (!query) {
      view.showmodal("Invalid! You didnt input any query.");
    }
    model.setQuery(query);

    console.log(model.state.query);
  });
};
