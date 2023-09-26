/** @format */

const mongoose = require('mongoose');

const SongAlbumSchema = mongoose.Schema(
  {
    release_date: {
      type: Date,
      required: true,
    },
    artist: {
      type: String,
    },
    album_name: {
      type: String,
      required: true,
    },
    label_produser: {
      type: String,
      required: true,
    },
    album_genre: [
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
    full_duration: {
      type: Number,
    },
    price_album: {
      type: Number,
    },
    stock_album: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('songalbums', SongAlbumSchema);
