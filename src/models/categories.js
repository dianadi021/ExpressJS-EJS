/** @format */

import { mongoose } from '../apps/connect.js';

const CategoriesSchema = mongoose.Schema(
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

export { mongoose };

export const CategoriesModel = mongoose.model('Category', CategoriesSchema);

export const FormatCategory = {
  categoryName: { type: 'String', required: true },
  description: { type: 'String' },
  isForceUpdate: {
    type: 'Boolean',
    required: true,
  },
};
