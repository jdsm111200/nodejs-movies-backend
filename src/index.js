require("dotenv").config(); //modulo para usar variables de entorno
const app = require("./server"); //importacion de la app express

//escuchando peticiones
main();
async function main() {
  try {
    await app.listen(process.env.PORT);
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
  } catch (error) {
    console.log();
  }
}
