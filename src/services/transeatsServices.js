const e = require("express");
const db = require("../config/config");
const uuid = require('uuid');
const security = require("../utils/security")
const middleware = require ("../middleware/auth")
const mqtt = require("../utils/mqtt")
const imageProcess = require("../utils/imageProcess")

async function register(body) {
  const { name, email, password } = body;
  if (!name || !email || !password) {
    return {
      message: "Empty value",
    };
  }
  const id = uuid.v4()
  const hashedPassword = await security.hashPassword(password)
  const query = `INSERT INTO account (ID, NAME, EMAIL, PASSWORD) VALUES ('${id}','${name}', '${email}','${hashedPassword}')`;
  const result = await db.query(query);
  if (result.rowCount !== 0) {
    return {
      message: "User Created",
    };
  } 
  else {
    return {
      message: "Error",
    };
  }
}

async function login(body) {
  const { email, password } = body;
  const query = `SELECT * FROM account WHERE email = '${email}'`;
  const result = await db.query(query);
  if (result.rowCount !== 0) {
    return {
      message: "User Created",
    };
  } 
  else {
    return {
      message: "Error",
    };
  }
}

async function insertTrainData(body) {
  const {latitude, longitude, person, crowd_level} = body
  const query = `INSERT INTO TRAINDATA (trainId, carriageId, latitude, longitude, person, crowdLevel) VALUES (1, 1, ${latitude}, ${longitude}, ${person}, ${crowd_level})`;
  const result = await db.query(query);
  if (result.rows.length === 0) {
    return {
      message: "User not found",
    };
  } 
  else {
    const user = result.rows[0];
    if (await security.comparePassword(password, user.password)){
      const token = await middleware.generateToken(user.id)
      return {
        message: "Login successful",
        idUser: user.id,
        token: token,
      };
    }
    else {
      return {
        message: "Login failed",
      };
    }
  }
}


async function testProtected(body) {
  return {
    message: "Protected route accessed successfully"
  };
}

async function publish(req) {
  const {image, imageName} = req.body;
  try {
    imageCount = await imageProcess.countImage(image, imageName)
    const { topic, latitude, longitude } = req.body;
    const {head, person} = imageCount
    const title = "Gerbong " + 1
    const crowd_level = 5
    var message = {
      "title": title,
      "latitude": latitude,
      "longitude": longitude,
      "crowd_level": crowd_level,
      "head": head,
      "person": person
    }
    mqtt.publishMessage(topic, JSON.stringify(message))
    insertTrainData(message)
    return {
      message: message
    };
  } catch (error) {
    console.log(error);
  }
  
}

module.exports = {
  register,
  login,
  testProtected,
  publish
};
