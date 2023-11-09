/** @format */

const mongoose = require('../apps/connect');

const CategoryArticlesSchema = mongoose.Schema(
  {
    categoryname: { type: String, required: true },
    description: { type: String },
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
const CategoryArticlesModel = mongoose.model('CategoryArticles', CategoryArticlesSchema);

const FormatInputCategoryArticles = {
  categoryname: 'String',
  description: 'String',
};

module.exports = {
  CategoryArticlesModel,
  FormatInputCategoryArticles,
};
