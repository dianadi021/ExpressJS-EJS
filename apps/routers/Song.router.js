/** @format */

const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt.private');

const cSongList = require('../methods/create/Song');
const rSongList = require('../methods/read/Song');
const uSongList = require('../methods/update/Song');
const dSongList = require('../methods/delete/Song');

router.use(express.json());

// CREATE SONG LIST
router.post('/insert-song/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await cSongList.CreateSongData(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

router.post('/insert-songs/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await cSongList.CreateSongDatas(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

// GET SONG LIST
router.get('/get-songs/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await rSongList.GetSongDatas(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

router.get('/get-songs-lookup/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await rSongList.GetAllDataSongsLookup();
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

router.get('/get-song/:id/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await rSongList.GetSongDataByID(req.params.id);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

router.get('/get-songs-facet/:artist/:skip/:limit/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await rSongList.GetSongDataFacet(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

// UPDATE SONG LIST
router.put('/update-song/:id/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await uSongList.UpdateSongDataByID(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

router.put('/update-songs/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await uSongList.UpdateSongDatasRelation();
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

// DELETE SONG LIST
router.delete('/delete-song/:id/', jwt.CheckingTokenAuthorization, async (req, res) => {
  try {
    const result = await dSongList.DeleteSongDataByID(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

module.exports = router;
