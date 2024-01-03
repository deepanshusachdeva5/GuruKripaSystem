const express = require('express')
require('./utils/db');
var cors = require('cors');
const adminRoutes = require('./utils/routes/admin')


app = express()
app.use(express.json())

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};
app.use(cors(corsOpts))
app.use(adminRoutes)

app.listen(3000, (result, error)=>{
    console.log('Sucessfully connected on port 3000!')
})


