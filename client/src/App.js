import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Profile from './Components/Profile/Profile';
import Login from './Components/Profile/Login';
import Signup from './Components/Profile/Signup';
import Header from './Components/Header/Header';
import SearchPage from './Components/Header/SearchPage';
import ResetPassword from './Components/Profile/Resetpassword';
import Home from './Components/Home/Home';
import Help from './Components/Help/Help';
import PlaylistPage from './Components/Playlist/PlaylistPage';
import ProfilePlaylists from './Components/Profile/ProfilePlaylists';
import Bookmarks from './Components/bookmarks/bookmarks';
import WebPlayerPage from './Components/Spotify/WebPlayerPage';

import { useAuthContext } from './Components/hooks/useAuthContext';

import './App.css';

function App() {
  const location = useLocation();
  const hideHeader = location.pathname === "/player";
  const key = process.env.REACT_APP_APIKEY;
  console.log(key + " this");

  const { user } = useAuthContext();

  if (user) {
    console.log(user.email + " => from the app" + user.id);
  }

  return (
    <div className="App">
       {!hideHeader && <Header />}

      <div className="pages">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile user={ user } />} />
          <Route path="/profile/login" element={<Login />} />
          <Route path="/profile/signup" element={<Signup />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/profile/playlists"
          element={<ProfilePlaylists />} />
          <Route path="/:movieTitle" element={<PlaylistPage />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/profile/bookmarks"
          element={<Bookmarks />}/>
          <Route path="/player" element={<WebPlayerPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;