/** @format */

import mongooseDB from '../apps/connect.js';

const SellingItemSchema = mongooseDB.Schema(
  {
    _idItemName: { type: mongooseDB.Schema.Types.ObjectId, ref: 'Restockitems', required: true },
    totalSellStock: { type: Number, required: true },
    itemSellPerPcs: { type: Number, required: true },
    description: { type: String },
    // Automation
    uniqFilter: { type: String, required: true },
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

import { RestockItemModel } from './restockItems.js';
export const ProdukModel = RestockItemModel;

export const SellingItemModel = mongooseDB.model('SellingItem', SellingItemSchema);

export const FormatSellingItem = {
  _idItemName: {
    type: {
      _id: 'Restockitems',
      required: true,
    },
    totalSellStock: {
      type: 'Number',
      required: true,
    },
    isSelling: {
      type: 'Boolean',
      required: true,
    },
    description: {
      type: 'String',
    },
    isSelling: {
      type: 'Boolean',
      required: true,
    },
  },
};
