const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const artistSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  image: { type: String },
  bio: { type: String },
  art: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "art",
    },
  ],
  Exhibitions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "exhibition",
    },
  ],
});

artistSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Artist = mongoose.model("artist", artistSchema);

module.exports = Artist;
