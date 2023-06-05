require('dotenv').config();
const express= require('express');
const app= express();
const mongoose= require('mongoose');
require('./db/conn');
const users= require('./models/userSchema');
const router= require("./routes/router");
const port= 4000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(port, ()=> {
    console.log('server started');
})