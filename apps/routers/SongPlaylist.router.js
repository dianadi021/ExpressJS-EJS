/** @format */

const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt.private');

const cPlaylist = require('../methods/create/SongPlaylist');
const rPlaylist = require('../methods/read/SongPlaylist');
const uPlaylist = require('../methods/update/SongPlaylist');
const dPlaylist = require('../methods/delete/SongPlaylist');

router.use(express.json());

// CREATE SONG LIST
router.post('/insert-playlist/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await cPlaylist.CreatePlaylistData(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

router.post('/insert-playlists/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await cPlaylist.CreatePlaylistDatas(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

// GET SONG LIST
router.get('/get-playlists/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await rPlaylist.GetPlaylistDatas(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

router.get('/get-playlist/:id/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await rPlaylist.GetPlaylistDataByID(req.params.id);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

router.get('/get-playlist-lookup/:skip/:limit', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await rPlaylist.GetAllPlaylistDataSongs(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

// UPDATE SONG LIST
router.put('/update-playlist/:id/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await uPlaylist.UpdatePlaylistDataByID(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

// DELETE SONG LIST
router.delete('/delete-playlist/:id/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await dPlaylist.DeletePlaylistDataByID(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

module.exports = router;
