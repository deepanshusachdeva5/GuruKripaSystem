const mongoose = require('mongoose')

const Admin = mongoose.model('Admin', {
    name:{
        type: String,
        unique: true
    }
})

module.exports = Admin