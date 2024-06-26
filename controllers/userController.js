
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");


//GET for sign up page
exports.user_create_get = asyncHandler(async(req, res, next) => {
  res.render('signup')
})

//POST for sign up page
exports.user_create_post = [
  //Validate and sanitize fields
  body("first_name")
    .trim()
    .isLength({min: 1, max: 100})
    .escape()
    .withMessage("User must have a first name")
    .isAscii()
    .withMessage("Name must be in ASCII Characters"),
  body("last_name")
    .trim()
    .isLength({min: 1, max: 100})
    .escape()
    .withMessage("User must have a last name")
    .isAscii()
    .withMessage("Name must be in ASCII Characters"), 
  body("username")
    .trim()
    .isLength({min: 1, max: 100})
    .escape()
    .withMessage("Need a username")
    .isAscii()
    .withMessage("Name must be in ASCII Characters"), 
  body("password")
    .trim()
    .isLength({min: 1})
    .matches(/^(?=.*\d)/)
    .withMessage("Password must contain at least one number")
    .matches(/^(?=.*[a-z])/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/^(?=.*[^\w\s])/)
    .withMessage("Password must contain at least one special character (!@#$%^&*()_+{}|:<>?)"),
  body("confirmpassword")
    .trim()
    .custom((value, {req}) => {return value === req.body.password;})
    .withMessage("Passwords must match"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    //Extract the validation errors from the request
    const errors = validationResult(req);
    console.log("Request Body:", req.body);

    //Password will be hashed pre-save
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      membership: false,
      admin: false
    })
    
    if(!errors.isEmpty()) {
      //There are errors. Render the form again with sanitized inputs and error messages
      res.render("signup", {
        user: user,
        errors: errors.array(),
      });
      return;
    }
    else {
      //Data from the form is valid
      await user.save();
      res.redirect('/');
    }
  })
];

//GET for log in page
exports.user_login_get = asyncHandler(async(req, res, next) => {
  res.render('login')
})

//POST for log in page
exports.user_login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
})

//GET for logging out
exports.user_logout = asyncHandler((req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//GET for joining the club
exports.user_joinclub_get = asyncHandler((req, res, next) => {
  res.render('joinclub');
})

//POST for joining the club
exports.user_joinclub_post = [
  //Validate and sanitize fields
  body("secret")
    .trim()
    .escape()
    .matches(/^the password is password$/)
    .withMessage("Nope, that's not the secret passcode!"),

    asyncHandler(async (req, res, next) => {
    //Extract the validation errors from the request
    const errors = validationResult(req);
    console.log("Request Body:", req.body);

    if(!errors.isEmpty()) {
      //There are errors. Render the form again with sanitized inputs and error messages
      res.render("joinclub", {
        errors: errors.array(),
      });
      return;
    }
    else {
      //Data from the form is valid

      //If there's no "membership" field, add it and make it true. If there is and it's false, make it true
      req.user.membership = true;
      //Save the user
      await req.user.save();
      res.redirect('/');
    }
    })
]