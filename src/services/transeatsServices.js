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

let message={
  "latitude": "",
  "longitude": "",
  "prediction" : [
    
  ]
}

async function publish(body) {
  const {topic, latitude, longitude } = body;
  const {image, imageName} = body;
  const {carriageId} = body
  console.log(message)
  if (latitude && longitude){
    message.latitude = latitude
    message.longitude = longitude
  }
  if (!message.prediction.some((carriage) => carriage.carriageId === carriageId)){
    try {
      imageCount = await imageProcess.countImage(image, imageName)
      const {head, person} = imageCount
      const predictionResult = {
        "carriageId": carriageId,
        "person": person,
        "crowd_level": 5
      }
      message.prediction.push(predictionResult)
      if (message.prediction.length == 3){
        mqtt.publishMessage(topic, JSON.stringify(message))
        message.prediction = []
      }
      return {
        message: "Carriage " + carriageId + " is succesffuly predicted"
      };
    } catch (error) {
      return error
    }
  }
 
  else {
    return {
      message: "Carriarge " + carriageId + " is already predicted"
    }
  }
}

module.exports = {
  register,
  login,
  testProtected,
  publish
};
