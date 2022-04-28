const express = require("express");
const router = express.Router();
const {
  movieComments,
  userComments,
  newComment,
  updateComment,
} = require("../controllers/comments_controller");


router.get("/movie/:movie_id", movieComments);
router.get("/user", userComments);
router.post("/create", newComment);
router.put("/update/:id", updateComment);

module.exports = router;
