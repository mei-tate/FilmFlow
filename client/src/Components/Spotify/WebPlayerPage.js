import React from "react";
import WebPlayer from "./WebPlayer";
import {
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious
} from "react-icons/md";
import "./WebPlayerPage.css";

const WebPlayerPage = () => {
  const { track, isPaused, playPause, next, prev } =
    WebPlayer();

  return (
    <div className="webplayer-page">
      <div className="webplayer-container">

        <div className="now-playing">
          {track ? (
            <>
              <img
                className="album-art"
                src={track.album.images[0]?.url}
                alt="album"
              />

              <div className="track-info">
                <h3>{track.name}</h3>
                <p>
                  {track.artists
                    .map((a) => a.name)
                    .join(", ")}
                </p>
              </div>
            </>
          ) : (
            <div className="no-track">
              No track playing
            </div>
          )}
        </div>

        <div className="controls">
          <button className="control-btn" onClick={prev}>
            <MdSkipPrevious />
          </button>

          <button
            className="control-btn play-btn"
            onClick={playPause}
          >
            {isPaused ? <MdPlayArrow /> : <MdPause />}
          </button>

          <button className="control-btn" onClick={next}>
            <MdSkipNext />
          </button>
        </div>

      </div>
    </div>
  );
};

export default WebPlayerPage;