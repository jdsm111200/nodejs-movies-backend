const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&writeConcern=majority`;
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    console.log("Conexion DB establecida");
    return db;
  } catch (error) {
    console.log(error);
  }
}
async function close() {
  try {
    await client.close();
    console.log("Conexion DB cerrada");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  connect,
  close,
};
