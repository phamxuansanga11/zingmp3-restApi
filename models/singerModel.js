const mongoose = require("mongoose");

const singerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  birthName: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: false,
  },
  description: {
    type: String,
  },
  listSongs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});

const Singer = mongoose.model("Singer", singerSchema);

module.exports = { Singer };
