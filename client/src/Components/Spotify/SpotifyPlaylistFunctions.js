export async function createPlaylist(movieTitle, token) {
  if (!token) {
    throw new Error("Missing Spotify token");
  }
  const url =
    "https://api.spotify.com/v1/me/playlists";

  const bodyOption = {
    name: `${movieTitle}`,
    public: true,
    description:
      "Created by Movie Playlist Generator"
  };

  const response = await fetch(url,{
    method:"POST",
    headers:{
      Authorization:`Bearer ${token}`,
      "Content-Type":"application/json"
    },
    body: JSON.stringify(bodyOption)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    throw new Error(
      `Create playlist failed: ${
        data.error?.message
      }`
    );
  }

  return data;
}

export async function searchSongs(songs, token) {
  if (!songs || !token) return [];

  const result = [];

  for (const song of songs) {
    try {
      let url = '';

      // Right now there is an issue with searching involving more than 1 artist name, so search with the artist is disabled right now.


      // if (song.artist) {
      //   url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      //     `${song.song} artist:${song.artist}`
      //   )}&type=track&limit=1`;
      // } else {
        url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          song.song
        )}&type=track&limit=1`;
      // }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) continue;

      const res = await response.json();

      const track = res?.tracks?.items?.[0];

      if (track?.id) {
        result.push(track.id);
      }

    } catch (err) {
      console.error("Search error:", err);
    }
  }

  return result;
}

export async function addSongs(
  songIds,
  playlistId,
  token
) {
  console.log("TOKEN PREFIX:", token?.slice(0, 10));

  const url =
   `https://api.spotify.com/v1/playlists/${playlistId}/items`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json"   // 🔥 ADD THIS
    },
    body: JSON.stringify({
      uris: songIds
        .filter(Boolean)
        .map(id => `spotify:track:${id}`)
    })
  });

    const data = await response.json();

    console.log("ADD SONG RESPONSE:", data);

    if(!response.ok){
      throw new Error(
        `Add songs failed: ${
          data.error?.message
        }`
      );
    }

  return data;
}

