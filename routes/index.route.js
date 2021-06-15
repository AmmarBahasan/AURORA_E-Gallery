const express = require("express");
const router = express.Router();

// HTTP GET - root route
router.get("/", (req, res) => {    
    res.render("home/landing");
});

module.exports = router;