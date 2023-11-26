/** @format */
const { GetDatas } = require('../functions/main.function');

const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
  try {
    res.status(201).json({ status: 'success', message: 'Resource created' });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/', async (req, res) => {
  try {
    await GetDatas(req, res);
    // res.status(200).json({ status: 'success', message: 'Resource connected' });
  } catch (err) {
    res.render('index', { messages: JSON.stringify({ status: 'failed', message: `Function catch error: ${err}` }) });
    // res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/', (req, res) => {
  try {
    res.status(201).json({ status: 'success', message: 'Resource updated' });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/', (req, res) => {
  try {
    res.status(200).json({ status: 'success', message: 'Resource deleted' });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

module.exports = router;
