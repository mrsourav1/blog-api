import Post from "../model/blog.js";
import {renameSync} from "fs";

export const post = async(req,res)=>{
    try{
        const {title,summary,content,file} = req.body;
        const postSave = await Post.create({
            title,
            summary,
            content,
            file:req.file.filename
        });
        res.status(201).json(postSave)
        res.json()
    }catch(err){
        res.status(404).json({ message: err.message });
    }
}

// export const blogList = async(req,res)=>{
//     try{
//         const posts = await Post.find().populate("file",['filename']);
//         const data = posts.map(post => {
//             return {
//                 _id: post._id,
//                 title: post.title,
//                 summary: post.summary,
//                 content: post.content,
//                 fileUrl: `http://localhost:8000/api/v1/blog/${filename}`,
//                 createdAt: post.createdAt,
//                 updatedAt: post.updatedAt,
//                 __v: post.__v
//             }
//         });
//         res.status(200).json(data)
//     }catch(err){
//         res.status(404).json({ message: err.message });
//     }
// }

// export const blogList = async(req,res)=>{
//     try{
//         const posts = await Post.find()
//         const postsWithFileUrl = posts.map(post => {
//             const file = post.file[0];
//             if (file) {
//                 const fileUrl = `http://localhost:8000/api/v1/blog/${filename}`;
//                 return {
//                     ...post._doc,
//                     fileUrl
//                 };
//             }
//             return post;
//         });
//         res.status(200).json(postsWithFileUrl);
//     }catch(err){
//         res.status(404).json({ message: err.message });
//     }
// }

export const blogList = async(req,res)=>{
    try{
        // let page = Number(req.query.page) || 1
    
        // let limit = Number(req.query.limit) || 1
    
        // let skip = (page-1) * limit
        const posts = await Post.find().sort({createdAt:-1})
        const data = posts.map(post => {
            return {
                _id: post._id,
                title: post.title,
                summary: post.summary,
                content: post.content,
                fileUrl: `http://localhost:8000/api/v1/blog/${post.file}`,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                __v: post.__v
            }
        });
        res.status(200).json(data)
    }catch(err){
        res.status(404).json({ message: err.message });
    }
}





export const blog = async(req,res)=>{
    try{
        const {id} = req.params;
        const singleBlog = await Post.find({_id:id}).populate('file',['filename'])
        res.status(200).json(singleBlog)
    }catch{
        res.status(404).json({ message: err.message });
    }
}