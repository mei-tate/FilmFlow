import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListOfSongs from "./ListOfSongs";
import { usePlaylist } from "./PlaylistContext";
import SpotifyButton from "../Spotify/SpotifyButton"
import "./PlaylistPage.css";


function PlaylistPage() {
  const { movieTitle } = useParams();
  const { playlistTracks, removeTrack } = usePlaylist();
  const [playlistName, setPlaylistName] = useState("");
  const [songCount, setSongCount] = useState(0);

  const formattedTitle = movieTitle
    .replace(/-/g, " ")
    .toUpperCase();

  const finalPlaylistTitle =
  playlistName.trim() !== ""
    ? playlistName
    : formattedTitle;


  useEffect(() => {
    const fetchSongCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/playlist/count",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              songs: playlistTracks,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setSongCount(data.songCount);
        }
      } catch (error) {
        console.error(
          "Error counting songs:",
          error
        );
      }
    };

    fetchSongCount();
  }, [playlistTracks]);

  return (
    <div className="playlist-page">

      <h1 className="page-title">{formattedTitle}</h1>

      <div className="split-container">

        {/* LEFT PANEL — MOVIE TRACKS */}
        <section className="panel left-panel">
          <h2 className="panel-title">Movie Tracks</h2>

          <ListOfSongs title={movieTitle} />
        </section>

        {/* RIGHT PANEL — GLOBAL PLAYLIST */}
        <section className="panel right-panel">
          <input
            className="playlist-title-input"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Your Playlist Name (optional)"
          />
          <p className=" playlist-helper-text">If you don't input a playlist name the default will be the movie title of the last added song</p>

          <p className="playlist-song-count">
            {songCount} song
            {songCount !== 1 ? "s" : ""}
          </p>


          {playlistTracks.length === 0 ? (
            <p className="empty">
              Add songs from the left to build your playlist
            </p>
          ) : (
            <ul className="playlist-list">
              {playlistTracks.map((song, i) => (
                <li key={`${song.song}-${song.artist}-${i}`} className="playlist-item">
                  <div>
                    <div className="song-title">{song.song}</div>
                    <div className="song-artist">{song.artist}</div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeTrack(song)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <SpotifyButton
            title={finalPlaylistTitle}
            songs={playlistTracks}
          />
        </section>
          
      </div>
    </div>
  );
}

export default PlaylistPage;