/** @format */

const utils = require('../../functions/utils');
const Song = require('../../models/Songs.model');
const SongPlaylist = require('../../models/SongPlaylists.model');

const UpdateSongDataByID = async (DataPostman) => {
  try {
    const isAlreadyInDatabase = await Song.findById(DataPostman.params.id);

    if (!isAlreadyInDatabase) {
      return { notification: `Data document tidak ada!` };
    }

    if (
      DataPostman.body.artist == undefined ||
      DataPostman.body.song_title == undefined ||
      DataPostman.body.song_genre == undefined ||
      DataPostman.body.song_listener == undefined ||
      DataPostman.body.song_duration == undefined
    ) {
      return {
        notification: `Format salah atau inputan kosong!`,
        format: {
          artist: 'String',
          song_title: 'String',
          playlist_relation: 'String',
          song_genre: 'Array',
          release_date: 'Date',
          song_listener: 'Number',
          song_duration: 'Number',
        },
      };
    }

    const isDupplicateDocument = await Song.find({
      artist: DataPostman.body.artist,
      song_title: DataPostman.body.song_title,
    });

    if (isDupplicateDocument.length > 0) {
      return { notification: `Data document sudah tersedia didalam database`, document: isDupplicateDocument };
    }

    const NewSong = {
      artist: DataPostman.body.artist,
      song_title: DataPostman.body.song_title,
      song_genre: DataPostman.body.song_genre,
      playlist_relation: DataPostman.body.playlist_relation,
      release_date: utils.GetCurrentIDNDate(),
      song_listener: DataPostman.body.song_listener,
      song_duration: DataPostman.body.song_duration,
    };

    const isDatabaseReady = await Song.findByIdAndUpdate(DataPostman.params.id, NewSong);
    return { notification: `Data document berhasil diupdate!`, document: isDatabaseReady };
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

// BELUM SELESAI START
const UpdateSongDatasRelation = async () => {
  try {
    const isSongInDatabase = await Song.find({});

    const tempArrayOfIDSongs = new Set();
    for (const listsongs of isSongInDatabase) {
      tempArrayOfIDSongs.add(listsongs._id);
    }

    const ArrayOfIDSongs = [...tempArrayOfIDSongs];
    const ArrayObjectReadyToUpdate = new Array();
    for (const listID of ArrayOfIDSongs) {
      const isSongInPlaylistDatabase = await SongPlaylist.aggregate([
        {
          $lookup: {
            from: 'songlists',
            localField: 'songs',
            foreignField: '_id',
            as: 'lookup_songs',
          },
        },
        {
          $match: {
            lookup_songs: {
              $elemMatch: {
                _id: listID,
              },
            },
          },
        },
      ]);

      let NewSong = {};
      for (const listPlaylistID of isSongInPlaylistDatabase) {
        if (listPlaylistID._id == listID) {
          NewSong.playlist_relation = listPlaylistID._id;
        }
        for (const listsongs of isSongInDatabase) {
          if (listID == listsongs._id) {
            NewSong = {
              artist: listID.artist,
              song_title: listID.song_title,
              song_genre: listID.song_genre,
              release_date: listID.release_date,
              song_listener: listID.song_listener,
              song_duration: listID.song_duration,
            };
          }
        }
      }
      ArrayObjectReadyToUpdate.push(NewSong);
    }

    const isDatabaseReady = await Song.updateMany(ArrayObjectReadyToUpdate);
    return { notification: `Data document berhasil diupdate!`, document: isDatabaseReady };
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};
// BELUM SELESAI END

module.exports = {
  UpdateSongDataByID,
  UpdateSongDatasRelation,
};
