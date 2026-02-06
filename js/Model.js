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

export const fetchTrendingMovies = async function (pages = 1) {
  try {
    const data = await getJSON(API_URL, "trending/all/day", pages);

    console.log(data);

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
) {
  try {
    const data = await getJSON(API_URL, `${mediaType}/${endpoint}`, page);

    console.log(data);

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

    console.log(data);

    return data;
  } catch (err) {
    console.error("Failed to fetch media details:", err);
    throw err;
  }
};

// this will fetch popular and top rated
export const fetchPopularandTopRatedMedia = async function (
  mediaType = "movie",
  category = "popular",
  page = 1,
) {
  // https://api.themoviedb.org/3/movie/popular
  //https://api.themoviedb.org/3/tv/popular
  // https://api.themoviedb.org/3/movie/top_rated
  // https://api.themoviedb.org/3/tv/top_rated
  try {
    const data = await getJSON(API_URL, `/${mediaType}/${category}`, page);

    console.log(data);

    return data.results;
  } catch (err) {
    console.error("Failed to fetch media details", err);
    throw err;
  }
};

export const fetchPopularMedia = async function (
  mediaType = "movie",
  page = 1,
) {
  return fetchPopularandTopRatedMedia(mediaType, "popular", page);
};

export const fetchTopRatedMedia = async function (
  mediaType = "movie",
  page = 1,
) {
  return fetchPopularandTopRatedMedia(mediaType, "top_rated", page);
};
