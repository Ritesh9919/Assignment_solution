require('dotenv').config();
const express = require('express');
const db = require('./db/mongoose');
const errorHandler = require('./middleware/error_handler');
const PORT=process.env.PORT;

const app = express();

app.use(express.json());




app.use('/', require('./routes'));

app.use(errorHandler);


app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
})

