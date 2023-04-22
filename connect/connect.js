import mongoose from "mongoose";

const uri = "mongodb+srv://hmwork:hmwork@cluster0.eiiayjc.mongodb.net/?retryWrites=true&w=majority";

export const connect = ()=>{
    mongoose.set('strictQuery',false)
    
    return mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Db is Connected")
    })
}

