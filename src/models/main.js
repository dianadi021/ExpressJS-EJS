/** @format */

import mongooseDB from '../apps/connect.js';

const MainSchema = mongooseDB.Schema(
  {
    name: { type: String, required: true },
    categories: [{ type: mongooseDB.Schema.Types.ObjectId, ref: 'Categories' }],
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

export const MainModel = mongooseDB.model('Main', MainSchema);

export const FormatMain = {
  name: { type: 'String', required: true },
  categories: { type: 'String' },
  isForceUpdate: {
    type: 'Boolean',
    required: true,
  },
};
