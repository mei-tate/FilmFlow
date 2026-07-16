import { useContext, useEffect, useRef, useState } from "react";
import { SpotifyContext } from "../context/SpotifyContext";

const WebPlayer = () => {
  const { token } = useContext(SpotifyContext);

  const playerRef = useRef(null);
  const initializedRef = useRef(false);

  const [isPaused, setIsPaused] = useState(true);
  const [track, setTrack] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    if (!token || initializedRef.current) return;

    initializedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Player",
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      playerRef.current = player;

      player.addListener("ready", async ({ device_id }) => {
        console.log("Ready:", device_id);
        setDeviceId(device_id);

        // Transfer playback (DO NOT force play here)
        await fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
        });
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;

        setTrack(state.track_window.current_track);
        setIsPaused(state.paused);
      });

      player.connect();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [token]);

  const playPause = async () => {
    const player = playerRef.current;
    if (!player) return;

    const state = player.getCurrentState(); // ✅ FIXED (not async)
    if (!state) return;

    if (state.paused) {
      await player.resume();
    } else {
      await player.pause();
    }
  };

  const next = async () => {
    if (!playerRef.current) return;
    await playerRef.current.nextTrack();
  };

  const prev = async () => {
    if (!playerRef.current) return;
    await playerRef.current.previousTrack();
  };

  return {
    track,
    isPaused,
    deviceId,
    playPause,
    next,
    prev,
  };
};

export default WebPlayer;