import * as view from "./View.js";
import * as model from "./Model.js";
import * as helper from "./helper.js";

const menuIcon = document.querySelector('[name="menu-outline"]');
const nav = document.querySelector("nav");
const closeIcon = document.querySelector('[name="close-outline"]');
const overlay = document.querySelector(".overlay");
const recommendForMeBtn = document.querySelector(".recommend-btn");
const header = document.querySelector("header");
const moviesSection = document.querySelector(".movies-section");
const form = document.querySelector(".input-form");
const inputField = document.querySelector('input[name="query"]');
const inputWrapper = document.querySelector(".input-wrapper");
const tabs = document.querySelectorAll(".tabs button");
const trendingSection = document.querySelector("#trending-section");
const pagination = document.querySelector(".pagination");

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
        const spinner = view.generateMarkupSpinner(inputWrapper, 2.4, 2.4);

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
  controlPagination();
  initModalHandlers();
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
  view.generateMarkupSpinner(trendingSection, 4.8, 4.8, "spinner-centered");
  const trendingMoviesArr = await model.fetchTrendingMovies();
  controlFetchedDataForTrending(trendingMoviesArr);
  view.displayTrendingForCarousel(trendingMoviesArr, header);

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

function controlFetchedDataForTrending(data) {
  view.displayTrendingForTabbedComponent(data, trendingSection);
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

async function controlPagination() {
  pagination.addEventListener("click", async function (e) {
    e.preventDefault();
    const target = e.target;

    const allPages = pagination.querySelectorAll(".pages");
    allPages.forEach((page) => page.classList.remove("active"));

    target.classList.add("active");

    const targetid = +target.dataset.id;

    const data = await model.fetchTrendingMovies(targetid);
    controlFetchedDataForTrending(data);
  });
}

const handleMovieCardClick = async function (e) {
  const movieCard = e.target.closest(".movie-card");
  if (!movieCard) return;

  const movieId = movieCard.dataset.id;
  const mediaType = movieCard.dataset.mediatype;

  try {
    const details = await model.fetchMediaDetails(mediaType, movieId);

    console.log("Media Details:", details);

    view.showModalForDetailedMov(details);
  } catch (error) {
    console.error("Error loading details:", error);
    view.showmodal("Failed to load movie details. Please try again.");
  }
};

trendingSection.addEventListener("click", handleMovieCardClick);

function initModalHandlers() {
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalClose = document.querySelector(".modal-close");

  if (modalClose) {
    modalClose.addEventListener("click", view.hideModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        view.hideModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      view.hideModal();
    }
  });
}
