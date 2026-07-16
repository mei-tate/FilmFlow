import React from "react";
import Movies from "../Movies/movies";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      <section className="hero">
        <div className="heroOverlay">
          <h1>FilmFlow</h1>
          <p>
            Convert the soundtracks of popular movies into Spotify playlists
          </p>
        </div>
      </section>

      <section className="featuredSection">
        <h2>TMDB's Top 20 Popular Movies</h2>

        <Movies
          category="popular"
          triggerSearch={1}
        />
      </section>
    </div>
  );
}

export default Home;