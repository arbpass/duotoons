require('dotenv').config();
const express= require('express');
const app= express();
require('./db/conn');
const user= require("./routes/user");
const auth= require("./routes/auth");
const admin= require("./routes/admin");
const port= process.env.port || 4000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(auth);
app.use(user);
app.use(admin);

app.listen(port, ()=> {
    console.log('server started');
})