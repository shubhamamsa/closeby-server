let properties = require('../properties')
let mongoose = require('mongoose');

const server = properties.DB_SERVER
const port = properties.DB_PORT
const database = properties.DB_NAME

class Database {
  _connect() {
    mongoose
      .connect(`mongodb://${server}:${port}/${database}`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.log('Database connection error ' + err);
      });
  }
}

module.exports = new Database();