/** @format */

const utils = require('../../functions/utils');
const SongPlaylist = require('../../models/SongPlaylists.model');

const UpdatePlaylistDataByID = async (DataPostman) => {
  try {
    const isAlreadyInDatabase = await SongPlaylist.findById(DataPostman.params.id);

    if (!isAlreadyInDatabase) {
      return { notification: `Data document tidak ada!` };
    }

    if (DataPostman.body.playlist_name == undefined) {
      return {
        notification: `Format salah atau inputan kosong!`,
        format: {
          playlist_name: 'String',
          songs: ["Object._id('String')"],
        },
      };
    }

    const isDupplicateDocument = await SongPlaylist.aggregate([
      {
        $match: {
          playlist_name: DataPostman.body.playlist_name,
        },
      },
    ]);

    if (isDupplicateDocument.length > 0) {
      return { notification: `Data document sudah tersedia didalam database`, document: isDupplicateDocument };
    }

    const tempListSong = new Set();
    for (const listsongs of DataPostman.body.songs) {
      tempListSong.add(listsongs);
    }

    const FixSongList = [...tempListSong];
    const NewPlaylist = {
      playlist_name: DataPostman.body.playlist_name,
      songs: FixSongList,
    };

    const isDatabaseReady = await SongPlaylist.findByIdAndUpdate(DataPostman.params.id, NewPlaylist);
    return { notification: `Data document berhasil diupdate!`, document: isDatabaseReady };
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

module.exports = {
  UpdatePlaylistDataByID,
};
