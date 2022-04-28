const express = require("express");
const router = express.Router();
const { movies, filterMenu } = require("../controllers/movies_controller");


router.get("/", movies);
router.get("/filter", filterMenu);

module.exports = router;
