import { getJSON } from "./helper.js";
import { API_URL } from "./config.js";

export const state = {
  query: "",
  carousel: { scrollPosition: 0, scrollSpeed: 1, isHovered: false },
};

export const setQuery = function (query) {
  state.query = query;
};

export const fetchTrendingMovies = async function () {
  try {
    const data = await getJSON(API_URL, "trending/all/day");

    console.log(data.results);

    return data.results;
  } catch (err) {
    console.error("Failed to fetch trending movies:", err);
    throw err;
  }
};
