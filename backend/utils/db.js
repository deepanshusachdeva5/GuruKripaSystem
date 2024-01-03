require('dotenv').config();
const mongoose = require('mongoose')



const uri = process.env.MONGODB_URI;
mongoose.connect(uri).then(()=>console.log('Database connected')).catch((e)=>console.log(e))

//console.log('Database connected!')