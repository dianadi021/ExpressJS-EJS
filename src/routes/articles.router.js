/** @format */

const {
  CreateArticlesData,
  GetArticlesData,
  GetArticleDetails,
  UpdateArticleData,
  DeleteArticleData,
} = require('../functions/articles.function');
const { CheckingTokenAuthorization } = require('../middleware/auth');
const { mulUpload, upload } = require('../middleware/multer');

const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/articles', mulUpload.single('thumbnailImage'), async (req, res) => {
  // router.post('/articles', async (req, res) => {
  try {
    await CreateArticlesData(req, res);
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

router.get('/articles/:id', async (req, res) => {
  try {
    await GetArticleDetails(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/articles/:id', mulUpload.single('thumbnailImage'), async (req, res) => {
  try {
    await UpdateArticleData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/articles/:id', async (req, res) => {
  try {
    await DeleteArticleData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

module.exports = router;
