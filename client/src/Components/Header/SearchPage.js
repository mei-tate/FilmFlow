import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Movies from '../Movies/movies';
import './SearchPage.css';

const GENRES = [
  { id: '', label: 'All Genres' },
  { id: '28', label: 'Action' },
  { id: '12', label: 'Adventure' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '99', label: 'Documentary' },
  { id: '18', label: 'Drama' },
  { id: '14', label: 'Fantasy' },
  { id: '27', label: 'Horror' },
  { id: '10749', label: 'Romance' },
  { id: '878', label: 'Sci-Fi' },
  { id: '53', label: 'Thriller' },
];

function SearchPage() {
  const { query } = useParams();

  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  const years = Array.from({ length: 2026 - 2000 + 1 }, (_, i) =>
    (2026 - i).toString()
  );

  const clearFilters = () => {
    setGenre('');
    setYear('');
    setSortBy('popularity.desc');
  };

  return (
    <div className="search-page">

      <div className="search-header">
        <h2>
          Search Results for <span>"{query}"</span>
        </h2>
      </div>

      <div className="filter-bar">

        {/* SORT */}
        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Newest</option>
            <option value="release_date.asc">Oldest</option>
          </select>
        </div>

        {/* GENRE */}
        <div className="filter-group">
          <label>Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {GENRES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* YEAR */}
        <div className="filter-group">
          <label>Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Any Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button className="clear-filters" onClick={clearFilters}>
          Reset
        </button>
      </div>

      <Movies
        searching={query}
        triggerSearch={1}
        genre={genre}
        year={year}
        sortBy={sortBy}
      />
    </div>
  );
}

export default SearchPage;