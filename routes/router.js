const express = require("express");
const router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");
const manufacturer_controller = require("../controllers/manufacturerController");
