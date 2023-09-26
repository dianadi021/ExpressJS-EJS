/** @format */

const express = require('express');
const router = express.Router();
const jwt = require('../middleware/jwt.private');

const CheckBasicAuthPostman = require('../middleware/auth.private');

router.use(express.json());

// GENERATE/CREATE TOKEN
router.get('/generate-token/', CheckBasicAuthPostman, (req, res) => {
  try {
    const result = jwt.GenerateToken(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

// GET/READ IS TOKEN STILL ACTIVE/INACTIVE
router.get('/check-token/', (req, res) => {
  try {
    const result = jwt.CheckToken(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

module.exports = router;
