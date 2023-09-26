/** @format */

const SongPlaylist = require('../../models/SongPlaylists.model');

const GetPlaylistDatas = async () => {
  try {
    const isDatabaseReady = await SongPlaylist.find({});

    if (isDatabaseReady.length > 0) {
      return { document: isDatabaseReady };
    } else {
      return { notification: `Data document tidak ada!` };
    }
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

const GetPlaylistDataByID = async (SongID) => {
  try {
    const isDatabaseReady = await SongPlaylist.findById(SongID);

    if (isDatabaseReady) {
      return { document: isDatabaseReady };
    } else {
      return { notification: `Data document tidak ada!` };
    }
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

const GetAllPlaylistDataSongs = async (DataPostman) => {
  try {
    const isDatabaseReady = await SongPlaylist.aggregate([
      {
        $project: {
          _id: 1,
          playlist_name: 1,
          artist_lists: 1,
          label_produsers: 1,
          songs: 1,
          full_durations: 1,
        },
      },
      {
        $lookup: {
          from: 'songlists',
          localField: 'songs',
          foreignField: '_id',
          as: 'song_lists',
        },
      },
      {
        $sort: {
          playlist_name: 1,
        },
      },
      { $skip: (parseInt(DataPostman.params.skip) - 1) * parseInt(DataPostman.params.limit) },
      {
        $limit: parseInt(DataPostman.params.limit),
      },
    ]);

    if (isDatabaseReady.length > 0) {
      return { document: isDatabaseReady };
    } else {
      return { notification: `Data document tidak ada!` };
    }
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

module.exports = {
  GetPlaylistDatas,
  GetPlaylistDataByID,
  GetAllPlaylistDataSongs,
};
