import { getJSON } from "./helper.js";
import { API_URL } from "./config.js";

export const state = {
  query: "",
  carousel: { scrollPosition: 0, scrollSpeed: 1, isHovered: false },
  currentUpcoming: {
    mediaType: "movie",
    endpoint: "upcoming",
  },
  currentPopular: {
    category: "popular",
  },
  currentToprated: {
    mediaType: "movie",
    category: "top_rated",
  },
};

export const setQuery = function (query) {
  state.query = query;
};

export const fetchTrendingMovies = async function (pages = 1, region = "") {
  try {
    const data = await getJSON(API_URL, "trending/all/day", pages, region);

    return data.results;
  } catch (err) {
    console.error("Failed to fetch trending movies:", err);
    throw err;
  }
};

export const fetchUpcomingMedia = async function (
  mediaType = "movie",
  endpoint = "upcoming",
  page = 1,
  region = "",
) {
  try {
    const regionParam = mediaType === "movie" ? region : "";

    const data = await getJSON(
      API_URL,
      `${mediaType}/${endpoint}`,
      page,
      regionParam,
    );

    return data.results;
  } catch (err) {
    console.error("Failed to fetch upcoming media:", err);
    throw err;
  }
};

export const fetchMediaDetails = async function (mediaType, mediaId) {
  try {
    const data = await getJSON(
      API_URL,
      `${mediaType}/${mediaId}?append_to_response=credits,videos,watch/providers`,
    );

    return data;
  } catch (err) {
    console.error("Failed to fetch media details:", err);
    throw err;
  }
};

export const fetchMoviesByCountry = async function (
  countryCode,
  sortBy = "popularity.desc",
  page = 1,
) {
  try {
    const data = await getJSON(
      API_URL,
      `discover/movie?with_origin_country=${countryCode}&sort_by=${sortBy}`,
      page,
    );

    return data.results;
  } catch (err) {
    console.error("Failed to fetch movies by country:", err);
    throw err;
  }
};

// this will fetch popular and top rated
export const fetchPopularandTopRatedMedia = async function (
  mediaType = "movie",
  category = "popular",
  page = 1,
  region = "",
) {
  // https://api.themoviedb.org/3/movie/popular
  //https://api.themoviedb.org/3/tv/popular
  // https://api.themoviedb.org/3/movie/top_rated
  // https://api.themoviedb.org/3/tv/top_rated

  const regionParam = mediaType === "movie" ? region : "";

  try {
    const data = await getJSON(
      API_URL,
      `/${mediaType}/${category}`,
      page,
      regionParam,
    );

    return data.results;
  } catch (err) {
    console.error("Failed to fetch media details", err);
    throw err;
  }
};

export const fetchPopularMedia = async function (
  mediaType = "movie",
  page = 1,
  region = "",
) {
  return fetchPopularandTopRatedMedia(mediaType, "popular", page, region);
};

export const fetchTopRatedMedia = async function (
  mediaType = "movie",
  page = 1,
  region = "",
) {
  return fetchPopularandTopRatedMedia(mediaType, "top_rated", page, region);
};

export const searchMedia = async function (query) {
  try {
    const data = await getJSON(
      API_URL,
      `search/multi?query=${encodeURIComponent(query)}`,
    );

    return data.results;
  } catch (err) {
    console.error("Failed to search media:", err);
    throw err;
  }
};
