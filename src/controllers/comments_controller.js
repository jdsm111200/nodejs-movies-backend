const ObjectId = require("mongodb").ObjectID;
const { connect, close } = require("../database");

/**
 * Funcion para obtener los comentarios de una pelicula segun su
 * ID. Limite de 10 comentarios por pagina, recibe un path param
 * con el id de la pelicula y un query param con el numero de pagina
 * a visualizar
 */
const movieComments = async (req, res) => {
  try {
    const db = await connect();
    const pipeline = [
      { $match: { movie_id: ObjectId(req.params.movie_id) } },
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
};

/**
 * Funcion para obtener los comentarios de un usuario segun su
 * email. Limite de 10 comentarios por pagina, recibe dos query param
 * uno con el numero de pagina a visualizar y un body con el email del usuario
 * a demas del comentario agrega informacion basica de la pelicula que comento
 */
const userComments = async (req, res) => {
  try {
    const db = await connect();
    pipeline = [
      {
        $match: {
          email: req.body.email,
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movie_id",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $addFields: {
          movie: {
            $arrayElemAt: ["$movie", 0],
          },
        },
      },
      {
        $project: {
          text: 1,
          date: 1,
          movie_id: 1,
          movie: {
            title: 1,
            poster: 1,
          },
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
      { $skip: 10 * (req.query.page - 1) },
      { $limit: 10 },
    ];
    const pages =
      (await db
        .collection("comments")
        .countDocuments({ email: req.query.email })) / 10;
    const results = await db
      .collection("comments")
      .aggregate(pipeline)
      .toArray();
    res.json({
      comments: results,
      actual_page: req.query.page,
      last_page: Math.ceil(pages),
      user: req.user,
    });
  } catch (error) {
    res.json(error.message);
  } finally {
    await close();
  }
};

/**
 * Ruta para insertar un nuevo comentario,
 * recibe un objeto con los campos name,email,movie_id, text
 */
const newComment = async (req, res) => {
  try {
    const comment = req.body;
    comment.movie_id = ObjectId(comment.movie_id);
    comment.date = new Date();
    const db = await connect();
    const result = await db.collection("comments").insertOne(comment);
    result.comment = comment;
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  } finally {
  }
};

/**
 * Metodo para editar comentarios segun su ID,
 * recibe un path param con el ID del comentario
 * y un un json con el campo text a traves
 * del body
 */
const updateComment = async (req, res) => {
  try {
    const db = await connect();
    const result = await db
      .collection("comments")
      .updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { text: req.body.text } }
      );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  } finally {
    await close();
  }
};

module.exports = { movieComments, userComments, newComment, updateComment };
