const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  thumbnail: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
    // required: true,
  },
  time: {
    type: String,
  },
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  description: {
    type: String,
    required: true,
  },
  singer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Singer",
    },
  ],
});

const Song = mongoose.model("Song", songSchema);

module.exports = { Song };
