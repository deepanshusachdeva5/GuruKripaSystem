const mongoose = require('mongoose')

const bill = mongoose.model('Bill', {

    billNumber:{
        type: String,
        required: true,
        unique:true,
    },
    date:{
        type: Date,
        default: Date.now 
    },
    billTo:{

        type:String, 
    },
    gstNo:{
        type: String,
    },
    products :[
        product = [
            prodName= {
                type: Object
            },
            uoc= {
                type: String,  
            },
            price = {
                type: Number,
            }, 
            quantity= {
                type: Number, 
            },
            hsn={
                type: Number, 
            },
            cgst={
                type: Number, 
            },
            sgst={
                type: Number, 
            }
        ]
    ]

})

module.exports = bill