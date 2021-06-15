const router = require("express").Router();
const Art = require("../models/Art");
const Artist = require("../models/Artist");

//// ALL ART  ////
router.get("/gallery", (req, res) => {
  Art.find()
    .populate("artist")
    .then((art) => {
      res.render("art/gallery", { art });
    })
    .catch((err) => res.send(err));
});

//// SINGLE ART  ////
router.get("/gallery/artPiece/:id", (req, res) => {
  Art.findById(req.params.id)
    .populate("artist")
    .then((art) => {
      res.render("art/art", { art });
    })
    .catch((err) => res.send(err));
});

module.exports = router;
