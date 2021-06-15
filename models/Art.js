const mongoose = require("mongoose");

const artSchema = mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
    require: true,
    unique: true,
  },
  discription: {
    type: String,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "artist",
  },
});

const Art = mongoose.model("art", artSchema);

module.exports = Art;