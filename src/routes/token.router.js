/** @format */

const { BacicAuth, GenerateToken, CheckToken } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/token', BacicAuth, (req, res) => {
  try {
    GenerateToken(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/token', BacicAuth, (req, res) => {
  try {
    CheckToken(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

module.exports = router;
