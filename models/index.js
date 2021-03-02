const mongoose = require('mongoose')
require('dotenv').config()

const connectionString = process.env.MONGODB_URI
const configOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
console.log("--->", connectionString);
mongoose.connect(connectionString, configOptions)
    .then(() => console.log('MongoDB successfully connected...'))
    .catch(err => console.log(`MongoDB connection error: ${err}`))

module.exports = {
    User: require('./user')
}