/** @format */

import { mongoose } from '../apps/connect.js';

const SellingItemSchema = mongoose.Schema(
  {
    _idItemName: { type: mongoose.Schema.Types.ObjectId, ref: 'Restockitems', required: true },
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

export { mongoose };

  import { RestockItemModel } from './restockItems.js';
export const ProdukModel = RestockItemModel;

export const SellingItemModel = mongoose.model('SellingItem', SellingItemSchema);

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
