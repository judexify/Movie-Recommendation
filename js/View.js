export const controlOverLay = function (nav, menuIcon, overlay) {
  nav.classList.toggle("hidden");
  menuIcon.classList.toggle("hidden");
  overlay.classList.toggle("show");
};

export const generateMarkupSpinner = function (
  parentEl,
  width,
  height,
  className = "spinner",
) {
  const spinner = document.createElement("div");
  spinner.className = className;
  spinner.style.width = `${width}rem`;
  spinner.style.height = `${height}rem`;

  parentEl.appendChild(spinner);
  return spinner;
};

export function showmodal(message = "You are good to go") {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content-for";

  const text = document.createElement("p");
  text.textContent = message;

  modalContent.appendChild(text);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("show"), 10);

  // Auto-close the modal after 2 seconds
  setTimeout(() => {
    modal.classList.remove("show");
  }, 2000);
}

export const setupInfiniteScroll = function (element, parentEl) {
  const squaresArray = Array.from(element);

  // Clone all squares and append them
  squaresArray.forEach((square) => {
    const clone = square.cloneNode(true);
    parentEl.appendChild(clone);
  });
};

export const displayTrendingForCarousel = function (dataArr, parentEl) {
  const slicedDataArr = dataArr.slice(0, 9);

  const squaresMarkup = slicedDataArr
    .map((data) => {
      const imgPath = `https://image.tmdb.org/t/p/w500${data.poster_path || data.profile_path}`;

      return `
        <div class="square" data-id="${data.id}">
          <img src="${imgPath}" />
        </div>
      `;
    })
    .join("");

  const markup = `
    <div class="trending-movies">
      ${squaresMarkup}
    </div>
  `;

  parentEl.insertAdjacentHTML("beforeend", markup);
};
export const displayTrendingForTabbedComponent = function (dataArr, parentEl) {
  parentEl.innerHTML = "";

  const slicedDataArr = dataArr.slice(0, 9);

  const trendingTabMarkup = slicedDataArr
    .map((data) => {
      return ` <div class="movie-card" data-id="${data.id}" data-mediatype="${data.media_type}">
      <div class="movie-poster">
        <img
          src="https://image.tmdb.org/t/p/w500${data.poster_path || data.profile_path}" 
          alt="${data.title}"
        />
        <span class="media-type" >${data.media_type || "nil"}</span>
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${data.title ? data.title : data.name}</h3>
        <p class="release-date">${!data.release_date ? "TBA" : data.release_date}</p>
        <p class="movie-overview">
        ${data.overview || "No Overview Available! Check Back Later."}
        </p>
        <ul class="movie-meta">
          <li class="rating">
            <ion-icon name="star"></ion-icon>
            <span>${data.vote_average ? data.vote_average.toFixed(1) : "5.0"}</span>
          </li>
          <li class="vote-count">${data.vote_count || 1} votes</li>
          <li class="read-more">Read More</li>
        </ul>
      </div>
    </div>`;
    })
    .join("");

  parentEl.insertAdjacentHTML("afterbegin", trendingTabMarkup);
};

