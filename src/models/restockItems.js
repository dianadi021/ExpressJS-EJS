/** @format */

import { mongoose } from '../apps/connect.js';

const ReStockItemSchema = mongoose.Schema(
  {
    unitOfMeasurement: { type: mongoose.Schema.Types.ObjectId, ref: 'itemUnitMeasurement' },
    _idItemName: { type: mongoose.Schema.Types.ObjectId, ref: 'TotalStockItems', required: true },
    itemQuantity: { type: Number, required: true },
    itemModalPerPcs: { type: Number, required: true },
    barCode: { type: String },
    description: { type: String },
    itemSellPerPcs: { type: Number, required: true },
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

export const RestockItemModel = mongoose.model('RestockItem', ReStockItemSchema);

export const FormatRestockItem = {
  _idItemName: {
    type: {
      _id: 'TotalStockItems',
    },
    required: true,
  },
  itemQuantity: {
    type: 'Number',
    required: true,
  },
  itemModalPerPcs: {
    type: 'Number',
    required: true,
  },
  itemSellPerPcs: {
    type: 'Number',
    required: true,
  },
  unitOfMeasurement: {
    type: {
      _id: 'itemUnitMeasurement',
    },
  },
  barCode: { type: 'String' },
  description: { type: 'String' },
  isSelling: {
    type: 'Boolean',
    required: true,
  },
};
