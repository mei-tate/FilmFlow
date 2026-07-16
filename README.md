# FilmFlow: Movie Playlist Generator

> Automatically generate Spotify playlists from your favorite movies soundtracks.

---

## Features

*  User authentication (Email & Password)
*  Spotify account integration
*  Movie search via The Movie Database (TMDB) API
*  Soundtrack discovery using Wikipedia API
*  One-click playlist creation on Spotify

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mei-tate/FilmFlow.git
cd FilmFlow
```

---

### 2. Server Setup

```bash
cd server
npm install
```

#### Create a `.env` file in `/server`

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
SECRET=secret_key_string_of_choice
```

##### How to Create `MONGO_URI`

1. Go to MongoDB and create an account.
2. Open MongoDB Atlas.
3. Create a **new cluster** (free tier is fine).
4. Go to **Database Access**:

   * Create a username and password.
5. Go to **Network Access**:

   * Add IP address `0.0.0.0/0` (allows access from anywhere for development).
6. Click **Connect → Drivers**.
7. Copy your connection string. It looks like:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

8. Replace:

   * `<username>` with your DB username
   * `<password>` with your DB password


#### SECRET Key

* Use any random string (at least 40 characters).
* Example:

```bash
openssl rand -base64 40
```


#### Run Server

```bash
npm start
```

---

### 3. Client Setup

Open a new terminal:

```bash
cd client
npm install
```

#### Create a `.env` file in `/client`

```env
REACT_APP_TMDB=your_tmdb_api_key
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
REACT_APP_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/
```

### API Setup Guide

#### TMDB API Key (Movie Data)

1. Go to The Movie Database (TMDB)
2. Create an account and log in.
3. Navigate to **Settings → API**.
4. Request an API key (choose "Developer").
5. Copy your **API Key (v3 auth)**.
6. Paste it into:

```env
REACT_APP_TMDB=your_tmdb_api_key
```

#### Spotify API (Client ID + Redirect URI)

1. Go to Spotify for Developers
2. Log in with your Spotify account (it has to be a Premium account to access the WebAPI).
3. Click **"Create App"**:
   * App Name: `Movie Playlist Generator`
   * Description: anything
   * Select "Web API" for the question asking which APIs are you planning to use.
   * Set the Redirect URIs to: http://127.0.0.1:3000/ (**important it has to exactly match what's being called in /client**)
4. After creation, you’ll see:

   * **Client ID** → copy this

```env
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
```

##### Common Spotify Issues

* Redirect URI mismatch → causes Spotify connection failure


### Run Client

```bash
npm start
```

---

### 4. Access the App

```
http://localhost:3000/
```

---

## 🛠️ Tech Stack
This project uses: <br><br>
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NPM](https://img.shields.io/badge/npm-%2320232a.svg?style=for-the-badge&logo=npm&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/mongodb-%3FA037.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-%23000000.svg?style=for-the-badge&logo=express&logoColor=white)
![Spotify API](https://img.shields.io/badge/Spotify%20API-1DB954.svg?style=for-the-badge&logo=spotify&logoColor=white)
![TMDB API](https://img.shields.io/badge/TMDB%20API-01B4E4.svg?style=for-the-badge&logo=themoviedatabase&logoColor=white)
![Wikipedia API](https://img.shields.io/badge/Wikipedia%20API-000000.svg?style=for-the-badge&logo=wikipedia&logoColor=white)

---

## Author

* Mei Tate

---


