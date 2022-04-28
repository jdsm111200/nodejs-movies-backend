const { connect, close } = require("../database");

//Obtener peliculas filtradas
const movies = async (req, res) => {
  try {
    const db = await connect();
    const pipeline = [{ $limit: 10 }];
    const result = await db.collection("movies").aggregate(pipeline).toArray();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  } finally {
    await close();
  }
};

//Obter filtros para peliculas
const filterMenu = async (req, res) => {
  try {
    const db = await connect();
    const text = req.query.text;
    const pipeline = [
      {
        $match: {
          $text: {
            $search: text,
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
    res.json(error);
  } finally {
    await close();
  }
};

module.exports = { movies, filterMenu };
