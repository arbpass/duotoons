const mongoose= require('mongoose');

const DB = 'mongodb://127.0.0.1:27017/duotoons';

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log('Database Connected!!'))
.catch((error)=> console.log(error.message));