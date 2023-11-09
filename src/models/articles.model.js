/** @format */

const mongoose = require('../apps/connect');

const ArticlesSchema = mongoose.Schema(
  {
    title: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryArticles' },
    description: { type: String },
    body: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    thumbnailImage: { type: String },
  },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  },
  { timestamps: true }
);
const ArticlesModel = mongoose.model('Articles', ArticlesSchema);

const FormatInputArticle = {
  title: 'String',
  category: 'String',
  description: 'String',
  body: 'String',
  thumbnailImage: 'String',
};

module.exports = {
  ArticlesModel,
  FormatInputArticle,
};
