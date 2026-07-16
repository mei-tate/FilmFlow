import React, { useState } from 'react';
import { useSpotifyContext } from './useSpotifyContext';
import {
  createPlaylist,
  searchSongs,
  addSongs
} from './SpotifyPlaylistFunctions';

import {
  ToastContainer,
  toast
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './SpotifyButton.css';

function SpotifyButton({ title, songs }) {

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const { token } = useSpotifyContext();

  const notify = () =>
    toast(`${title} Playlist Imported Successfully`);

  const magicHappening = async () => {
    if (!token) {
      alert(
        "Connect Spotify first"
      );
      return;
    }

    try {
      setLoading(true);

      setStatusMessage("Creating Spotify playlist...");

      const playlist = await createPlaylist(title, token);

      const check = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await check.json();

      console.log("OWNER:", data.owner.id);
      console.log("COLLAB:", data.collaborative);
      console.log("PUBLIC:", data.public);

      if (!playlist?.id) {
        throw new Error("Playlist was not created properly (missing id)");
      }

      // DEBUG: check who owns the playlist + who user is
      const [playlistInfo, me] = await Promise.all([
        fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(res => res.json()),

        fetch(`https://api.spotify.com/v1/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(res => res.json())
      ]);

      console.log("CURRENT USER:", me.id);
      console.log("PLAYLIST OWNER:", playlistInfo?.owner?.id);
      console.log("PLAYLIST INFO:", playlistInfo);

      setStatusMessage("Finding soundtrack songs...");

      const songIds = await searchSongs(songs, token);

      if (!songIds.length) {
        throw new Error("No songs were found on Spotify search");
      }


      console.log("Playlist ID:", playlist.id);

      const cleanUris = songIds
        .filter(Boolean)
        .map(id => `spotify:track:${id}`);
      console.log("CLEAN URIS:", cleanUris);


      setStatusMessage(`Adding ${songIds.length} songs...`);

      // Allow Spotify to fully register playlist
      await new Promise(resolve =>
        setTimeout(resolve, 1500)
      );

      // retry-safe add
      let addResult;

      try {
        addResult = await addSongs(
          songIds,
          playlist.id,
          token
        );
      } catch (err) {
        console.warn(
          "First add attempt failed, retrying..."
        );

        await new Promise(resolve =>
          setTimeout(resolve, 2000)
        );

        addResult = await addSongs(
          songIds,
          playlist.id,
          token
        );
      }

      setStatusMessage("Done!");

      notify();

    } catch (err) {
      console.error("Spotify import failed:", err);

      setStatusMessage('');

      alert(
        err?.message ||
        "Import failed (check console for details)"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <button
        className="spotifyButton"
        onClick={magicHappening}
        disabled={loading}
      >
        {loading
          ? "Importing..."
          : (
            <>
              Import playlist <br />
              on Spotify
            </>
          )
        }
      </button>

      {loading && (
        <p style={{ marginTop: "15px", fontWeight: "600" }}>
          {statusMessage}
        </p>
      )}

      <ToastContainer />

    </div>
  );
}

export default SpotifyButton;