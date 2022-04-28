const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/validate_token");
const {
  movieComments,
  userComments,
  newComment,
  updateComment,
} = require("../controllers/comments_controller");

router.get("/movie/:movie_id", movieComments);
router.get("/user", verifyToken, userComments);
router.post("/create", verifyToken, newComment);
router.put("/update/:id", verifyToken, updateComment);

module.exports = router;
