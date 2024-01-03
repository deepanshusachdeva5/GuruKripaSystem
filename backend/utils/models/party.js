const mongoose = require('mongoose')

const Party = mongoose.model('Party', {

    Name:{
        type: String, 
        required: true, 
    },
    GST: {
        type: String, 
        required: true, 
    },
    Address:{
        type: String,   
    },
    State:{
        type: String,
    }


})

module.exports = Party