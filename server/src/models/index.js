// const dbConfig = require('../.env.example');

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
// db.url = dbConfig.url;
db.classes = require('./Class.js')(mongoose, mongoosePaginate);

module.exports = db;
