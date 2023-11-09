/** @format */

const { CreateDataArticles, GetArticlesData } = require('../functions/articles');
const { CheckingTokenAuthorization } = require('../middleware/auth');
const { mulUpload, upload } = require('../middleware/multer');

const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/articles', mulUpload.single('image'), async (req, res) => {
  // router.post('/articles', async (req, res) => {
  try {
    await CreateDataArticles(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/articles', async (req, res) => {
  try {
    await GetArticlesData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

module.exports = router;
