/** @format */

const mongoose = require('../apps/connect');

const ArticlesSchema = mongoose.Schema(
  {
    title: { type: String },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CategoryArticles' }],
    description: { type: String },
    link: { type: String },
    body: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    thumbnailImage: { type: String },
  },
  { timestamps: true },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  },
);
const ArticlesModel = mongoose.model('Articles', ArticlesSchema);

const FormatInputArticle = {
  title: 'String',
  description: 'String',
  body: 'String',
};

module.exports = {
  mongoose,
  ArticlesModel,
  FormatInputArticle,
};
