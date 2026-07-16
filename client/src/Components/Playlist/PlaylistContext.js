// PlaylistContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
  const [playlistTracks, setPlaylistTracks] = useState(() => {
    const saved = localStorage.getItem("globalPlaylist");
    return saved ? JSON.parse(saved) : [];
  });

  // persist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("globalPlaylist", JSON.stringify(playlistTracks));
  }, [playlistTracks]);

  function addTrack(track) {
    setPlaylistTracks((prev) => {
      const exists = prev.some(
        (t) => t.song === track.song && t.artist === track.artist
      );
      return exists ? prev : [...prev, track];
    });
  }

  function removeTrack(track) {
    setPlaylistTracks((prev) =>
      prev.filter(
        (t) => !(t.song === track.song && t.artist === track.artist)
      )
    );
  }

  function clearPlaylist() {
    setPlaylistTracks([]);
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlistTracks,
        addTrack,
        removeTrack,
        clearPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  return useContext(PlaylistContext);
}