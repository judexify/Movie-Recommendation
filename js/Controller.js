import * as view from "./View.js";
import * as model from "./Model.js";

const menuIcon = document.querySelector('[name="menu-outline"]');
const nav = document.querySelector("nav");
const closeIcon = document.querySelector('[name="close-outline"]');
const overlay = document.querySelector(".overlay");
const container = document.querySelector(".body-container");
const recommendForMeBtn = document.querySelector(".recommend-btn");
const header = document.querySelector("header");

// Infinite scroll carousel

document.addEventListener("DOMContentLoaded", init);

function init() {
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

  controlFetchedTrendingData();
}

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

// Auto-Scroll
function autoScroll(trendingMovies) {
  const state = model.state;

  if (!state.carousel.isHovered) {
    state.carousel.scrollPosition += state.carousel.scrollSpeed;
    trendingMovies.scrollLeft = state.carousel.scrollPosition;

    const maxScroll = trendingMovies.scrollWidth - trendingMovies.clientWidth;
    if (state.carousel.scrollPosition >= maxScroll) {
      state.carousel.scrollPosition = 0;
      trendingMovies.scrollLeft = 0;
    }
  }

  requestAnimationFrame(() => autoScroll(trendingMovies));
  // it calls it self
}

async function controlFetchedTrendingData() {
  const trendingMoviesArr = await model.fetchTrendingMovies();
  view.displayTrending(trendingMoviesArr, header);

  const trendingMovies = document.querySelector(".trending-movies");
  const squares = document.querySelectorAll(".square");

  const state = model.state;
  // Pause on hover
  trendingMovies.addEventListener("mouseenter", () => {
    state.carousel.isHovered = true;
  });

  trendingMovies.addEventListener("mouseleave", () => {
    state.carousel.isHovered = false;
  });

  // Initialize scroll
  view.setupInfiniteScroll(squares, trendingMovies);
  autoScroll(trendingMovies);
}
