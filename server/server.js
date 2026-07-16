const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/user');
const passwordRoutes = require('./routes/genpassword');
const feedbackRoutes = require('./routes/feedback');
const playlistCountRoutes = require("./routes/playlistCount");
const bookmarkRoutes = require("./routes/bookmarks");

const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());

// Enable CORS for all origins
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use("/api/playlist", playlistCountRoutes);
app.use("/api/bookmarks", bookmarkRoutes);


// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  });
