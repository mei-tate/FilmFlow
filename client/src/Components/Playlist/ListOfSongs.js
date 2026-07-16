// ListOfSongs.jsx
import React, { useState, useEffect } from "react";
import Wikipedia from "./wikiSongList";
import "./ListOfSongs.css";
import { usePlaylist } from "./PlaylistContext";

function ListOfSongs({ title }) {
  const { addTrack } = usePlaylist();

  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);


  // Convert arrays → structured objects safely
  useEffect(() => {
    if (!songs || songs.length === 0) return;

    // already structured → skip conversion
    if (typeof songs[0] === "object") return;

    const dbSongs = songs.map((song, i) => ({
      song,
      artist: artists?.[i],
    }));

    setSongs(dbSongs);
  }, [songs, artists]);

  return (
    <div className="listOfSongs">
      <Wikipedia
        title={title}
        setSongs={setSongs}
        setArtists={setArtists}
      />

      {songs && songs.length > 0 ? (
        <ul className="movie-song-list">
          {songs.map((song, index) => (
            <li
              key={`${song.song}-${song.artist}-${index}`}
              className="song-item"
            >
              <div>
                <div className="song-title">
                  {song.song}
                </div>

                {song.artist && (
                  <div className="song-artist">
                    {song.artist}
                  </div>
                )}
              </div>

              <button
                className="add-btn"
                onClick={() => addTrack(song)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="noPlaylist">
          Loading movie soundtrack... No songs yet! 
        </p>
      )}
    </div>
  );
}

export default ListOfSongs;