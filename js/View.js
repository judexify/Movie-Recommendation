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
          <p class="movie-overview">
          ${data.overview || "No Overview Available! Check Back Later."}
          </p>
          <ul class="movie-meta">
            <li class="rating">
              <ion-icon name="star"></ion-icon>
              <span>${data.vote_average === 0 ? 5 : data.vote_average}</span>
            </li>
            <li class="release-date">${!data.release_date ? "TBA" : data.release_date}</li>
            <li class="vote-count">${data.vote_count === 0 ? 1 : data.vote_count} votes</li>
            <li class="read-more">Read More</li>
          </ul>
        </div>
      </div>`;
    })
    .join("");

  parentEl.insertAdjacentHTML("afterbegin", trendingTabMarkup);
};
