const mongoose= require('mongoose');

const DB = process.env.MONGO_URL;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log('Database Connected!!'))
.catch((error)=> console.log(error.message));