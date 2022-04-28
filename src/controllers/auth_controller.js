const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connect, close } = require("../database");
const { schemaRegister, schemaLogin } = require("../schemas/auth_schemas");

/**
 * Metodo para encriptar una contrasenia
 * @param {String} password
 * @returns Contrasenia encriptada
 */
async function encrypt(password) {
  const salt = await bcrypt.genSalt(10);
  const passwordEncrypted = await bcrypt.hash(password, salt);
  return passwordEncrypted;
}

const login = async (req, res) => {
  const user = { email: req.body.email, password: req.body.password };
  //Validacion del Body Request
  const { error } = schemaLogin.validate(user);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const db = await connect();
    const collection = db.collection("users");
    const userDB = await collection.findOne({ email: user.email });
    //Validacion de usuario
    if (!userDB) {
      return res
        .status(400)
        .json({ error: true, message: "Email or Password is incorrect" });
    }
    //validacion de contrasenia
    const validPassword = await bcrypt.compare(user.password, userDB.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ error: true, message: "Email or Password is incorrect" });
    }

    //Creacion del JWT
    const token = jwt.sign(
      {
        name: userDB.name,
        id: userDB._id,
      },
      process.env.TOKEN_SECRET
    );

    res
      .header("auth_token", token)
      .json({ error: false, message: "Welcome", token: token });
  } catch (error) {
    console.log(error);
    res.json(error);
  } finally {
    await close();
  }
};

const register = async (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    date: new Date(),
  };

  //validacion de datos
  const { error } = schemaRegister.validate(user);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const db = await connect();
    const collection = db.collection("users");
    //verificacion de correo en uso
    const existEmail = await collection.findOne({ email: user.email });
    if (existEmail) {
      return res
        .status(409)
        .json({ error: true, message: "Email already regitered" });
    }
    //encriptacion de contrasenia
    user.password = await encrypt(user.password);

    const userDB = await collection.insertOne(user);
    res.status(200).json({ error: false, data: user });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  } finally {
    await close();
  }
};

module.exports = { register, login };
