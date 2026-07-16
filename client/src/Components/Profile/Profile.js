import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useSpotifyContext } from '../Spotify/useSpotifyContext';

import './Profile.css';

function Profile({ user }) {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, dispatch: spotifyDispatch } = useSpotifyContext();

  const exchangeStarted = useRef(false);
  const [spotifyProfile, setSpotifyProfile] = useState(null);

  const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

  // -----------------------------
  // PKCE helpers
  // -----------------------------
  const generateCodeVerifier = () => {
    const array = new Uint8Array(64);
    window.crypto.getRandomValues(array);

    return Array.from(array)
      .map(x =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"[x % 66]
      )
      .join("");
  };

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    return crypto.subtle.digest("SHA-256", encoder.encode(plain));
  };

  const base64urlencode = (buffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  // -----------------------------
  // CONNECT SPOTIFY
  // -----------------------------
  const connectSpotify = async () => {

    const codeVerifier = generateCodeVerifier();
    console.log("NEW CODE VERIFIER:", codeVerifier);

    localStorage.setItem("code_verifier", codeVerifier);

    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64urlencode(hashed);

    const scope =
      "streaming " +
      "user-read-email " +
      "user-read-private " +
      "playlist-modify-private " +
      "playlist-modify-public " +
      "playlist-read-private " +
      "playlist-read-collaborative " +
      "user-read-playback-state " +
      "user-modify-playback-state " +
      "user-read-currently-playing";

    const authUrl = new URL("https://accounts.spotify.com/authorize");

    authUrl.search = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge
    }).toString();

    window.location.href = authUrl.toString();
  };

  // -----------------------------
  // LOGOUT SPOTIFY
  // -----------------------------
  const logoutSpotify = () => {
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("code_verifier");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_expires_at");

    exchangeStarted.current = false;

    spotifyDispatch({ type: 'LOGOUT_SPOTIFY' });
    setSpotifyProfile(null);
  };

  // -----------------------------
  // TOKEN EXCHANGE
  // -----------------------------
  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");

    if (!code) return;
    if (exchangeStarted.current) return;

    exchangeStarted.current = true;

    window.history.replaceState({}, document.title, "/profile");

    const getToken = async () => {
      try {
        const codeVerifier = localStorage.getItem("code_verifier");

        console.log("LOADED VERIFIER:", codeVerifier);
        console.log("CODE:", code);

        if (!codeVerifier) {
          console.error("Missing code verifier (PKCE broken)");
          return;
        }

        const response = await fetch(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              client_id: clientId,
              grant_type: "authorization_code",
              code,
              redirect_uri: redirectUri,
              code_verifier: codeVerifier
            })
          }
        );

        const data = await response.json();

        console.log("Spotify token response:", data);
        console.log("SPOTIFY SCOPES:", data.scope);

        if (!response.ok) {
          console.error("Token exchange failed:", data);
          exchangeStarted.current = false;
          return;
        }

        localStorage.setItem("spotify_token", data.access_token);

        if (data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
        }

        localStorage.setItem(
          "spotify_expires_at",
          Date.now() + data.expires_in * 1000
        );

        spotifyDispatch({
          type: 'SET_TOKEN',
          payload: data.access_token
        });

        localStorage.removeItem("code_verifier");
      } catch (err) {
        console.error("PKCE exchange error:", err);
        exchangeStarted.current = false;
      }
    };

    getToken();
  }, [location.search, clientId, redirectUri, spotifyDispatch]);

  // -----------------------------
  // AUTO REFRESH
  // -----------------------------
  const refreshSpotifyToken = async () => {
    try {
      const refreshToken = localStorage.getItem("spotify_refresh_token");
      if (!refreshToken) return null;

      const res = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: clientId,
            grant_type: "refresh_token",
            refresh_token: refreshToken
          })
        }
      );

      const data = await res.json();

      console.log("REFRESH RESPONSE:", data);

      console.log("REFRESH SCOPES:", data.scope);

      if (!data.access_token) {
        console.error("Refresh failed");
        logoutSpotify();
        return null;
      }

      localStorage.setItem("spotify_token", data.access_token);
      
      localStorage.setItem("spotify_expires_at", Date.now() + data.expires_in * 1000);

      spotifyDispatch({
        type: 'SET_TOKEN',
        payload: data.access_token
      });

      return data.access_token;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // -----------------------------
  // USER LOGOUT CONFIRMATION
  // -----------------------------
  const confirmLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (confirmed) {
      handleLogout();
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  if (!user) {
    return (
      <div className="profile-container auth-prompt">
        <h2>Welcome</h2>
        <p>Please LogIn or SignUp</p>
        <div className="auth-buttons">
          <Link
            to="/profile/login"
            className="spotify-btn login-btn"
          >
            Log In
          </Link>

          <Link
            to="/profile/signup"
            className="spotify-btn signup-btn"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  function handleLogout() {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    navigate('/profile/login');
  }

  const formatName = (email) => {
    if (!email) return '';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Open a seperate window when using Spotify's webplayer.
  const openPlayerWindow = () => {
    window.open(
      "/player",
      "SpotifyWebPlayer",
      "width=400,height=600,left=100,top=100"
    );
  };  

  return (
    <div className="profile-container">
      <h2 className="profile-title">
        {formatName(user?.email)}'s Profile
      </h2>

      <Link className="myPlaylists" to="/profile/playlists">
        My Spotify Playlists
      </Link>

      <Link className="myPlaylists" to="/profile/bookmarks">
        My Bookmarks
      </Link>

      <button
        className="webPlayerbtn"
        onClick={openPlayerWindow}
      >
        Open Web Player
      </button>

      <div className="spotify-section">
        {!token ? (
          <button
            className="spotify-btn-base spotify-btn-green"
            onClick={connectSpotify}
          >
            Connect Spotify
          </button>
        ) : (
          <>
            <p className="spotify-connected-text">
              Connected to Spotify
            </p>

            <button
              className="spotify-btn-base spotify-btn-dark"
              onClick={logoutSpotify}
            >
              Logout Spotify
            </button>
          </>
        )}
      </div>

      <button
        className="logout"
        onClick={confirmLogout}
      >
        Logout
      </button>

      <Link className="resetpwd" to="/resetpassword">
        Reset Password
      </Link>

    </div>
  );
}

export default Profile;