/** @format */

import { mongoose } from '../apps/connect.js';

const MainSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }],
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

export const MainModel = mongoose.model('Main', MainSchema);

export const FormatMain = {
  name: { type: 'String', required: true },
  categories: { type: 'String' },
  isForceUpdate: {
    type: 'Boolean',
    required: true,
  },
};
