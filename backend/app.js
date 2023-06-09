require('dotenv').config();
const express= require('express');
const app= express();
require('./db/conn');
const cors= require('cors');
const user= require("./routes/user");
const auth= require("./routes/auth");
const admin= require("./routes/admin");
const payment= require("./routes/payment");
const port= process.env.port || 4000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(auth);
app.use(user);
app.use(admin);
app.use(payment);

app.listen(port, ()=> {
    console.log('server started');
})