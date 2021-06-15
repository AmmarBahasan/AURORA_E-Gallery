const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Artist = require("../models/Artist");

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Artist.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use("artist-local", new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
},
    function (email, password, done) {
        Artist.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }

));

module.exports = passport;