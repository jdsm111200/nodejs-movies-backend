const express = require("express"); //modulo para el servidor http y routing

//Inicializa la aplicaccion de express
const app = express();

//configuraciones y middlewares
app.use(express.json());

//rutas
app.use("/", require("./routes/index_routes"));
app.use("/api/movies", require("./routes/movies_routes"));
app.use("/api/comments", require("./routes/comments_routes"));
app.use("/api/user", require("./routes/auth"));

module.exports = app;
