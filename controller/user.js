import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async(req,res)=>{
    try{
        const { email,password } = req.body;
        const salt = bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password,parseInt(salt))
        const newUser = new User({
            email,
            password:passwordHash
        })
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

export const login = async(req,res)=>{
    try{
        const { email,password } = req.body;
        const user = await User.findOne({email:email});
        if (!user) return res.status(400).json({msg:"User Does not exist ."})
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " }) 
        const token = jwt.sign({ id: user._id }, "secret123");
        delete user.password;
        res.status(200).json({ token, user });
     }catch(error){
      res.status(500).json({error:error.message})
     }
}