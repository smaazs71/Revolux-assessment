import { getDuplicateJSON } from "../helper/helper.js";
import Product from "../models/productModel.js";

export const getAllProducts = async () => {
  try {
    return await Product.find().sort({ productCode: 1, name: 1 });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);

    if (!product) throw new Error("Product not found");

    return product;
  } catch (err) {
    throw new Error("Error while fetching product: " + err.message);
  }
};

export const insertProduct = async (body) => {
  try {
    // Checking Product Already exists
    const productCheck = await Product.findOne().byName(body.name);
    if (productCheck) {
      throw new Error("Product already exists");
    }

    const product = new Product(body);

    // Creating new productCode
    const productCode = await Product.createNewProductCode();
    product.productCode = productCode;

    return await product.save();
  } catch (err) {
    throw new Error("Insertion failed, " + err.message);
  }
};

export const updateProductById = async (body) => {
  try {
    const { _id, HSN_SAC, name, description, types, stocks, lastUpdatedBy } =
      body;

    const product = await getProductById(_id);

    // if( productCode && productCode != product.productCode ){
    //     throw new Error('Cannot update productCode')
    // }
    // if( createdBy && createdBy != product.createdBy ){
    //     throw new Error('Cannot update CreatedBy')
    // }

    if (typeof name !== "undefined" && name != product.name) {
      // const product = await getProductByProductName(body.name)
      const product = await Product.find().byName(name);

      if (Object.keys(product).length != 0 && product[0]._id != _id) {
        console.log("abcdProduct: " + product);
        console.log("ProductID: " + product[0]._id);
        console.log(Object.keys(product).length + ": Length");
        throw new Error("Product name already present");
      }
    }
    if (typeof HSN_SAC !== "undefined") product.HSN_SAC = HSN_SAC;
    if (typeof name !== "undefined") product.name = name;
    if (typeof description !== "undefined") product.description = description;
    if (typeof types !== "undefined") product.types = types;
    if (typeof stocks !== "undefined") product.stocks = stocks;

    product.lastUpdatedBy = lastUpdatedBy;

    return await product.save();
    // const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: false, })
  } catch (err) {
    throw new Error("Update fail => " + err.message);
  }
};

export const deleteProductById = async (id) => {
  try {
    const product = await getProductById(id);

    // return await Product.deleteMany({createdBy: 'U1'})
    return await product.remove();
  } catch (err) {
    throw new Error("Deletion Failed: " + err.message);
  }
};

0;

// export const updateProductTypeStocksById = async (
//   id,
//   productType,
//   changeInStocks,
//   // productStocksChange,
//   lastUpdatedBy
// ) => {
//   try {
//     const product = await getProductById(id);

//     // console.log("changeInStocks:");
//     // console.log(id);
//     // console.log(product.stocks);
//     // console.log(changeInStocks);
//     if (typeof changeInStocks !== "undefined") {
//       // let totalStocks = 0;
//       // product.types.forEach((type, i) => {
//       //   totalStocks = totalStocks + type.stocks;
//       //   if (type.name === productType) {
//       //     product.types[i].stocks = type.stocks + changeInStocks;
//       //     totalStocks = totalStocks + changeInStocks;
//       //   }
//       // });
//       // product.stocks = totalStocks;

//       const index = product.types.findIndex(
//         (type) => type.name === productType
//       );
//       if (index > -1)
//         product.types[index].stocks =
//           product.types[index].stocks + changeInStocks;

//       // if (typeof productStocksChange !== "undefined")
//       //   product.stocks = product.stocks + productStocksChange;

//       if (typeof lastUpdatedBy !== "undefined")
//         product.lastUpdatedBy = lastUpdatedBy;
//     }

//     return await product.save();
//     // const updatedcommodity = await commodity.findByIdAndUpdate(id, body, { new: false, })
//   } catch (err) {
//     throw new Error("Update fail => " + err.message);
//   }
// };

// export const updateProductStocksById = async (
//   id,
//   changeInStocks,
//   lastUpdatedBy
// ) => {
//   try {
//     console.log("changeIn Product Stocks:");

//     console.log(id);
//     console.log(changeInStocks);
//     const product = await getProductById(id);
//     // console.log(product);
//     console.log(product.stocks);
//     if (typeof changeInStocks !== "undefined") {
//       product.stocks = product.stocks + changeInStocks;
//     }

