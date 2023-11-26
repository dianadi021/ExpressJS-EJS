/** @format */

const { ArticlesModel } = require('../models/articles.model');
const { GetFilteredDocument } = require('../utils/utils');

const GetDatas = async (req, res) => {
  try {
    const ArticlesData = await GetFilteredDocument(ArticlesModel, 'community');
    const ProjectsData = await GetFilteredDocument(ArticlesModel, 'projects');
    const CertificateData = await GetFilteredDocument(ArticlesModel, 'certificate');
    res.render('index', { ArticleDocument: ArticlesData, ProjectDocument: ProjectsData, CertificateDocument: CertificateData });
  } catch (err) {
    res.render('index', { messages: JSON.stringify({ status: 'failed', message: `Function catch error: ${err}` }) });
  }
};

module.exports = {
  GetDatas,
};
