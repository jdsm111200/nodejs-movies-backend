const express = require("express");
const router = express.Router();
const { connect, close } = require("../database");

//Obtener peliculas filtradas
router.get("/", async (req, res) => {
  try {
    const db = await connect();
    const pipeline = [{ $match: {} }, { $skip: 10 }, { $limit: 10 }];
    const result = await db.collection("movies").aggregate(pipeline).toArray();
    res.json(result);
  } catch (error) {
    console.log(error);
  } finally {
    await close();
  }
});

//Obter filtros para peliculas
router.get("/filter", async (req, res) => {
  try {
    const db = await connect();
    const pipeline = [
      {
        $match: {
          $text: {
            $search: "War",
          },
        },
      },
      {
        $facet: {
          categorias: [
            {
              $unwind: "$genres",
            },
            {
              $sortByCount: "$genres",
            },
          ],
          estrellas: [
            {
              $bucket: {
                groupBy: "$tomatoes.viewer.rating",
                boundaries: [0, 1, 2, 3, 4, 5, Infinity],
                default: "Sin Rating",
                output: {
                  count: {
                    $sum: 1,
                  },
                  min: {
                    $min: "$tomatoes.viewer.rating",
                  },
                  max: {
                    $max: "$tomatoes.viewer.rating",
                  },
                },
              },
            },
          ],
          idiomas: [
            {
              $unwind: "$languages",
            },
            {
              $sortByCount: "$languages",
            },
          ],
          vistas: [
            {
              $bucket: {
                groupBy: "$tomatoes.viewer.numReviews",
                boundaries: [0, 100, 500, 1000, 5000, Infinity],
                default: "Null",
              },
            },
          ],
          paises: [
            {
              $unwind: "$countries",
            },
            {
              $sortByCount: "$countries",
            },
          ],
        },
      },
    ];
    const result = await db.collection("movies").aggregate(pipeline).toArray();
    res.json(result);
  } catch (error) {
    console.log(error);
  } finally {
    await close();
  }
});

module.exports = router;
