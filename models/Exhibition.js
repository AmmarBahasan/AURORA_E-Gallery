const mongoose = require("mongoose");

const exhibitionSchema = mongoose.Schema({
  Title: { type: String, require: true },
  lat: { type: Number },
  lng: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "artist",
  },
  art: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "art",
    },
  ],
});

const Exhibition = mongoose.model("exhibition", exhibitionSchema);

module.exports = Exhibition;
