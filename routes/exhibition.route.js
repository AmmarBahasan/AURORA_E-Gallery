const router = require("express").Router();
const Exhibition = require("../models/Exhibition");
const Artist = require("../models/Artist");
const isLoggedIn = require("../helper/isLoggedIn");
const moment = require("moment");

//// ALL EXHIBISTIONS ////
router.get("/exhibitions", (req, res) => {
  Exhibition.find()
    .populate("artist")
    .then((exhibition) => {
      res.render("exhibition/allexhibition", { exhibition, moment });
    })
    .catch((err) => res.send(err));
});

//// SINGLE EXHIBISTIONS ////
router.get("/exhibitions/exhibition/:id", (req, res) => {
  Exhibition.findById(req.params.id)
    .populate("artist")
    .populate("art")
    .then((exhibition) => {
      res.render("exhibition/exhibitiondetails", { exhibition, moment });
    })
    .catch((err) => res.send(err));
});

//// ALL ARTIST'S EXHIBISTIONS ////
router.get("/myExhibitions", isLoggedIn, (req, res) => {
  Exhibition.find()
    .populate("artist")
    .then((exhibition) => {
      res.render("exhibition/myexhibition", { exhibition, moment });
    });
});

//// ADD EXHIBISTION ////
router.get("/profile/addExhibition", isLoggedIn, (req, res) => {
  Artist.findById(req.user._id)
    .populate("art")
    .then((artist) => {
      res.render("exhibition/newExhibition.ejs", { artist });
    });
});

router.post("/profile/addExhibition", (req, res) => {
  let newExhibition = new Exhibition(req.body);
  newExhibition.artist = req.user._id;
  newExhibition
    .save()
    .then((exhibition) => {
      Artist.findByIdAndUpdate(req.user._id, {
        $push: { Exhibitions: exhibition },
      }).then(() => {
        res.redirect("/profile");
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
