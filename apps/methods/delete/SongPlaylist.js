/** @format */

const utils = require('../../functions/utils');
const SongPlaylist = require('../../models/SongPlaylists.model');

const DeletePlaylistDataByID = async (DataPostman) => {
  try {
    const isAlreadyInDatabase = await SongPlaylist.findById(DataPostman.params.id);

    if (!isAlreadyInDatabase) {
      return { notification: `Data document tidak ada!` };
    }

    const isDatabaseReady = await SongPlaylist.findByIdAndRemove(DataPostman.params.id);
    return { notification: `Data document berhasil dihapus!`, document: isDatabaseReady };
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

module.exports = {
  DeletePlaylistDataByID,
};
