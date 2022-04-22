const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    name: "movies_back_nodejs",
    version: "1.0.0",
    description:
      "Aplicacion web para ver listado de peliculas y sus comentarios y ratings",
  });
});

module.exports = router;
