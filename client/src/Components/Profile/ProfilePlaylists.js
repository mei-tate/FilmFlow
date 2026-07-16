import { useContext, useEffect, useState } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import "./ProfilePlaylists.css";

function ProfilePlaylists() {
  const { token } = useContext(SpotifyContext);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tracksLoading, setTracksLoading] =
    useState(false);

  // Fetch playlists
    useEffect(() => {
    const fetchPlaylists = async () => {
        console.log("TOKEN:", token);

        if (!token) {
        console.log("No token found");
        return;
        }

        try {
        const response = await fetch(
            "https://api.spotify.com/v1/me/playlists",
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        console.log("STATUS:", response.status);

        const data = await response.json();

        console.log("PLAYLIST RESPONSE:", data);

        if (!response.ok) {
            console.error("Spotify error:", data);
            return;
        }

        setPlaylists(data.items || []);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    fetchPlaylists();
    }, [token]);

  // Fetch tracks items in playlist
const openPlaylist = async (playlist) => {
  setSelectedPlaylist(playlist); // ✅ FIXED
  setTracksLoading(true);

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/items`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    // -----------------------------
    // APPLY YOUR PARSING LOGIC HERE
    // -----------------------------
    const tracks = [];

    for (const item of data.items ?? []) {
      const t = item?.item ?? item?.track;

      if (!t || !t.id || !t.uri) continue;
      if (t.type === "episode") continue;

      tracks.push({
        id: t.id,
        name: t.name,
        artists: t.artists?.map((a) => a.name) ?? [],
        albumImage:
          t.album?.images?.[1]?.url ||
          t.album?.images?.[2]?.url ||
          t.album?.images?.[0]?.url ||
          null,
        uri: t.uri,
      });
    }

    setItems(tracks);
  } catch (err) {
    console.error("Error fetching track items:", err);
  } finally {
    setTracksLoading(false);
  }
};

  if (!token) {
    return (
      <div className="profile-unConnected">
        Connect Spotify First
      </div>
    );
  }

  return (
    <div className="profile-playlists">
      <div className="playlist-sidebar">
        <h2>Your Playlists</h2>

        {loading ? (
          <p>Loading playlists...</p>
        ) : (
          playlists.map((playlist) => (
            <button
              key={playlist.id}
              className="playlist-card"
              onClick={() =>
                openPlaylist(playlist)
              }
            >
              <img className="playlist-image"
                src={
                  playlist.images?.[0]?.url
                }
                alt={playlist.name}
              />

              <div>
                <h3>{playlist.name}</h3>
                <p>
                  {playlist?.items?.total ?? 0} songs
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="playlist-content">
        {selectedPlaylist ? (
          <>
            <h2>
              {selectedPlaylist.name}
            </h2>

            {tracksLoading ? (
              <p>Loading songs...</p>
            ) : (
              <div className="track-list">
                {items.map((track) => (
                <div key={track.id} className="track-row">
                    <img className="songImage"
                    src={track.albumImage}
                    alt={track.name}
                    />

                    <div>
                    <h4>{track.name}</h4>

                    <p>
                        {track.artists.join(", ")}
                    </p>
                    </div>
                </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p>
            Select a playlist to view
            songs.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfilePlaylists;