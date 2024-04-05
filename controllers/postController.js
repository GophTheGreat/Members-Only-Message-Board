

const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// Display list of all items, categories, and manufacturers
exports.index = asyncHandler(async (req, res, next) => {
  // Get all the items and their prices
  const [
    numItems,
    numCategories,
    numManufacturers
  ] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
    Manufacturer.countDocuments({}).exec(),
  ]);

  console.log("hi")
  console.log(numItems);

  res.render("index", {
    title: "THE SHOP home",
    item_count: numItems,
    category_count:  numCategories,
    manufacturer_count: numManufacturers
  });
})