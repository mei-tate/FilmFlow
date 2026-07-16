import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { MdBookmark } from "react-icons/md";
import "./bookmarks.css";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/bookmarks"
      );

      const data = await response.json();
      setBookmarks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const removeBookmark = async (id) => {
    try {
      await fetch(
        `http://localhost:4000/api/bookmarks/${id}`,
        { method: "DELETE" }
      );

      setBookmarks((prev) =>
        prev.filter((movie) => movie._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bookmarks-page">
      <h1 className="bookmarks-title">
        My Bookmarked Movies
      </h1>

      {bookmarks.length === 0 ? (
        <p className="empty-state">
          No Movies Bookmarked
        </p>
      ) : (
        <div className="movie-grid">
          {bookmarks.map((movie) => (
            <div
              key={movie._id}
              className="movie-card"
            >
              {/* Bookmark icon */}
              <div className="bookmark-icon">
                <MdBookmark
                  size={26}
                  onClick={() =>
                    removeBookmark(movie._id)
                  }
                />
              </div>

              <img
                src={`http://image.tmdb.org/t/p/w200${movie.posterPath}`}
                alt={movie.title}
              />

              <h3>{movie.title}</h3>

              <button
                className="view-btn"
                onClick={() =>
                  navigate(`/${movie.moviePath}`)
                }
              >
                View Playlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookmarks;