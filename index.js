import express from "express";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import bodyParser from "body-parser";
import morgan from "morgan";
import { connect } from "./connect/connect.js";
import { blog, blogList, post } from "./controller/post.js";
import path from "path";
import { fileURLToPath } from "url";
import { login, register } from "./controller/user.js";
import mongoose from "mongoose";
import { verifyToken } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8000
const app = express()
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const mongouri = "mongodb+srv://hmwork:hmwork@cluster0.eiiayjc.mongodb.net/?retryWrites=true&w=majority"

/* FILE STORAGE */
const storage = new GridFsStorage({
  url: mongouri,
  file: (req, file) => {
      return new Promise((resolve, reject) => {
          const originalName = file.originalname;
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          const filename = uniqueSuffix + '-' + originalName;
          const fileInfo = {
              filename: filename,
              bucketName: "file1"
          };
          resolve(fileInfo);
      });
  }
});

const upload = multer({
  storage
});

//creating bucket
let bucket;
mongoose.connection.on("connected", () => {
    var client = mongoose.connections[0].client;
    var db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "file1"
    });
    //console.log(bucket);
});


app.post("/api/v1/register",register)
app.post("/api/v1/login",login)

app.post("/api/v1/blog",upload.single("file"),verifyToken,post)

app.get("/api/v1/blog",blogList)
app.get("/api/v1/get-blog/:id",blog)

app.get("/api/v1/blog/:filename", async (req, res) => {
  const file = await bucket
        .find({
            filename: req.params.filename
        })

    bucket.openDownloadStreamByName(req.params.filename)
        .pipe(res);
});

const start = async ()=>{
    try{
        await connect()
        app.listen(port,()=>{
            console.log(`i am at ${port}`)
        });
    }catch(error){
        console.log(error)
}
};
start();