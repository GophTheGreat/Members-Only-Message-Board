var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");

/* GET home page. */
router.get('/', post_controller.index_get);

/* POST a message from home page form. */
router.post('/', post_controller.index_post);

//GET sign up page
router.get('/sign-up', user_controller.user_create_get);

//POST request for creating a user
router.post('/sign-up', user_controller.user_create_post);

//GET log in page
router.get('/login', user_controller.user_login_get);

//GET log in page
router.post('/login', user_controller.user_login_post);

//GET log out
router.get('/logout', user_controller.user_logout);

//GET join the club
router.get('/joinclub', user_controller.user_joinclub_get);

//POST joint he club
router.post('/joinclub', user_controller.user_joinclub_post);

module.exports = router;
