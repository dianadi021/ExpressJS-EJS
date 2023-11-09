/** @format */

const mongoose = require('../apps/connect');

const ArticlesSchema = mongoose.Schema(
  {
    title: { type: String },
    category: { type: String },
    description: { type: String },
    body: { type: String },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
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
  description: 'String',
  body: 'String',
  thumbnailImage: 'File',
};

module.exports = {
  ArticlesModel,
  FormatInputArticle,
};