export const generateModalMarkup = function (data) {
  const isTV = data.name !== undefined;
  const title = isTV ? data.name : data.title;
  const releaseDate = isTV ? data.first_air_date : data.release_date;

  // Get trailer if available
  const trailer = data.videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  );

  // Get top 5 cast members
  const cast = data.credits?.cast?.slice(0, 5) || [];

  // Get streaming providers
  const providers = data["watch/providers"]?.results?.US?.flatrate || [];

  return `
    <div class="modal-header">
      <div class="modal-header-actions">
        <button class="modal-close-btn">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
      
      <div class="modal-backdrop-wrapper">
        ${
          data.backdrop_path
            ? `<img src="https://image.tmdb.org/t/p/original${data.backdrop_path}" alt="${title}" class="modal-backdrop" />`
            : ""
        }
        <div class="modal-backdrop-overlay"></div>
      </div>
      
      <div class="modal-title-section">
        <h2 class="modal-title">${title}</h2>
        ${data.tagline ? `<p class="modal-tagline">${data.tagline}</p>` : ""}
      </div>
    </div>

    <div class="modal-body">
      <!-- Rest of your modal content stays the same -->
      <div class="modal-main-content">
        <div class="modal-poster-section">
          ${
            data.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${title}" class="modal-poster" />`
              : '<div class="modal-poster-placeholder">No Image</div>'
          }
        </div>

        <div class="modal-details-section">
          <div class="modal-stats">
            <div class="modal-stat">
              <ion-icon name="star"></ion-icon>
              <span>${data.vote_average?.toFixed(1) || "N/A"}/10</span>
            </div>
            <div class="modal-stat">
              <ion-icon name="calendar-outline"></ion-icon>
              <span>${releaseDate || "TBA"}</span>
            </div>
            ${
              isTV
                ? `
              <div class="modal-stat">
                <ion-icon name="tv-outline"></ion-icon>
                <span>${data.number_of_seasons} Season${data.number_of_seasons > 1 ? "s" : ""}</span>
              </div>
            `
                : ""
            }
            <div class="modal-stat">
              <ion-icon name="time-outline"></ion-icon>
              <span>${data.runtime ? `${data.runtime} min` : isTV && data.episode_run_time?.length ? `${data.episode_run_time[0]} min/ep` : "N/A"}</span>
            </div>
          </div>

          <div class="modal-info-group">
            <h3 class="modal-section-title">Overview</h3>
            <p class="modal-overview">${data.overview || "No overview available."}</p>
          </div>

          <div class="modal-info-group">
            <h3 class="modal-section-title">Genres</h3>
            <div class="modal-genres">
              ${data.genres?.map((genre) => `<span class="genre-tag">${genre.name}</span>`).join("") || "<span>N/A</span>"}
            </div>
          </div>

          ${
            cast.length > 0
              ? `
            <div class="modal-info-group">
              <h3 class="modal-section-title">Cast</h3>
              <div class="modal-cast">
                ${cast
                  .map(
                    (actor) => `
                  <div class="cast-member">
                    ${
                      actor.profile_path
                        ? `<img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" alt="${actor.name}" />`
                        : `<div class="cast-placeholder"><ion-icon name="person-outline"></ion-icon></div>`
                    }
                    <div class="cast-info">
                      <p class="cast-name">${actor.name}</p>
                      <p class="cast-character">${actor.character}</p>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }

          ${
            providers.length > 0
              ? `
            <div class="modal-info-group">
              <h3 class="modal-section-title">Where to Watch</h3>
              <div class="modal-providers">
                ${providers
                  .map(
                    (provider) => `
                  <div class="provider-item">
                    <img src="https://image.tmdb.org/t/p/original${provider.logo_path}" alt="${provider.provider_name}" />
                    <span>${provider.provider_name}</span>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }

          ${
            trailer
              ? `
            <div class="modal-info-group">
              <h3 class="modal-section-title">Trailer</h3>
              <div class="modal-trailer">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/${trailer.key}"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;
};

// Show modal
export const showModalForDetailedMov = function (data) {
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalContent = document.querySelector(".modal-content");

  const markup = generateModalMarkup(data);
  modalContent.innerHTML = markup;
  modalContent.addEventListener("click", (e) => {
    if (e.target.closest(".modal-close-btn")) hideModal();
  });
  modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

// Hide modal
export const hideModal = function () {
  const modalOverlay = document.querySelector(".modal-overlay");
  modalOverlay.classList.add("hidden");
  document.body.style.overflow = "";
};

export const displayMediaContent = function (data, container, contentClass) {
  const slicedData = contentClass === "upcoming" ? data.slice(0, 9) : data;

  const markup = slicedData
    .map((item) => {
      return `<div class="movie-card" data-id="${item.id}" data-mediatype="${item.media_type || (item.title ? "movie" : "tv")}">
        <div class="movie-poster">
          <img
            src="https://image.tmdb.org/t/p/w500${item.poster_path}"
            alt="${item.title || item.name}"
          />
          <span class="media-type">${item.media_type || (item.title ? "movie" : "tv")}</span>
        </div>
        <div class="movie-info">
          <h3 class="movie-title">${item.title || item.name}</h3>
          <p class="release-date">${item.release_date || item.first_air_date || "TBA"}</p>
          <p class="movie-overview">
          ${item.overview || "No Overview Available! Check Back Later."}
          </p>
          <ul class="movie-meta">
            <li class="rating">
              <ion-icon name="star"></ion-icon>
              <span>${item.vote_average ? item.vote_average.toFixed(1) : "5.0"}</span>
            </li>
            <li class="vote-count">${item.vote_count || 1} votes</li>
            <li class="read-more">Read More</li>
          </ul>
        </div>
      </div>`;
    })
    .join("");

  container.querySelector(`.${contentClass}-content`).innerHTML = markup;
};

export const displayUpcomingContent = function (data, container) {
  displayMediaContent(data, container, "upcoming");
};

export const displayPopularContent = function (data, container) {
  displayMediaContent(data, container, "popular");
};

export const displayTopRatedContent = function (data, container) {
  displayMediaContent(data, container, "toprated");
};

// Display search results
export const displaySearchResults = function (results, container) {
  if (!results || results.length === 0) {
    container.innerHTML =
      '<p class="input-result-none">No results found. Try a different search term.</p>';
    return;
  }

  const filteredResults = results
    .filter((item) => item.poster_path || item.profile_path)
    .slice(0, 10);

  if (filteredResults.length === 0) {
    container.innerHTML =
      '<p class="input-result-none">No results found. Try a different search term.</p>';
    return;
  }

  const markup = filteredResults
    .map((item) => {
      const mediaType = item.media_type || "movie";
      const title = item.title || item.name;
      const releaseDate = item.release_date || item.first_air_date;
      const posterPath = item.poster_path || item.profile_path;

      return `
        <div class="search-result-item" data-id="${item.id}" data-mediatype="${mediaType}">
          <div class="search-result-poster">
            ${
              posterPath
                ? `<img src="https://image.tmdb.org/t/p/w200${posterPath}" alt="${title}" />`
                : `<div class="search-result-poster-placeholder"><ion-icon name="film-outline"></ion-icon></div>`
            }
          </div>
          <div class="search-result-info">
            <h4 class="search-result-title">${title}</h4>
            <div class="search-result-meta">
              <span class="media-type-badge">${mediaType.toUpperCase()}</span>
              ${releaseDate ? `<span>${releaseDate.split("-")[0]}</span>` : ""}
              ${item.vote_average ? `<span>⭐ ${item.vote_average.toFixed(1)}</span>` : ""}
            </div>
            ${item.overview ? `<p class="search-result-overview">${item.overview}</p>` : ""}
          </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = markup;
};