//     if (typeof lastUpdatedBy !== "undefined")
//       product.lastUpdatedBy = lastUpdatedBy;

//     return await product.save();
//     // const updatedcommodity = await commodity.findByIdAndUpdate(id, body, { new: false, })
//   } catch (err) {
//     throw new Error("Update fail => " + err.message);
//   }
// };

export const updateChangeInProductStocks = async (
  changedProductStocks,
  lastUpdatedBy
) => {
  try {
    const product = await getProductById(changedProductStocks.productId);
    const changedProductTypes = getDuplicateJSON(changedProductStocks.types);
    product.types.forEach((type, i) => {
      changedProductTypes.forEach((changedType) => {
        if (type.name === changedType.name) {
          product.types[i].stocks = type.stocks + changedType.quantity;
          changedProductTypes.splice(i, 1);
        }
      });
    });
    product.stocks = product.stocks + changedProductStocks.quantity;

    if (lastUpdatedBy) product.lastUpdatedBy = lastUpdatedBy;

    // return await Product.deleteMany({createdBy: 'U1'})
    return await product.save();
  } catch (err) {
    throw new Error("Product stock updation failed: " + err.message);
  }
};

// Requires product data in below format
// productsData = [
//   {
//     productId: 'dsagvrerefrasfc',
//     quantity: 210, //Sum of all types stocks here
//     types: [{ name: 'typeName1', quantity: 90},{ name: 'typeName2', quantity: 20}]
//   },
//   {
//     productId: 'fojofkelrjngkfmls',
//     quantity: 53, //Sum of all types stocks here
//     types: [{ name: 'type1', quantity: 23},{ name: 'type2', quantity: 30}]
//   },
// ]
export const updateStocksInProductCollection = (
  productsToRemoveStocks,
  productsToAddStocks = getDuplicateJSON(data),
  // productsToAddStocks,
  lastUpdatedBy
) => {
  // const productsToRemoveStocks =
  //   separateProductsProducedByProductId(productsToRemoveStocks);
  // const productsToAddStocks =
  //   separateProductsProducedByProductId(productsToAddStocks);

  const productStockToUpdateArray = [];

  productsToRemoveStocks.forEach((oldProduct) => {
    const index = productsToAddStocks.findIndex(
      (item) => item.productId === oldProduct.productId.toString()
    );

    if (index > -1) {
      const productTypeStockToUpdateArray = productTypeStockToUpdate(
        oldProduct.types,
        productsToAddStocks[index].types
      );

      productStockToUpdateArray.push({
        ...oldProduct,
        types: productTypeStockToUpdateArray,
        quantity: productsToAddStocks[index].quantity - oldProduct.quantity,
      });

      productsToAddStocks.splice(index, 1);
    } else {
      oldProduct.types.map((type) => {
        type.quantity = -type.quantity;
      });
      productStockToUpdateArray.push({
        ...oldProduct,
        quantity: -oldProduct.quantity,
      });
    }
  });

  productsToAddStocks.forEach((newProduct) => {
    productStockToUpdateArray.push(newProduct);
  });

  productStockToUpdateArray.forEach(async (productToUpdate) => {
    await updateChangeInProductStocks(productToUpdate, lastUpdatedBy);
  });
};

const productTypeStockToUpdate = (oldProductTypes, newProductTypes) => {
  const productTypeStockToUpdateArray = [];
  const duplicateOldProductTypes = getDuplicateJSON(oldProductTypes);
  newProductTypes.forEach((newProductType) => {
    let pushed = false;
    oldProductTypes.forEach((oldProductType, i) => {
      if (!pushed) {
        if (oldProductType.name === newProductType.name) {
          productTypeStockToUpdateArray.push({
            ...newProductType,
            quantity: newProductType.quantity - oldProductType.quantity,
          });

          duplicateOldProductTypes.splice(i, 1);

          pushed = true;
        }
      }
    });
    if (!pushed) {
      productTypeStockToUpdateArray.push(newProductType);
    }
  });

  duplicateOldProductTypes.forEach((oldProductType) => {
    productTypeStockToUpdateArray.push(oldProductType);
  });

  return productTypeStockToUpdateArray;
};
