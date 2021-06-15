const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

let isLoggedIn = require("../helper/isLoggedIn");
let passport = require("../helper/ppConfig");
const salt = 10;

const Artist = require("../models/Artist");
const Art = require("../models/Art");

//// SIGN UP ////
router.get("/signup", (req, res) => {
  res.render("artist/signup");
});

router.post(
  "/signup",
  [
    body("firstName")
      .notEmpty()
      .withMessage("First name is required")
      .isAlpha()
      .withMessage("First name can only contain letters")
      .isLength({ min: 2 })
      .withMessage("First name has to be more than 2 characters"),

    body("lastName")
      .notEmpty()
      .withMessage("Last name is required")
      .isAlpha()
      .withMessage("Last name can only contain letters")
      .isLength({ min: 2 })
      .withMessage("Last name has to be more than 2 characters"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isAlphanumeric()
      .withMessage("Password must contain a combination of letters and numbers")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),

    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),

    body("image").isURL().withMessage("Profile image must be a link"),
  ],
  (req, res) => {
    let artist = new Artist(req.body);
    let hash = bcrypt.hashSync(req.body.password, salt);
    artist.password = hash;
    artist
      .save()
      .then(() => {
        res.redirect("/profile");
      })
      .catch((err) => {
        const errors = validationResult(req);
        req.flash("validationErrors", errors.errors);
        return res.redirect("/signup");
      });
  }
);

//// SIGN IN ////
router.get("/signin", (req, res) => {
  res.render("artist/signin");
});

router.post(
  "/signin",
  passport.authenticate("artist-local", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
  })
);

//// SIGN OUT ////
router.get("/signout", isLoggedIn, (req, res) => {
  req.logout();
  req.flash("success", "logged out successfully");
  res.redirect("/");
});

//// PROFILE ////
router.get("/profile", isLoggedIn, (req, res) => {
  Artist.findById(req.user._id)
    .populate("art")
    .then((artist) => {
      res.render("artist/profile", { artist });
    });
});

//// DELETE ART /////
router.get("/profile/deleteArt/:id", isLoggedIn, (req, res) => {
  Art.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      res.send(err);
    });
});

//// ADD ART ////
router.get("/profile/addArt", isLoggedIn, (req, res) => {
  res.render("artist/newart.ejs", { artist: req.user });
});

router.post("/profile/addArt", (req, res) => {
  let newart = new Art(req.body);
  newart.artist = req.user._id;
  newart
    .save()
    .then((art) => {
      Artist.findByIdAndUpdate(req.user._id, { $push: { art } }).then(() => {
        res.redirect("/profile");
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

//// SETTINGS - ACCOUNT  ////
router.get("/profile/settings/account", isLoggedIn, (req, res) => {
  res.render("artist/accountSettings.ejs", { artist: req.user });
});

//=> CHANGE EMAIL
router.get("/profile/settings/account/changeEmail", isLoggedIn, (req, res) => {
  res.render("artist/changeemail");
});

router.post("/profile/settings/account/changeEmail", (req, res) => {
  Artist.findOne({ email: req.body.currentEmailAddress }, function (err, user) {
    if (err) {
      res.send("Uh Oh.. something went wrong, please try again later");
    }
    if (!user) {
      res.send("User is not found, please check the entered email address");
    }
    if (!user.verifyPassword(req.body.password)) {
      res.send("Password is incorrect");
    }

    let newEmail = req.body.newEmailAddress;
    Artist.findByIdAndUpdate(req.user._id, { $set: { email: newEmail } })
      .then(() => {
        res.redirect("/signin");
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

//=> CHANGE PASSWORD
router.get("/profile/settings/account/changePassword", isLoggedIn, (req, res) => {
    res.render("artist/changepassword");
  }
);

router.post("/profile/settings/account/changePassword", (req, res) => {
  Artist.findOne({ email: req.body.emailAddress }, function (err, user) {
    if (err) {
      res.send("Uh Oh.. something went wrong, please try again later");
    }
    if (!user) {
      res.send("User is not found, please check the entered email address");
    }
    if (!user.verifyPassword(req.body.currentpassword)) {
      res.send("Current password is incorrect");
    }

    let newPassword = bcrypt.hashSync(req.body.newpassword, salt);
    Artist.findByIdAndUpdate(req.user._id, { $set: { password: newPassword } })
      .then(() => {
        res.redirect("/signin");
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

//// SETTINGS - PROFILE  ////
router.get("/profile/settings/profile", isLoggedIn, (req, res) => {
  res.render("artist/profileSettings.ejs", { artist: req.user });
});

//=> CHANGE PROFILE PICTURE
router.get("/profile/settings/profile/changeImage", isLoggedIn, (req, res) => {
  res.render("artist/changeimage");
});

router.post("/profile/settings/profile/changeImage", (req, res) => {
  Artist.findByIdAndUpdate(req.user._id, { $set: { image: req.body.image } })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      res.send(err);
    });
});

//=> EDIT BIO
router.get("/profile/settings/profile/editBio", isLoggedIn, (req, res) => {
  res.render("artist/changebio");
});

router.post("/profile/settings/profile/editBio", (req, res) => {
  Artist.findByIdAndUpdate(req.user._id, { $set: { bio: req.body.bio } })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      res.send(err);
    });
});

//// ALL ARTISTS  ////
router.get("/artists", (req, res) => {
  Artist.find()
    .then((artists) => {
      res.render("home/artists", { artists });
    })
    .catch((err) => res.send(err));
});

//// SINGLE ARTIST  ////
router.get("/artists/artist/:id", (req, res) => {
  Artist.findById(req.params.id)
    .populate("art")
    .then((artist) => {
      res.render("artist/artwork", { artist });
    });
});

module.exports = router;
