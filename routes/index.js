var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Anonymous Clubhouse' });
});

//GET sign up page
router.get('/sign-up', user_controller.user_create_get);

//POST request for creating a user
router.post('/sign-up', user_controller.user_create_post);

module.exports = router;
