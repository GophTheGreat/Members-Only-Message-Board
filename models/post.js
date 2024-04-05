const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {type: String, required: true, maxLength: 100},
  timestamp: {type: Date, required: true},
  text: {type: String},
  author: {type: Schema.Types.ObjectId, required: true}
})

