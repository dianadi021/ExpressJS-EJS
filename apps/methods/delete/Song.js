/** @format */

const utils = require('../../functions/utils');
const Song = require('../../models/Songs.model');

const DeleteSongDataByID = async (DataPostman) => {
  try {
    const isAlreadyInDatabase = await Song.findById(DataPostman.params.id);

    if (!isAlreadyInDatabase) {
      return { notification: `Data document tidak ada!` };
    }

    const isDatabaseReady = await Song.findByIdAndRemove(DataPostman.params.id);
    return { notification: `Data document berhasil dihapus!`, document: isDatabaseReady };
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

module.exports = {
  DeleteSongDataByID,
};
