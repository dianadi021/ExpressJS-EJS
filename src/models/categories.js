/** @format */

import mongooseDB from '../apps/connect.js';

const CategoriesSchema = mongooseDB.Schema(
  {
    categoryName: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  }
);

export const mongoose = mongooseDB;

export const CategoriesModel = mongooseDB.model('Category', CategoriesSchema);

export const FormatCategory = {
  categoryName: { type: 'String', required: true },
  description: { type: 'String' },
  isForceUpdate: {
    type: 'Boolean',
    required: true,
  },
};