// i want to show seacrh results
export const showSearchResults = function () {
  const inputResult = document.querySelector(".input-result");
  if (inputResult) {
    inputResult.classList.remove("hidden");
  }
};

// i want to hide seacrh results
export const hideSearchResults = function () {
  const inputResult = document.querySelector(".input-result");
  if (inputResult) {
    inputResult.classList.add("hidden");
  }
};

// i want to Clear search results
export const clearSearchResults = function () {
  const inputResult = document.querySelector(".input-result");
  if (inputResult) {
    inputResult.innerHTML = "";
  }
};

// Generate filter controls for sections
export const generateFilterControls = function (sectionType) {
  const regions = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "IN", name: "India" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" },
    { code: "AR", name: "Argentina" },
    { code: "NL", name: "Netherlands" },
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "FI", name: "Finland" },
    { code: "PL", name: "Poland" },
    { code: "RU", name: "Russia" },
    { code: "CN", name: "China" },
    { code: "TH", name: "Thailand" },
    { code: "ID", name: "Indonesia" },
    { code: "PH", name: "Philippines" },
    { code: "MY", name: "Malaysia" },
    { code: "SG", name: "Singapore" },
    { code: "NZ", name: "New Zealand" },
    { code: "ZA", name: "South Africa" },
    { code: "NG", name: "Nigeria" },
  ];

  const regionsOptions = regions
    .map((region) => `<option value="${region.code}">${region.name}</option>`)
    .join("");

  return `
    <div class="filter-controls" data-section="${sectionType}">
      <div class="filter-group">
        <label for="${sectionType}-region-filter">
          <ion-icon name="location-outline"></ion-icon>
          Region:
        </label>
        <select id="${sectionType}-region-filter" class="region-filter" data-section="${sectionType}">
          <option value="">All Regions</option>
          ${regionsOptions}
        </select>
      </div>
      
      <div class="filter-group">
        <label for="${sectionType}-sort-filter">
          <ion-icon name="funnel-outline"></ion-icon>
          Sort:
        </label>
        <select id="${sectionType}-sort-filter" class="sort-filter" data-section="${sectionType}">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  `;
};

export const sortMediaContent = function (data, sortType) {
  const sortedData = [...data];

  switch (sortType) {
    case "newest":
      return sortedData.sort((a, b) => {
        const dateA = new Date(
          a.release_date || a.first_air_date || "1900-01-01",
        );
        const dateB = new Date(
          b.release_date || b.first_air_date || "1900-01-01",
        );
        return dateB - dateA;
      });

    case "oldest":
      return sortedData.sort((a, b) => {
        const dateA = new Date(
          a.release_date || a.first_air_date || "1900-01-01",
        );
        const dateB = new Date(
          b.release_date || b.first_air_date || "1900-01-01",
        );
        return dateA - dateB;
      });

    case "rating":
      return sortedData.sort((a, b) => {
        return (b.vote_average || 0) - (a.vote_average || 0);
      });

    default:
      return sortedData;
  }
};

export const insertFilterControls = function (container, sectionType) {
  const existingFilters = container.querySelector(".filter-controls");
  if (existingFilters) return;

  const filterMarkup = generateFilterControls(sectionType);
  const mediaSelector = container.querySelector(".media-type-selector");

  if (mediaSelector) {
    mediaSelector.insertAdjacentHTML("afterend", filterMarkup);
  } else {
    container.insertAdjacentHTML("afterbegin", filterMarkup);
  }
};

export const getFilterValues = function (sectionType) {
  const regionFilter = document.querySelector(`#${sectionType}-region-filter`);
  const sortFilter = document.querySelector(`#${sectionType}-sort-filter`);

  return {
    region: regionFilter?.value || "",
    sort: sortFilter?.value || "newest",
  };
};
