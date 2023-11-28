const mqtt = require("mqtt");
const path = require ('path')
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

const options = {
    reconnectPeriod: 0,
    username: process.env.mqttusername,
    password: process.env.mqttpassword
}
const host = process.env.host
const client = mqtt.connect(`mqtt://${host}:1883`, options);

client.on("connect", () => {
  console.log("MQTT connected")
});

async function publishMessage(topic, message) {
    client.publish (topic,message)
}

module.exports = {
    publishMessage
  };