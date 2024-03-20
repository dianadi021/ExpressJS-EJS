/** @format */

import { FormatTotalStockItem, TotalStockItemModel, mongoose } from '../../models/totalStockItems.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue } from '../../utils/utils.js';

export const CreateTotalStockItem = async (req, res) => {
  try {
    const { itemProduk, itemCategories, itemName } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyItemName = CheckingIsNilValue(itemName);

    if (!itemName || isEmptyItemName) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatTotalStockItem);
    }

    const isItemNameUsed = await TotalStockItemModel.aggregate([{ $match: { itemName: itemName.toLowerCase() } }]);

    if (isItemNameUsed.length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Nama Produk sudah terdaftar! Silahkan untuk mengganti nama data Produk.`);
    }

    const newTotalStockItem = TotalStockItemModel({
      itemName: itemName.toLowerCase(),
      itemProduk,
      itemCategories,
    });

    return await newTotalStockItem
      .save()
      .then((result) => {
        console.log(`201 Success created Items`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil menyimpan data Produk.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Produk. Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Produk. Function Catch: ${err}`);
  }
};

export const GetTotalStockItems = async (req, res) => {
  try {
    const syntaxExec = ['itemName', 'itemCategories', 'itemProduk', 'page', 'document'];
    const { itemProduk, itemCategories, itemName, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data! Query filter tidak sesuai.`);
    }

    const toFilter = itemName ? { itemName: itemName.toLowerCase() } : false;

    let documentsInDB = await TotalStockItemModel.aggregate([
      { $project: { _id: 1, itemName: 1, itemCategories: 1, itemProduk: 1 } },
      {
        $lookup: {
          from: 'categories',
          localField: 'itemCategories',
          foreignField: '_id',
          as: 'itemCategories',
        },
      },
      {
        $lookup: {
          from: 'Produks',
          localField: 'itemProduk',
          foreignField: '_id',
          as: 'itemProduk',
        },
      },
    ]);
    documentsInDB =
      isHasSyntax && itemName
        ? await TotalStockItemModel.aggregate([
            {
              $lookup: {
                from: 'categories',
                localField: 'itemCategories',
                foreignField: '_id',
                as: 'itemCategories',
              },
            },
            {
              $lookup: {
                from: 'Produks',
                localField: 'itemProduk',
                foreignField: '_id',
                as: 'itemProduk',
              },
            },
            {
              $lookup: {
                from: 'RestockItems',
                localField: 'listRestockItems',
                foreignField: '_id',
                as: 'listRestockItems',
              },
            },
            {
              $lookup: {
                from: 'SellingItems',
                localField: 'listSellingItems',
                foreignField: '_id',
                as: 'listSellingItems',
              },
            },
            { $match: toFilter },
          ])
        : documentsInDB;
    documentsInDB =
      page && document
        ? await TotalStockItemModel.aggregate([
            { $project: { _id: 1, itemName: 1 } },
            { $skip: (parseInt(page) - 1) * parseInt(document) },
            { $limit: parseInt(document) },
          ])
        : documentsInDB;

    if (documentsInDB.length) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Produk.`, documentsInDB);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};

export const GetTotalStockItemByID = async (req, res) => {
  try {
    const { id } = req.params;

    let documentsInDB = await TotalStockItemModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'restockitems',
          localField: 'listRestockItems',
          foreignField: '_id',
          as: 'listRestockItems',
        },
      },
      {
        $lookup: {
          from: 'sellingItems',
          localField: 'listSellingItems',
          foreignField: '_id',
          as: 'listSellingItems',
        },
      },
      {
        $addFields: {
          totalRestockItems: {
            $sum: '$listRestockItems.itemQuantity',
          },
          totalModalAsset: {
            $reduce: {
              input: '$listRestockItems',
              initialValue: 0,
              in: {
                $add: ['$$value', { $multiply: ['$$this.itemModalPerPcs', '$$this.itemQuantity'] }],
              },
            },
          },
          totalSellingItems: {
            $sum: '$listSellingItems.totalSellStock',
          },
          totalOmsetAsset: {
            $reduce: {
              input: '$listSellingItems',
              initialValue: 0,
              in: {
                $add: ['$$value', { $multiply: ['$$this.totalSellStock', '$$this.itemSellPerPcs'] }],
              },
            },
          },
        },
      },
    ]);

    documentsInDB = !documentsInDB ? await TotalStockItemModel.findById(id) : documentsInDB;

    if (!documentsInDB || !documentsInDB.length) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Produk.`, documentsInDB);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};

export const UpdateTotalStockByID = async (req, res, _idRestock) => {
  try {
    const { id } = req.params;
    const { _idItemName, isSelling } = CheckingKeyReq(req.body, req.query, req.body.data);
    const documentsInDB = id ? await TotalStockItemModel.findById(id) : await TotalStockItemModel.findById(_idItemName);

    if (!documentsInDB) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    let updateProduk = {};
    const { itemProduk, itemCategories, itemName, isForceUpdate } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyItemName = CheckingIsNilValue(itemName);
    const isEmptyForceUpdate = CheckingIsNilValue(isForceUpdate);

    if (!_idItemName && (!itemName || isEmptyItemName || isEmptyForceUpdate)) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatTotalStockItem);
    }

    if (!_idItemName) {
      const isItemNameUsed = await TotalStockItemModel.aggregate([{ $match: { itemName: itemName.toLowerCase() } }]);

      if (!isForceUpdate && isItemNameUsed.length) {
        return ReturnEJSViews(req, res, 'home', 500, false, `Nama Produk sudah terdaftar! Silahkan untuk mengganti nama data Produk.`);
      }

      updateProduk = CheckingObjectValue(updateProduk, { itemName });
      updateProduk = CheckingObjectValue(updateProduk, { itemProduk });
      updateProduk = CheckingObjectValue(updateProduk, {
        itemCategories: CheckingIsNilValue(itemCategories) ? null : Array.from(new Set(itemCategories)),
      });

      return await TotalStockItemModel.findByIdAndUpdate(id, updateProduk)
        .then((result) => {
          console.log(`201 Success updated Items`);
          ReturnEJSViews(req, res, 'home', 201, true, `Berhasil memperbaharui data Produk.`);
        })
        .catch((err) => ReturnEJSViews(req, res, 'home', 500, true, `Gagal memperbaharui data Produk. Function Catch: ${err}`));
    }

    if (isSelling) {
      // CREATE TRANSACTION SELLING ITEM
      return await TotalStockItemModel.findOneAndUpdate({ _id: _idItemName }, { $push: { listSellingItems: _idRestock } })
        .then((result) => [true, `Berhasil memperbaharui data total stock!`])
        .catch((err) => [false, `Gagal memperbaharui data total stock Function Error! Catch: ${err}`]);
    }

    // CREATE ITEM RESTOCK
    return await TotalStockItemModel.findOneAndUpdate({ _id: _idItemName }, { $push: { listRestockItems: _idRestock } })
      .then((result) => [true, `Berhasil memperbaharui data total stock!`])
      .catch((err) => [false, `Gagal memperbaharui data total stock Function Error! Catch: ${err}`]);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};

export const DeleteTotalStockByID = async (req, res, idListItems) => {
  try {
    const { id } = req.params;
    const documentsInDB = await TotalStockItemModel.findById(id);

    if (!documentsInDB) {
      if (idListItems) {
        return await TotalStockItemModel.findOneAndUpdate(
          { listRestockItems: mongoose.Types.ObjectId(idListItems) },
          { $pull: { listRestockItems: idListItems } }
        )
          .then((result) => [true, 'Berhasil menghapus data di array listRestockItems'])
          .catch((err) => [false, err]);
      }
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    return await TotalStockItemModel.findByIdAndRemove(id)
      .then((result) => {
        console.log(`201 Success deleted Items`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil menghapus data Produk.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, false, `Gagal menghapus data Produk. Function Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};
