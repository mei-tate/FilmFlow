import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./Components/context/AuthContext";
import { PlaylistProvider } from "./Components/Playlist/PlaylistContext";
import { SpotifyContextProvider } from "./Components/context/SpotifyContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <PlaylistProvider>
          <SpotifyContextProvider>
            <App />
          </SpotifyContextProvider>
        </PlaylistProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorker.unregister();