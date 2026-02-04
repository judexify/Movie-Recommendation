export const controlOverLay = function (nav, menuIcon, overlay) {
  nav.classList.toggle("hidden");
  menuIcon.classList.toggle("hidden");
  overlay.classList.toggle("show");
};

export const generateMarkupInputField = function () {
  const inputContainer = document.createElement("div");
  inputContainer.className = "inputContainer";

  const form = document.createElement("form");
  form.className = "input-form";

  const inputWrapper = document.createElement("div");
  inputWrapper.className = "input-wrapper";

  const input = document.createElement("input");
  input.type = "text";
  input.name = "query";
  // input.required = true;
  input.placeholder = "Enter a movie name....";

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Get Recommendation";

  inputWrapper.appendChild(input);
  form.append(inputWrapper, button);
  inputContainer.appendChild(form);

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

  return { inputContainer, form };
};

export const generateMarkupSpinner = function (parentEl) {
  const spinner = document.createElement("div");
  spinner.className = "spinner";

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

export const displayTrending = function (dataArr, parentEl) {
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
