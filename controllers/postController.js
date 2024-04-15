const Post = require("../models/post");
const User = require("../models/user")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


//GET for the index. Displays the home page
exports.index_get = asyncHandler(async (req, res, next) => {
  // Get all the posts
  const allPosts = await Post.find().sort({timestamp: -1}).populate('author').exec();

  res.render("index", {
    title: 'Anonymous Clubhouse', 
    user: req.user,
    allPosts: allPosts
  });
})

//POST for the index. Saves a post
exports.index_post = [
    //Validate and sanitize fields
    body("title")
      .trim()
      .isLength({min: 1})
      .escape()
      .withMessage("The post needs a title")
      .isAscii()
      .withMessage("The title must be in ASCII characters"),
    body("post")
      .trim()
      .isLength({min: 1})
      .escape()
      .withMessage("You gotta write something"),


    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      console.log("Request Body:", req.body);
      
      const post = new Post({
        title: req.body.title,
        timestamp: Date.now(),
        text: req.body.post,
        author: req.user
      })

      console.log(post);

      if(!errors.isEmpty()) {
        //There are errors. Render the form again with sanitized inputs and error messages
        res.render("index", {
          post: post,
          errors: errors.array(),
        });
        return;
      }
      else {
        await post.save();
        res.redirect('/');
      }
    })
  ]