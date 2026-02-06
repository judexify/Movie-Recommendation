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
  modalContent.className = "modal-content";

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

  console.log(slicedDataArr);

  const squaresMarkup = slicedDataArr
    .map((data) => {
      const imgPath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

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
          src="https://image.tmdb.org/t/p/w500${data.poster_path}"
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
            <span>${data.vote_average === 0 ? 5 : data.vote_average.toFixed(1)}</span>
          </li>
          <li class="vote-count">${data.vote_count === 0 ? 1 : data.vote_count} votes</li>
          <li class="read-more">Read More</li>
        </ul>
      </div>
    </div>`;
    })
    .join("");

  parentEl.insertAdjacentHTML("afterbegin", trendingTabMarkup);
};

// Generate modal markup for movie/TV details
export const generateModalMarkup = function (data) {
  const isTV = data.name !== undefined; // TV shows have 'name', movies have 'title'
  const title = isTV ? data.name : data.title;
  const releaseDate = isTV ? data.first_air_date : data.release_date;

  // Get trailer if available
  const trailer = data.videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  );

  // Get top 5 cast members
  const cast = data.credits?.cast?.slice(0, 5) || [];

  //  genres
  const genres = data.genres?.map((g) => g.name).join(", ") || "N/A";

  // streaming providers
  const providers = data["watch/providers"]?.results?.US?.flatrate || [];

  return `
    <div class="modal-header">
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
  modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

// Hide modal
export const hideModal = function () {
  const modalOverlay = document.querySelector(".modal-overlay");
  modalOverlay.classList.add("hidden");
  document.body.style.overflow = "";
};
