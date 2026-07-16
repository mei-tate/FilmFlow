import React, { useState, useEffect } from 'react';
import SingleMovie from '../Single movie/singleMovie';
import { getMovieList, getTopMovies } from '../../TMDBapi';
import './movies.css';

function Movies({ searching, triggerSearch, category, genre, year, sortBy }) {
  const [movies, setMovies] = useState();

  useEffect(() => {
    const fetchMovies = async () => {
      let data;

      if (category) {
        // Fetch top/popular movies
        data = await getTopMovies(category);
      } else {
        // Existing search behavior
        data = await getMovieList(
          searching,
          genre,
          year,
          sortBy
        );
      }

      setMovies(data);
    };

    fetchMovies();
  }, [triggerSearch, searching, category, genre, year, sortBy]);

  return (
    <div>
      <div className="movies">
        {movies &&
          movies.results.slice(0, 20).map(movie => (
            <SingleMovie
              key={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              date={movie.release_date}
            />
          ))}
      </div>

      <p className="no-movies">
        No more movies, if your movie is not shown try another search
      </p>
    </div>
  );
}

export default Movies;