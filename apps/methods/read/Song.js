/** @format */

const Song = require('../../models/Songs.model');

const GetSongDatas = async () => {
  try {
    const isDatabaseReady = await Song.find({});

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

const GetSongDataByID = async (SongID) => {
  try {
    const isDatabaseReady = await Song.findById(SongID);

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

const GetSongDataFacet = async (DataPostman) => {
  try {
    const isDatabaseReady = await Song.aggregate([
      {
        $project: {
          _id: 1,
          artist: 1,
          song_title: 1,
          playlist_relation: 1,
          song_genre: 1,
          release_date: 1,
          song_listener: 1,
          song_duration: 1,
        },
      },
      {
        $facet: {
          by_group_name: [
            {
              $match: {
                artist: DataPostman.params.artist,
              },
            },
            { $skip: (parseInt(DataPostman.params.skip) - 1) * parseInt(DataPostman.params.limit) },
            {
              $limit: parseInt(DataPostman.params.limit),
            },
            {
              $sort: {
                artist: 1
              }
            },
            {
              $group: {
                _id: '$artist',
                songs_document: { $push: '$$ROOT' },
              },
            },
          ],
        },
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

const GetAllDataSongsLookup = async () => {
  try {
    const isDatabaseReady = await Song.aggregate([
      {
        $project: {
          _id: 1,
          playlist_name: 1,
          artist_lists: 1,
          label_produsers: 1,
          playlist_relation:1,
        },
      },
      {
        $lookup: {
          from: 'songplaylists',
          localField: 'playlist_relation',
          foreignField: '_id',
          as: 'playlist_of_song',
        },
      },
      {
        $sort: {
          playlist_name: 1,
        },
      },
      // { $skip: (parseInt(DataPostman.params.skip) - 1) * parseInt(DataPostman.params.limit) },
      // {
      //   $limit: parseInt(DataPostman.params.limit),
      // },
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
  GetSongDatas,
  GetSongDataByID,
  GetSongDataFacet,
  GetAllDataSongsLookup
};
