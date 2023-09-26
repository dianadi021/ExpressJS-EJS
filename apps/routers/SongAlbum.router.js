/** @format */

const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/generate-token', (req, res) => {
  try {
    const result = jwt.GenerateToken(req);
    res.json({ message: true, results: result });
  } catch (err) {
    console.log(`Endpoint Catch: ${err}`);
    res.json({ message: false, results: `Endpoint Catch: ${err}` });
  }
});

module.exports = router;
