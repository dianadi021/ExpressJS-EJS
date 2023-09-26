/** @format */

const mongoose = require('mongoose');

const SongPlaylistSchema = mongoose.Schema(
  {
    playlist_name: {
      type: String,
      required: true,
    },
    artist_lists: [
      {
        type: String,
      },
    ],
    label_produsers: [
      {
        type: String,
      },
    ],
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'songlists',
      },
    ],
    full_durations: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('songplaylists', SongPlaylistSchema);
