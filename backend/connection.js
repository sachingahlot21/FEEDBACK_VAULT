const mongoose = require('mongoose')

async function coonectToMongoDB(url){
    return mongoose.connect(url)
}

module.exports = {coonectToMongoDB}