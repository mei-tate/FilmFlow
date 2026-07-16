import React, { useState, useEffect } from 'react';
import iconSearch from './SearchIcon.png';
import './Header.css';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';

function Header({ user, handleClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { query } = useParams();

  const [searching, setSearching] = useState('');

  useEffect(() => {
    if (location.pathname.startsWith('/search') && query) {
      setSearching(query);
    } else {
      setSearching('');
    }
  }, [location.pathname, query]);

  const submittingSearch = (e) => {
    e.preventDefault();

    if (searching.trim() === '') return;

    const newQuery = searching.trim();

    // 🔥 Always navigate (even if already on search page)
    navigate(`/search/${encodeURIComponent(newQuery)}`);
  };

  const goTo = (path) => {
    navigate(path);
    setSearching('');
  };

  return (
    <div className="spotifyHeader">

      <div className="Home">
        <div className="navItem" onClick={() => goTo("/")}>
          Home
        </div>
      </div>

      <div className="centerSection">
        <form onSubmit={submittingSearch} className="searchForm">
          <div className="searchWrapper">
            <img
              src={iconSearch}
              alt="search"
              className="searchIcon"
              onClick={submittingSearch}
            />

            <input
              className="headerSearch"
              type="text"
              placeholder="Search"
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="rightSection">
        <div className="navItem" onClick={() => goTo("/help")}>
          Help
        </div>

        <Link
          className="profile_link"
          to="/profile"
          onClick={() => setSearching('')}
        >
          <i className="ri-account-circle-fill"></i>
          {user ? user.email.split('@')[0].toUpperCase() : 'Profile'}
        </Link>

        {user && (
          <button onClick={handleClick}>
            Log out
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;