/** @format */

import mongooseDB from '../apps/connect.js';

const TotalStockItemSchema = mongooseDB.Schema(
  {
    // HEADER
    itemBrand: { type: mongooseDB.Schema.Types.ObjectId, ref: 'Brands' },
    itemCategories: [{ type: mongooseDB.Schema.Types.ObjectId, ref: 'Categories' }],
    itemName: { type: String, required: true },
    // BODY Auto-Update
    listRestockItems: [{ type: mongooseDB.Schema.Types.ObjectId, ref: 'Restockitems' }],
    listSellingItems: [{ type: mongooseDB.Schema.Types.ObjectId, ref: 'SellingItems' }],
    // FOOTER Auto-Update
    // totalRestockItems: { type: Number }, //Stock yang tersedia (remaining)
    // totalModalAssetItems: { type: Number }, //Uang Modal Restock
    // totalSellingItems: { type: Number }, //Total qty barang terjual
    // totalOmset: { type: Number }, //Pendapatan kotor(revenue)
    // totalProfit: { type: Number }, //Pendapatan bersih(income)
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

export const TotalStockItemModel = mongooseDB.model('TotalStockItem', TotalStockItemSchema);

export const FormatTotalStockItem = {
  itemName: { type: 'String', required: true },
  itemBrand: {
    type: {
      _id: 'Brands',
    },
  },
  itemCategories: [
    {
      type: {
        _id: 'Categories',
      },
    },
  ],
  isForceUpdate: {
    type: 'Boolean',
    required: true,
  },
};
