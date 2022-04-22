const express = require("express"); //modulo para el servidor http y routing

//Inicializa la aplicaccion de express
const app = express();

//configuraciones y middlewares
app.use(express.json());

//rutas
app.use(require("./routes/index_routes"));
app.use("/movies", require("./routes/movies_routes"));

module.exports = app;
