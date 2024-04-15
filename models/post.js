const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {type: String, required: true, maxLength: 100},
  timestamp: {type: Date, default: Date.now},
  text: {type: String},
  author: {type: Schema.Types.ObjectId, ref: "User", required: true}
})

PostSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate(); // format 'YYYY-MM-DD'
});

module.exports = mongoose.model("Post", PostSchema);