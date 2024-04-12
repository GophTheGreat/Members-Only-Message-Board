var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Anonymous Clubhouse', user: req.user });
});

//GET sign up page
router.get('/sign-up', user_controller.user_create_get);

//POST request for creating a user
router.post('/sign-up', user_controller.user_create_post);

//GET log in page
router.get('/log-in', user_controller.user_login_get);

//GET log in page
router.post('/log-in', user_controller.user_login_post);

module.exports = router;
