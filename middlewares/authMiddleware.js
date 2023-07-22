// we will verify the jwt token and check whether the user is Admin or not.

const User =require('../models/userModel');
const jwt=require('jsonwebtoken');
require('dotenv').config();


//middleware used for authentication.
exports.authMiddleware=(req,res,next)=>{
    try{
        //extract jwt token from request ki body
      
    console.log("Auth middleware called");
    
    // extract jwt token from request.
    console.log("Token from body:", req.body.token);
    console.log("Token from cookie:",req.cookies.token);
    console.log("Authorization header:", req.header("Authorization"));
   
    
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
    console.log("Extracted token:", token);
    
       

        //check if you got token from request's body
        if (!token || token===undefined) {
            return res.status(401).json({
                success:false,
                message:"Token Missing"
            })
            
        }

        //verify the token

        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            req.user=payload;

        }catch(err){
            res.status(401).json({
                success:false,
                message:"Token is Invalid"
            })
        }

        next();


     } catch(err){
        console.error(err);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying token"
        })
        
    }
}

//middleware to check whether user isAdmin or not
exports.isAdmin=async(req,res,next)=>{
    try{
        console.log("Inside Admin route")
        console.log("Consolling req.user object\n")
        console.log(req.user);//it is the payload of the token.
        const {email}=req.user;
        const adminUser= await User.findOne({email});
        console.log(adminUser)
        if(adminUser.role!=='admin'){
            return res.status(500).json({
                success:false,
                message:"User is not admin"
            });
        }
        else{
            next();
        }

    }catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying token"
        })
    }
}










