const axios = require('axios');
const fs = require('fs');
const util = require('util');
const path = require ('path')
const writeFile = util.promisify(fs.writeFile);
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

async function countImage(image, imageName){
    try {
        const destinationPath = process.env.filepath
        const savedFileName = `${destinationPath}${imageName}`;
        const base64Image = image.split(';base64,').pop();
        await writeFile(savedFileName, base64Image, {encoding: 'base64'});
        const response = await axios.post('http://localhost:5000/detect_objects', {filename:savedFileName}); // Replace with your API endpoint
        predictResult = response.data
        const crowd_level = checkCrowdLevel(predictResult.person)
        predictResult.crowd_level = crowd_level
        return predictResult;
      } catch (error) {
        console.error('Error making Axios request:', error);
        throw error;
      }
}

function checkCrowdLevel(person) {
  if (person >= 0 && person < 30) {
    return "Sepi";
  } else if (person >= 30 && person < 60) {
    return "Cukup sepi";
  } else if (person >= 60 && person < 120) {
    return "Cukup padat";
  } else if (person >= 120 && person < 180) {
    return "Padat";
  } else if (person >= 180 && person <= 250) {
    return "Sangat padat";
  } else {
    return "Invalid person value";
  }
}

module.exports = { 
  countImage
}
