const express = require("express");
const ObjectId = require("mongodb").ObjectID;
const router = express.Router();
const { connect, close } = require("../database");

router.get("/:movie_id", async (req, res) => {
  try {
    const db = await connect();
    const pipeline = [
      { $match: { movie_id: new ObjectId(req.params.movie_id) } },
      { $project: { _id: 0, movie_id: 0 } },
      { $sort: { date: -1 } },
      { $skip: 10 * (req.query.page - 1) },
      { $limit: 10 },
    ];
    const pages =
      (await db
        .collection("comments")
        .countDocuments({ movie_id: ObjectId(req.params.movie_id) })) / 10;
    const results = await db
      .collection("comments")
      .aggregate(pipeline)
      .toArray();
    res.json({
      comments: results,
      actual_page: req.query.page,
      last_page: Math.ceil(pages),
    });
  } catch (error) {
    console.log(error);
    res.json(error.message);
  } finally {
    await close();
  }
});

module.exports = router;
