// productCode: {
//   type: Number,
//   immutable: true,
//   required: [true, "Product Code required"],
//   unique: [true, "Product Code Already exist"],
// },

// HSN_SAC: {
//   type: String,
//   // required: [true, "Product Code required"],
//   // unique: [true, "Product Code Already exist"],
// },

// name: {
//   type: String,
//   required: [true, "Product Name required in Schema"],
//   unique: [true, "Product name Already exist"],
// },

// description: {
//   type: String,
// },

// stocks: {
//   type: Number,
//   default: 0,
// },

// import { getDB } from "../config/dbconfig.js";

import { db, pgp } from "../config/dbconfig.js";

import asyncHandler from "express-async-handler";
// import {
//   getAllProducts,
//   getProductById,
//   insertProduct,
//   updateProductById,
//   deleteProductById,
// } from "../services/productService.js";
import {
  arrayTypeValidation,
  multiTypeValidation,
  typeValidation,
} from "../validations/typeValidation.js";

// @desc Get All Products
// @route GET api/v1/products
// @access public
export const getProducts = asyncHandler(async (req, res) => {
  const { productsPerPage, pageNo } = req.query;
  typeValidation({ pageNo }, true, "positiveInt");
  typeValidation({ productsPerPage }, true, "positiveInt");

  // if (isNaN(productsPerPage))
  //   throw new Error("enter a valid number for products per page");
  // if (isNaN(pageNo)) throw new Error("enter a valid number for page No");

  if (pageNo < 1) throw new Error("page No invalid");
  if (productsPerPage < 1)
    throw new Error("products per page should be greater than 0");

  const data = await db.many(
    `SELECT * FROM get_products(${productsPerPage},${productsPerPage * pageNo})`
  );
  // getAllProducts();

  res.status(200).json(data);
});

// @desc Get a Product
// @route GET api/v1/products/:id
// @access private
export const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  res.status(400);

  typeValidation({ productId: id }, true, "productId");

  const data = await db.any(`SELECT * FROM get_product_by_id(${id})`);

  // const data = await getProductById(id);

  res.status(200).json(data);
});

// @desc Add Product
// @route POST api/v1/products
// @access private
export const addProduct = asyncHandler(async (req, res) => {
  res.status(400);

  // productJSONTypeValidation(req.body, "add");

  const product = await db.proc("insert_product", [
    req.body.hsn,
    req.body.name,
    req.body.descp,
    req.body.stocks,
  ]);

  //   req.body.createdBy = req.user._id;
  //   req.body.lastUpdatedBy = req.body.createdBy;

  //   const product = await insertProduct(req.body);

  res.status(200).json(product);
});

// @desc Update a Product
// @route PUT api/v1/products/:id
// @access private
export const updateProduct = asyncHandler(async (req, res) => {
  res.status(400);

  // productJSONTypeValidation(req.body, "update");

  //   req.body.lastUpdatedBy = req.user._id;

  //   const data = await updateProductById(req.body);
  const product = await db.proc("update_product", [
    req.body.product_id,
    req.body.hsn,
    req.body.name,
    req.body.descp,
    req.body.stocks,
  ]);

  res.status(200).json(product);
});

// @desc Delete a Product
// @route DELETE api/v1/products/:id
0; // @access private
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  res.status(400);

  typeValidation({ productId: id }, true, "productId");

  const product = await db.proc("delete_product", [id]);

  //   const data = await deleteProductById(req.params.id);

  res.status(200).send(product);
});

const productJSONTypeValidation = (data, requestType) => {
  console.log(data);
  const {
    _id,
    productCode,
    HSN_SAC,
    name,
    description,
    types,
    stocks,
    createdBy,
    lastUpdatedBy,
    createdAt,
    updatedAt,
  } = data;

  let required = false;
  if (requestType == "add") {
    required = true;
    if (_id) throw new Error("Cannot set id");
    if (!types) throw new Error("Atleast 1 type needed");
  } else if (requestType == "update") {
    required = false;
    typeValidation({ _id }, true, "id");
  }

  if (productCode || productCode == false) {
    throw new Error("Cannot set productCode");
  }

  if (createdBy) throw new Error("Cannot set createdBy");

  if (lastUpdatedBy) throw new Error("Cannot set lastUpdatedBy");

  if (createdAt) throw new Error("Cannot set createdAt");

  if (updatedAt) throw new Error("Cannot set updatedAt");

  multiTypeValidation([
    [{ HSN_SAC }, false, "string"],
    [{ name }, required, "string"],
    [{ description }, false, "string"],
    [{ stocks }, true, "number"],
  ]);

  // Product types validation

  if (types) {
    arrayTypeValidation({ types }, true, "any", "Product");

    var typeNameArray = [];

    for (const type of types) {
      const { _id, name, price, stocks } = type;

      if (_id) throw new Error("Product type _id cannot be set");

      multiTypeValidation([
        [{ name }, true, "string", "Product type > "],
        [{ price }, true, "number", "Product type > "],
        [{ stocks }, true, "number", "Product type > "],
      ]);

      if (typeNameArray.includes(name))
        throw new Error("Product type " + name + " is repeated.");
      typeNameArray.push(name);
    }
  }
};
