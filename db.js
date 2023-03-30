const mongoose = require('mongoose');
require('dotenv').config();
// const mongoURI = "mongodb://localhost:27017/inotebook?directConnection=true";
// const mongoURI = `mongodb+srv://Harsh:Harshmongodbhld@cluster0.zsaoojf.mongodb.net/iNotebook?retryWrites=true&w=majority`
// const mongoURI = `mongodb://Harsh:Harshmongodbhld@ac-l3jig34-shard-00-00.zsaoojf.mongodb.net:27017,ac-l3jig34-shard-00-01.zsaoojf.mongodb.net:27017,ac-l3jig34-shard-00-02.zsaoojf.mongodb.net:27017/iNotebook?ssl=true&replicaSet=atlas-1184r4-shard-0&authSource=admin&retryWrites=true&w=majority`
const mongoURI = process.env.DATABASE

// var mongoURI = process.env.REACT_APP_DATABASE
const connectToMongo = ()=> {
    mongoose.connect(mongoURI).then(()=> {
        console.log("Connected to mongo successfully");
        // console.log(typeof mongoURI)
        // console.log(mongoURI)
        // console.log(process.env)
    }).catch((err)=>{
        // console.log(typeof mongoURI)
        // console.log(mongoURI)
        console.log("no connection ")
        console.log(err)});
}

module.exports = connectToMongo;