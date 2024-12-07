require("dotenv").config(); 
const errorHandler=(error,req,res,next)=>{
    const statusCode=res.statusCode?res.statusCode:500
    res.status(statusCode)
    console.log(error)
    res.json({
        message:error.message,
        stack:error.stack,
        status:statusCode
    })
next();
}
module.exports=errorHandler