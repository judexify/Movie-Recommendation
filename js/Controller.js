import * as view from "./View.js";
import * as model from "./Model.js";

const menuIcon = document.querySelector('[name="menu-outline"]');
const nav = document.querySelector("nav");
const closeIcon = document.querySelector('[name="close-outline"]');
const overlay = document.querySelector(".overlay");
const container = document.querySelector(".body-container");
const recommendForMeBtn = document.querySelector(".recommend-btn");
const header = document.querySelector("header");
const moviesSection = document.querySelector(".movies-section");
const form = document.querySelector(".input-form");
const inputField = document.querySelector('input[name="query"]');
const inputWrapper = document.querySelector(".input-wrapper");
const tabs = document.querySelectorAll(".tabs button");
console.log(tabs);

// Infinite scroll carousel

document.addEventListener("DOMContentLoaded", init);

const addSpinnerToInput = function () {
  let typingTimeout;
  let spinnerTimeout;

  inputField.addEventListener("input", function () {
    clearTimeout(typingTimeout);
    clearTimeout(spinnerTimeout);

    const existingSpinner = inputWrapper.querySelector(".spinner");
    if (existingSpinner) existingSpinner.remove();

    if (inputField.value.trim().length > 0) {
      typingTimeout = setTimeout(() => {
        const spinner = view.generateMarkupSpinner(inputWrapper);

        spinnerTimeout = setTimeout(() => {
          if (spinner) {
            spinner.remove();
          }
        }, 2000);
      }, 300);
    }
  });
};

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

  recommendForMeBtn.addEventListener("click", function () {
    moviesSection.scrollIntoView({ behavior: "smooth" });
  });

  controlFetchedTrendingData();
  addSpinnerToInput();
  showTabFromURL();
}

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

function showTabFromURL() {
  const tabsArr = Array.from(tabs);
  const validTabs = tabsArr.map((t) => t.dataset.tab);

  function activateTab(tabId) {
    tabsArr.forEach((btn) => btn.classList.remove("active"));

    document.querySelectorAll(".tabcontent").forEach((content) => {
      content.classList.add("hidden");
    });

    const btn = tabsArr.find((b) => b.dataset.tab === tabId);
    if (!btn) return;

    btn.classList.add("active");
    document.getElementById(tabId + "-section")?.classList.remove("hidden");
  }

  tabsArr.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.dataset.tab;
      window.location.hash = tabId;
      activateTab(tabId);
    });
  });

  const hash = window.location.hash.slice(1);
  if (hash && validTabs.includes(hash)) {
    activateTab(hash);
  }
}
