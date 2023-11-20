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
        return response.data;
      } catch (error) {
        console.error('Error making Axios request:', error);
        throw error;
      }
}

module.exports = { 
  countImage
}
