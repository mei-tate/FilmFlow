const API_KEY = process.env.REACT_APP_TMDB;

export const getMovieList = async (
  movie,
  genre,
  year,
  sortBy = "popularity.desc"
) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movie}`
  );

  const data = await response.json();

  let results = data.results || [];

  // Genre filter
  if (genre) {
    results = results.filter(m =>
      m.genre_ids?.includes(Number(genre))
    );
  }

  // Year filter
  if (year) {
    results = results.filter(m =>
      m.release_date?.slice(0, 4) === year
    );
  }

  // Sort by: Most Popular, Highest Rated, Newest, or Oldest
  results = [...results].sort((a, b) => {
    switch (sortBy) {
      case "vote_average.desc":
        return (b.vote_average || 0) - (a.vote_average || 0);

      case "release_date.desc":
        return new Date(b.release_date) - new Date(a.release_date);

      case "release_date.asc":
        return new Date(a.release_date) - new Date(b.release_date);

      case "popularity.desc":
      default:
        return (b.popularity || 0) - (a.popularity || 0);
    }
  });

  return {
    ...data,
    results
  };
};

export const getTopMovies = async (category = "popular") => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}`
  );

  return response.json();
};




