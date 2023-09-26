/** @format */

const mongoose = require('mongoose');

const SongSchema = mongoose.Schema(
  {
    artist: {
      type: String,
      required: true,
    },
    song_title: {
      type: String,
      required: true,
    },
    playlist_relation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'songplaylists',
    },
    song_genre: [
      {
        type: String,
        required: true,
      },
    ],
    release_date: {
      type: String,
      required: true,
    },
    song_listener: {
      type: Number,
      required: true,
    },
    song_duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('songlists', SongSchema);
