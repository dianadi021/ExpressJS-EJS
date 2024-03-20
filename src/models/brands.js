/** @format */

import { mongoose } from '../apps/connect.js';

const BrandSchema = mongoose.Schema(
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

export { mongoose };

export const BrandModel = mongoose.model('Brand', BrandSchema);

export const FormatBrand = {
  brandName: { type: 'String', required: true },
  description: { type: 'String' },
  isForceUpdate: {
    type: 'Boolean',
    required: true,
  },
};
