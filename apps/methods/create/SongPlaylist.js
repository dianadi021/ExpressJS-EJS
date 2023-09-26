/** @format */

const utils = require('../../functions/utils');
const SongPlaylist = require('../../models/SongPlaylists.model');

const CreatePlaylistData = async (DataPostman) => {
  try {
    if (DataPostman.body.playlist_name == undefined) {
      return {
        notification: `Format salah atau inputan kosong!`,
        format: {
          playlist_name: 'String',
          songs: ["Object._id('String')"],
        },
      };
    }

    // BELUM SIAP
    const isDatabaseReady = await SongPlaylist.aggregate([
      {
        $match: {
          playlist_name: DataPostman.body.playlist_name,
        },
      },
    ]);

    if (isDatabaseReady.length > 0) {
      return { notification: `Data document sudah tersedia didalam database`, document: isDatabaseReady };
    }

    const tempListSong = new Set();
    for (const listsongs of DataPostman.body.songs) {
      tempListSong.add(listsongs);
    }

    const FixSongList = [...tempListSong];
    const NewPlaylist = SongPlaylist({
      playlist_name: DataPostman.body.playlist_name,
      songs: FixSongList,
    });

    return await NewPlaylist.save()
      .then((result) => {
        console.log(`Function Success Insert Data ${result}`);
        return { notification: `Success insert data!`, document_success_insert: result };
      })
      .catch((err) => {
        console.log(`Function Catch: Gagal insert document ${err}`);
        return { catch: `Function Catch: Gagal insert document ${err}` };
      });
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

const CreatePlaylistDatas = async (DataPostman) => {
  try {
    if (DataPostman.body.length < 0) {
      return {
        notification: `Format salah atau inputan kosong!`,
        format: {
          playlist_name: 'String',
          songs: ["Object._id('String')"],
        },
      };
    }

    let countSuccessInsertMany = 0;
    const ArraySongListToInsertMany = new Array();
    const ArraySongListToCannotInsert = new Array();
    for (const playlist of DataPostman.body) {
      const tempListSong = new Set();
      for (const nameListGenre of playlist.songs) {
        tempListSong.add(nameListGenre);
      }

      const FixSongList = [...tempListSong];
      const NewSong = SongPlaylist({
        playlist_name: playlist.playlist_name,
        songs: FixSongList,
      });

      const isDatabaseReady = await SongPlaylist.aggregate([
        {
          $match: {
            playlist_name: playlist.playlist_name,
          },
        },
      ]);

      if (isDatabaseReady.length > 0) {
        countSuccessInsertMany = countSuccessInsertMany;
        ArraySongListToCannotInsert.push(NewSong);
      } else {
        countSuccessInsertMany = countSuccessInsertMany + 1;
        ArraySongListToInsertMany.push(NewSong);
      }
    }

    return await SongPlaylist.insertMany(ArraySongListToInsertMany)
      .then((result) => {
        console.log(`Function Success Insert Data ${result}`);
        if (ArraySongListToCannotInsert.length > 0) {
          if (ArraySongListToInsertMany.length > 0) {
            return {
              notification: `Success insert data!`,
              total_insert_document: countSuccessInsertMany,
              document_success_insert: result,
              failed: {
                notification: `Gagal insert data! Dupplicate document`,
                total_document_fail: ArraySongListToCannotInsert.length,
                fail_to_insert: ArraySongListToCannotInsert,
              },
            };
          }
          return {
            notification: `Gagal insert data! Dupplicate document`,
            total_document_fail: ArraySongListToCannotInsert.length,
            fail_to_insert: ArraySongListToCannotInsert,
          };
        } else {
          return { notification: `Success insert data!`, total_insert_document: countSuccessInsertMany, document: result };
        }
      })
      .catch((err) => {
        console.log(`Function Catch: Gagal insert document ${err}`);
        return { catch: `Function Catch: Gagal insert document ${err}` };
      });
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

module.exports = {
  CreatePlaylistData,
  CreatePlaylistDatas,
};
