require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const expresslayouts = require("express-ejs-layouts");
var flash = require("connect-flash");


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expresslayouts);
app.use(express.urlencoded({ extended: true }));

// Import app routes
const indexRoute = require("./routes/index.route");
const artistRoute = require("./routes/artist.route");
const artRoute = require("./routes/art.route");
const ExhibitionRoute = require("./routes/exhibition.route");

let session = require("express-session");
let passport = require("./helper/ppConfig");

app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 604800000,
    },
  })
);

// passport and session
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Sharing information to other pagess
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

// Mount app routes
app.use("/", indexRoute);
app.use("/", artistRoute);
app.use("/", artRoute);
app.use("/", ExhibitionRoute);

// Connect MongoDB Database
mongoose.connect(
  process.env.mongoDBURL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => {
    console.log("MongoDB connected successfully!!!");
  }
);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`running on PORT ${PORT}`));
