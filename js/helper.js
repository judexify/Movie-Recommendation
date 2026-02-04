import { TIMEOUT_SEC, options } from "./config.js";

// debounce

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} seconds`),
      );
    }, seconds * 1000);
  });
};

export const getJSON = async function (url, type = "") {
  try {
    const fetchJSON = fetch(`${url}${type}`, options);

    const res = await Promise.race([fetchJSON, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    const data = await res.json();

    return data;
  } catch (err) {
    throw err;
  }
};
