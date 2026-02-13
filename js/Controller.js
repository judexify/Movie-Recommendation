import * as view from "./View.js";
import * as model from "./Model.js";

const menuIcon = document.querySelector('[name="menu-outline"]');
const nav = document.querySelector("nav");
const closeIcon = document.querySelector('[name="close-outline"]');
const overlay = document.querySelector(".overlay");
const recommendForMeBtn = document.querySelector(".recommend-btn");
const header = document.querySelector("header");
const moviesSection = document.querySelector(".movies-section");
const form = document.querySelector(".input-form");
const inputField = document.querySelector('input[name="query"]');
const tabs = document.querySelectorAll(".tabs button");
const trendingSection = document.querySelector("#trending-section");
const pagination = document.querySelector(".pagination");
const topRatedSection = document.querySelector("#toprated-section");
const upcomingSection = document.querySelector("#upcoming-section");
const popularSection = document.querySelector("#popular-section");
const inputResult = document.querySelector(".input-result");

document.addEventListener("DOMContentLoaded", init);

let searchTimeout;
const handleSearchInput = function () {
  inputField.addEventListener("input", function () {
    clearTimeout(searchTimeout);

    const query = inputField.value.trim();

    if (query.length === 0) {
      view.hideSearchResults();
      view.clearSearchResults();
      return;
    }
    if (query.length < 2) return;

    view.showSearchResults();
    inputResult.innerHTML = "";
    const spinner = view.generateMarkupSpinner(
      inputResult,
      3.2,
      3.2,
      "spinner-centered",
    );

    // DEBOUNCE SEARCH

    //  WITHOUT DEBOUNCE
    //     User types: "I r o n   M a n"
    // API calls:  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
    //             I Ir Iro Iron Iron_ Iron_M Iron_Ma Iron_Man

    // Result: 8 API calls!  Wasteful and slow

    //  WITH DEBOUNCE
    // User types: "I r o n   M a n"
    // Timer:      Start→Cancel→Cancel→Cancel→Cancel→Cancel→Cancel→WAIT 500ms→Fire!
    // API calls:  (none until typing stops)                                    ↓
    //                                                                     "Iron Man"

    // Result: 1 API call!  Efficient

    searchTimeout = setTimeout(async () => {
      try {
        const results = await model.searchMedia(query);

        if (spinner) spinner.remove();
        view.displaySearchResults(results, inputResult);
      } catch (err) {
        console.error("Search Error", err);
        if (spinner) spinner.remove();
        view.showmodal("Error loading results. Please try again.");
      }
    }, 500);
  });

  inputResult.addEventListener("click", async function (e) {
    const resultItem = e.target.closest(".search-result-item");

    const movieId = resultItem.dataset.id;
    const mediaType = resultItem.dataset.mediatype;

    view.hideSearchResults();
    inputField.value = "";

    try {
      const details = await model.fetchMediaDetails(mediaType, movieId);

      view.showModalForDetailedMov(details);
    } catch (error) {
      console.error("Error loading details:", error);
      view.showmodal("Failed to load details. Please try again.");
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
  handleSearchInput();
  showTabFromURL();
  controlPagination();
  initModalHandlers();
  controlUpcomingSection();
  controlPopularSection();
  controlTopRatedSection();
  initializeFilters();
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const query = inputField.value.trim();

  if (!query) {
    view.showmodal("Invalid! You didnt input any query.");
    return;
  }

  model.setQuery(query);

  try {
    view.showSearchResults();
    inputResult.innerHTML = "";
    const spinner = view.generateMarkupSpinner(
      inputResult,
      3.2,
      3.2,
      "spinner-centered",
    );

    const results = await model.searchMedia(query);

    if (spinner) spinner.remove();

    view.displaySearchResults(results, inputResult);
  } catch (err) {
    console.error("Search error:", err);

    const existingSpinner = inputResult.querySelector(".spinner-centered");
    if (existingSpinner) existingSpinner.remove();

    inputResult.innerHTML =
      '<p class="input-result-none">Error loading results. Please try again.</p>';
  }

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
  const headerSpinner = view.generateMarkupSpinner(
    header,
    4.8,
    4.8,
    "spinner-centered",
  );
  const sectionSpinner = view.generateMarkupSpinner(
    trendingSection,
    4.8,
    4.8,
    "spinner-centered",
  );

  const trendingMoviesArr = await model.fetchTrendingMovies();

  if (headerSpinner) headerSpinner.remove();
  if (sectionSpinner) sectionSpinner.remove();

  controlFetchedDataForTrending(trendingMoviesArr);
  view.displayTrendingForCarousel(trendingMoviesArr, header);

  const trendingMovies = header.querySelector(".trending-movies");
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
  const allPages = pagination.querySelectorAll(".pages");

  allPages.forEach((page) => {
    page.addEventListener("click", async function (e) {
      e.preventDefault();

      allPages.forEach((p) => p.classList.remove("active"));

      this.classList.add("active");

      const pageNumber = +this.dataset.id;

      // i am checking which tab is active
      const activeTab = document.querySelector(".tabs button.active");
      const tabId = activeTab?.dataset.tab;

      const stateTabHandlers = {
        upcoming: async () => {
          const { mediaType, endpoint } = model.state.currentUpcoming || {
            mediaType: "movie",
            endpoint: "upcoming",
          };
          const filters = view.getFilterValues("upcoming");
          await loadMediaSection(
            "upcoming",
            mediaType,
            endpoint,
            pageNumber,
            filters.region,
          );
        },
        trending: async () => {
          const data = await model.fetchTrendingMovies(pageNumber);
          const filters = view.getFilterValues("trending");
          const sortedData = view.sortMediaContent(data, filters.sort);
          view.displayTrendingForTabbedComponent(sortedData, trendingSection);
        },
        popular: async () => {
          const { mediaType } = model.state.currentPopular || {
            mediaType: "movie",
          };
          const filters = view.getFilterValues("popular");
          await loadMediaSection(
            "popular",
            mediaType,
            "popular",
            pageNumber,
            filters.region,
          );
        },
        toprated: async () => {
          const { mediaType } = model.state.currentToprated || {
            mediaType: "movie",
          };
          const filters = view.getFilterValues("toprated");
          await loadMediaSection(
            "toprated",
            mediaType,
            "top_rated",
            pageNumber,
            filters.region,
          );
        },
      };

      if (stateTabHandlers[tabId]) {
        await stateTabHandlers[tabId]();
      }
    });
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

[trendingSection, upcomingSection, popularSection, topRatedSection].forEach(
  (section) => {
    section.addEventListener("click", handleMovieCardClick);
  },
);

function initModalHandlers() {
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalClose = document.querySelector(".modal-close-btn");

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

async function loadMediaSection(
  sectionId,
  mediaType,
  category,
  page = 1,
  region = "",
) {
  const section = document.querySelector(`#${sectionId}-section`);
  const content = section.querySelector(`.${sectionId}-content`);

  const displayHandlers = {
    upcoming: async () => {
      const data = await model.fetchUpcomingMedia(
        mediaType,
        category,
        page,
        region,
      );

      // Get current sort and apply
      const filters = view.getFilterValues(sectionId);
      const sortedData = view.sortMediaContent(data, filters.sort);

      // Clear spinner
      const spinner = content.querySelector(".spinner-centered");
      if (spinner) spinner.remove();

      view.displayUpcomingContent(sortedData, section);
    },
    popular: async () => {
      const data = await model.fetchPopularandTopRatedMedia(
        mediaType,
        category,
        page,
        region,
      );

      const filters = view.getFilterValues(sectionId);
      const sortedData = view.sortMediaContent(data, filters.sort);

      const spinner = content.querySelector(".spinner-centered");
      if (spinner) spinner.remove();

      view.displayPopularContent(sortedData, section);
    },
    toprated: async () => {
      const data = await model.fetchPopularandTopRatedMedia(
        mediaType,
        category,
        page,
        region,
      );

      const filters = view.getFilterValues(sectionId);
      const sortedData = view.sortMediaContent(data, filters.sort);

      const spinner = content.querySelector(".spinner-centered");
      if (spinner) spinner.remove();

      view.displayTopRatedContent(sortedData, section);
    },
  };

  try {
    content.innerHTML = "";
    view.generateMarkupSpinner(content, 4.8, 4.8, "spinner-centered");

    await displayHandlers[sectionId]();
  } catch (error) {
    console.error(`Error loading ${sectionId}:`, error);
    const spinner = content.querySelector(".spinner-centered");
    if (spinner) spinner.remove();
    content.innerHTML = '<p class="error">Failed to load content</p>';
  }
}

function handleMediaSelectorClick(sectionId, selectorBtns) {
  const stateKey = `current${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`;

  const sectionHandlers = {
    upcoming: async (mediaType, endpoint, filters) => {
      model.state[stateKey] = { mediaType, endpoint };
      await loadMediaSection(
        "upcoming",
        mediaType,
        endpoint,
        1,
        filters.region,
      );
    },
    popular: async (mediaType, _, filters) => {
      model.state[stateKey] = { mediaType, category: "popular" };
      await loadMediaSection(
        "popular",
        mediaType,
        "popular",
        1,
        filters.region,
      );
    },
    toprated: async (mediaType, _, filters) => {
      model.state[stateKey] = { mediaType, category: "top_rated" };
      await loadMediaSection(
        "toprated",
        mediaType,
        "top_rated",
        1,
        filters.region,
      );
    },
  };

  selectorBtns.forEach((btn) => {
    btn.addEventListener("click", async function () {
      selectorBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const mediaType = this.dataset.media;
      const endpoint = this.dataset.endpoint;
      const filters = view.getFilterValues(sectionId);

      await sectionHandlers[sectionId](mediaType, endpoint, filters);
    });
  });
}

async function controlUpcomingSection() {
  const selectorBtns = upcomingSection.querySelectorAll(".selector-btn");

  model.state.currentUpcoming = { mediaType: "movie", endpoint: "upcoming" };
  handleMediaSelectorClick("upcoming", selectorBtns);
  await loadMediaSection("upcoming", "movie", "upcoming", 1);
}

async function controlPopularSection() {
  const selectorBtns = popularSection.querySelectorAll(".selector-btn");

  model.state.currentPopular = { mediaType: "movie", category: "popular" };
  handleMediaSelectorClick("popular", selectorBtns);
  await loadMediaSection("popular", "movie", "popular", 1);
}

async function controlTopRatedSection() {
  const topRatedSection = document.querySelector("#toprated-section");
  const selectorBtns = topRatedSection.querySelectorAll(".selector-btn");

  model.state.currentToprated = { mediaType: "movie", category: "top_rated" };
  handleMediaSelectorClick("toprated", selectorBtns);
  await loadMediaSection("toprated", "movie", "top_rated", 1);
}

const loadUpcoming = async function (mediaType, endpoint, page = 1) {
  await loadMediaSection("upcoming", mediaType, endpoint, page);
};

const loadPopular = async function (mediaType, page = 1) {
  await loadMediaSection("popular", mediaType, "popular", page);
};

const loadTopRated = async function (mediaType, page = 1) {
  await loadMediaSection("toprated", mediaType, "top_rated", page);
};

// document.addEventListener("click", function (e) {
//   if (!e.target.closest(".inputContainer")) {
//     view.hideSearchResults();
//   }
// });

function initializeFilters() {
  // Insert filter controls into each section
  if (upcomingSection) {
    view.insertFilterControls(upcomingSection, "upcoming");
  }
  if (popularSection) {
    view.insertFilterControls(popularSection, "popular");
  }
  if (topRatedSection) {
    view.insertFilterControls(topRatedSection, "toprated");
  }
  if (trendingSection) {
    view.insertFilterControls(trendingSection, "trending");
  }

  // Setup filter change listeners
  setupFilterListeners();
}

function setupFilterListeners() {
  document.addEventListener("change", async (e) => {
    if (
      e.target.classList.contains("region-filter") ||
      e.target.classList.contains("sort-filter")
    ) {
      const section = e.target.dataset.section;
      await handleFilterChange(section);
    }
  });
}

async function handleFilterChange(sectionType) {
  const filters = view.getFilterValues(sectionType);

  const pagination = document.querySelector(".pagination");
  if (pagination) {
    const pages = pagination.querySelectorAll(".pages");
    pages.forEach((p) => p.classList.remove("active"));
    const firstPage = pagination.querySelector('.pages[data-id="1"]');
    if (firstPage) firstPage.classList.add("active");
  }

  const sectionHandlers = {
    upcoming: async () => {
      const { mediaType, endpoint } = model.state.currentUpcoming || {
        mediaType: "movie",
        endpoint: "upcoming",
      };

      if (filters.region && mediaType === "movie") {
        const data = await model.fetchMoviesByCountry(
          filters.region,
          "primary_release_date.desc",
          1,
        );
        const sortedData = view.sortMediaContent(data, filters.sort);

        const section = document.querySelector(`#upcoming-section`);
        view.displayUpcomingContent(sortedData, section);
      } else {
        await loadMediaSection(
          "upcoming",
          mediaType,
          endpoint,
          1,
          filters.region,
        );
      }
    },

    popular: async () => {
      const { mediaType } = model.state.currentPopular || {
        mediaType: "movie",
      };

      if (filters.region && mediaType === "movie") {
        const data = await model.fetchMoviesByCountry(
          filters.region,
          "popularity.desc",
          1,
        );
        const sortedData = view.sortMediaContent(data, filters.sort);

        const section = document.querySelector(`#popular-section`);
        view.displayPopularContent(sortedData, section);
      } else {
        await loadMediaSection(
          "popular",
          mediaType,
          "popular",
          1,
          filters.region,
        );
      }
    },

    toprated: async () => {
      const { mediaType } = model.state.currentToprated || {
        mediaType: "movie",
      };

      if (filters.region && mediaType === "movie") {
        const data = await model.fetchMoviesByCountry(
          filters.region,
          "vote_average.desc",
          1,
        );
        const sortedData = view.sortMediaContent(data, filters.sort);

        const section = document.querySelector(`#toprated-section`);
        view.displayTopRatedContent(sortedData, section);
      } else {
        await loadMediaSection(
          "toprated",
          mediaType,
          "top_rated",
          1,
          filters.region,
        );
      }
    },

    trending: async () => {
      const data = await model.fetchTrendingMovies(1, filters.region);
      const sortedData = view.sortMediaContent(data, filters.sort);
      view.displayTrendingForTabbedComponent(sortedData, trendingSection);
    },
  };

  try {
    await sectionHandlers[sectionType]();
  } catch (error) {
    console.error(`Error applying filters to ${sectionType}:`, error);
    view.showmodal("Failed to apply filters. Please try again.");
  }
}
