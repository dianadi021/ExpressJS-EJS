/** @format */

const utils = require('../../functions/utils');
const Song = require('../../models/Songs.model');

const CreateSongData = async (DataPostman) => {
  try {
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
          playlist_relation: "String",
          song_genre: 'Array',
          song_listener: 'Number',
          song_duration: 'Number',
        },
      };
    }

    const isDatabaseReady = await Song.find({
      artist: DataPostman.body.artist,
      song_title: DataPostman.body.song_title,
    });

    if (isDatabaseReady.length > 0) {
      return { notification: `Data document sudah tersedia didalam database`, document: isDatabaseReady };
    }

    const tempListGenre = new Set();
    for (const nameListGenre of DataPostman.body.song_genre) {
      tempListGenre.add(nameListGenre);
    }

    const FixListGenre = [...tempListGenre];
    const NewSong = Song({
      artist: DataPostman.body.artist,
      song_title: DataPostman.body.song_title,
      playlist_relation: DataPostman.body.playlist_relation,
      song_genre: FixListGenre,
      release_date: utils.GetCurrentIDNDate(),
      song_listener: DataPostman.body.song_listener,
      song_duration: DataPostman.body.song_duration,
    });

    return await NewSong.save()
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

const CreateSongDatas = async (DataPostman) => {
  try {
    if (DataPostman.body.length < 0) {
      return {
        notification: `Format salah atau inputan kosong!`,
        format: {
          artist: 'String',
          song_title: 'String',
          song_genre: 'Array',
          song_listener: 'Number',
          song_duration: 'Number',
        },
      };
    }

    let countSuccessInsertMany = 0;
    const ArraySongListToInsertMany = new Array();
    const ArraySongListToCannotInsert = new Array();
    for (const songlists of DataPostman.body) {
      const tempListGenre = new Set();
      for (const nameListGenre of songlists.song_genre) {
        tempListGenre.add(nameListGenre);
      }

      const FixListGenre = [...tempListGenre];
      const NewSong = Song({
        artist: songlists.artist,
        song_title: songlists.song_title,
        song_genre: FixListGenre,
        release_date: utils.GetCurrentIDNDate(),
        song_listener: songlists.song_listener,
        song_duration: songlists.song_duration,
      });

      const isDatabaseReady = await Song.find({
        artist: songlists.artist,
        song_title: songlists.song_title,
      });

      if (isDatabaseReady.length > 0) {
        countSuccessInsertMany = countSuccessInsertMany;
        ArraySongListToCannotInsert.push(NewSong);
      } else {
        countSuccessInsertMany = countSuccessInsertMany + 1;
        ArraySongListToInsertMany.push(NewSong);
      }
    }

    return await Song.insertMany(ArraySongListToInsertMany)
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
  CreateSongData,
  CreateSongDatas,
};
