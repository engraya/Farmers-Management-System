const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, {timestamps : true })


const Farmer = mongoose.model('Farmer', farmerSchema)

module.exports = Farmer