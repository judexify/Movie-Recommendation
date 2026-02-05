import { TIMEOUT_SEC, options } from "./config.js";
import { API_URL } from "./config.js";

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

export const getJSON = async function (url, type = "", page = 1) {
  try {
    const fullUrl = `${url}${type}`;
    const separator = fullUrl.includes("?") ? "&" : "?";
    const fetchJSON = fetch(`${fullUrl}${separator}page=${page}`, options);

    const res = await Promise.race([fetchJSON, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    const data = await res.json();

    return data;
  } catch (err) {
    throw err;
  }
};

export const getWatchProviders = async function (mediaType, id) {
  try {
    const fetchJSON = fetch(
      `${API_URL}${mediaType}/${id}/watch/providers`,
      options,
    );

    const res = await Promise.race([fetchJSON, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch watch providers:", err);
    return null;
  }
};
