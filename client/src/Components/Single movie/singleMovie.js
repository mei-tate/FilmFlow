import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";

import './singleMovie.css';

function SingleMovie({
  title,
  posterPath,
  date
}) {
  const navigate = useNavigate();

  // bookmark state
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  // Convert movie title into URL-safe slug
  const moviePath = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const openPlaylist = () => {
    navigate(`/${moviePath}`);
  };

  // Bookmark Handler
  const bookmarkMovie = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/bookmarks",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            posterPath,
            date,
            moviePath,
          }),
        }
      );

      const data =
        await response.json();

      // toggle icon
      setBookmarked(true);

      console.log(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        // REMOVE Bookmark
        await fetch(
          `http://localhost:4000/api/bookmarks/${bookmarkId}`,
          {
            method: "DELETE",
          }
        );

        setBookmarked(false);
        setBookmarkId(null);
      } else {
        // ADD
        const response = await fetch(
          "http://localhost:4000/api/bookmarks",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              posterPath,
              date,
              moviePath,
            }),
          }
        );

        const data = await response.json();

        setBookmarked(true);
        setBookmarkId(data._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/bookmarks/check/${moviePath}`
        );

        const data = await res.json();

        setBookmarked(data.bookmarked);

        if (data.bookmark) {
          setBookmarkId(data.bookmark._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkBookmark();
  }, [moviePath]);

  return (
    <div className="singleMovie">
      <div
        style={{ marginBottom: "30px" }}
      >
        <span>
          <p
            style={{
              width: "200px",
              height: "50px",
              marginBottom: "0px",
              fontWeight: "bold",
              fontStyle:
                "Courier New",
            }}
          >
            {title}
          </p>
        </span>

        <div className="movie-image-container">
          <img
            style={{
              width: "200px",
              height: "300px",
            }}
            alt="movie poster"
            src={
              posterPath
                ? `http://image.tmdb.org/t/p/w200${posterPath}`
                : `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD`
            }
          />

          {/* Bookmark icon */}
          <button
            className="bookmark-icon-btn"
            onClick={toggleBookmark}
          >
            {bookmarked ? (
              <MdBookmark size={32} />
            ) : (
              <MdBookmarkBorder size={32} />
            )}
          </button>
        </div>

        <button
          className="playlistButton"
          onClick={openPlaylist}
        >
          View Playlist
        </button>
      </div>
    </div>
  );
}

export default SingleMovie;