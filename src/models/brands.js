/** @format */

import mongooseDB from '../apps/connect.js';
const BrandSchema = mongooseDB.Schema(
  {
    brandName: { type: String, required: true },
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

export const BrandModel = mongooseDB.model('Brand', BrandSchema);

export const FormatBrand = {
  brandName: { type: 'String', required: true },
  description: { type: 'String' },
  isForceUpdate: {
    type: 'Boolean',
    required: true,
  },
};
