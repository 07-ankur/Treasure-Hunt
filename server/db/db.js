const mongoose=require('mongoose')

const connect=(url)=>{
    mongoose.connect(url).then((e)=>{
        console.log("Connected to MONGODB successfully")
    }).catch((e)=>{
        console.log("Error occured in connection to MONGO DB ")
        console.log(e)
    })
}
module.exports=connect;