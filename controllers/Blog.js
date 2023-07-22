const Blog=require('../models/blogModel');
const User=require('../models/userModel');
const { cloudinaryUploadImage } = require('../utils/Cloudinary');
const validateMongodbID=require('../utils/validateMongodbID');
const fs=require('fs')


//create a blog
exports.createBlog=async(req,res)=>{
    try{
        console.log("inside createBlog");
        const { title, description, category } = req.body;
        console.log("title",title)
        console.log("description",description)
        console.log("category",category)

    // Create a new blog object
    const newBlog = await Blog.create(req.body);
   
    console.log("newBlog",newBlog);
        res.status(200).json({
                success:true,
                message:"Blog created Succsessfully",
                newBlog,
        })

    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error creating the blog",
        })

    }
}
//update a blog
exports.updateBlog=async(req,res)=>{
    try{
        const{id}=req.params;
        validateMongodbID(id);

        const updatedBlog=await Blog.findByIdAndUpdate(id,req.body,{
            new:true,
        })
        res.status(200).json({
            success:true,
            message:"Blog updated Succsessfully",
            updatedBlog,
    })

}catch(err){
    console.error(err);
    return res.status(400).json({
        success:false,
        message:"Error updating the blog",
    })

}    
}
//get a blog
exports.getBlog=async(req,res)=>{
    try{
        const{id}=req.params;
        validateMongodbID(id);

        const getBlog=await Blog.findById(id).populate('likes').populate('dislikes');
        const updatedViews=await Blog.findByIdAndUpdate(id,{
            $inc:{views:1},
        },
        {new:true}).populate('likes').populate('dislikes');

        res.status(200).json({
            success:true,
            message:"Blog fetched Succsessfully",
            updatedViews,
        })

}catch(err){
    console.error(err);
    return res.status(400).json({
        success:false,
        message:"Error fetching the blog",
    })

}    
}
//get all blogs
exports.getAllBlogs=async(req,res)=>{
    try{
        const allBlogs= await Blog.find();
        res.status(200).json({
            success:true,
            message:"All Blogs fetched Succsessfully",
            allBlogs,
    })

}catch(err){
    console.error(err);
    return res.status(400).json({
        success:false,
        message:"Error fetching all the blogs",
    })        
}
}
//Delete a blog
exports.deleteBlog=async(req,res)=>{
    try{
        const{id}=req.params;
        validateMongodbID(id);

        const deletedBlog=await Blog.findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            message:"Blog deleted Succsessfully",
            deletedBlog,
    })

}catch(err){
    console.error(err);
    return res.status(400).json({
        success:false,
        message:"Error deleting the blog",
    })

}    
}
//like a blog
exports.likeBlog=async(req,res)=>{
    try{
        const {blogId}=req.body;
        validateMongodbID(blogId);
        //find the blog which you want to be liked
        const blog=await Blog.findById(blogId);

        //find the person who liked the blog,,,login User
        const loginUserId=req.user?.id;
        console.log("LoginUserID",loginUserId)
        console.log("req.user",req.user)

        //find if the user has liked the post
        const isLiked= blog?.isLiked;
        
        //find if the user has disliked the post
        const alreadyDisliked= blog.dislikes?.find((userId)=>userId?.toString()=== loginUserId?.toString());
        if(alreadyDisliked){
            const blog=await Blog.findByIdAndUpdate(blogId,{
                $pull:{dislikes:loginUserId},
                isDisliked:false,
            },
            {
                new:true,
            });
        }
        if(isLiked){
            const blog=await Blog.findByIdAndUpdate(blogId,{
                $pull: {likes:loginUserId},
                isLiked:false,
            },
            {
                new:true,
            });
        }
        else{
            const blog=await Blog.findByIdAndUpdate(blogId,{
                $push:{likes:loginUserId},
                isLiked:true,
            },
            {
                new:true,
            });
            
        }
        return res.json(blog);


    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error liking the blog",
        })

    }
}
//dislike a blog
exports.dislikeBlog=async(req,res)=>{
    try{
        const {blogId}=req.body;
        validateMongodbID(blogId);
        //find the blog which you want to be liked
        const blog=await Blog.findById(blogId);

        //find the person who liked the blog,,,login User
        const loginUserId=req.user?.id;
        console.log("loginUserId",loginUserId)

        //find if the user has disliked the post
        const isDisliked= blog?.isDisliked;
        
        //find if the user has liked the post
        const alreadyLiked= blog.likes?.find((userId)=>userId?.toString()=== loginUserId?.toString());
        if(alreadyLiked){
            const blog=await Blog.findByIdAndUpdate(blogId,{
                $pull:{likes:loginUserId},
                isLiked:false,
            },
            {
                new:true,
            });
    
        }
        if(isDisliked){
            const blog=await Blog.findByIdAndUpdate(blogId,{
                $pull:{dislikes:loginUserId},
                isDisliked:false,
            },
            {
                new:true,
            });
   
        }
        else{
            const blog=await Blog.findByIdAndUpdate(blogId,{
                $push:{dislikes:loginUserId},
                isDisliked:true,
            },
            {
                new:true,
            });
           

        }
        return res.json(blog);


    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error DisLiking the blog",
        })

    }
}
exports.uploadImages=async(req,res)=>{
    try{
        const {id}=req.params;
        validateMongodbID(id);
         const uploader =(path)=>cloudinaryUploadImage(path,'images');
         const urls=[];
         const files=req.files;
         for(const file of files){
            const {path}=file;
            const newpath=await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);

         }
         const findBlog=await Blog.findByIdAndUpdate(id,{
            images:urls.map((file)=>{
                return file;
            })
         },{
            new:true,
         })


        res.status(200).json({
            success:true,
            message:"Files uploaded successfully",
            findBlog,
        })

    }catch(err){
        console.error(err);
        return res.json({
            success:false,
            message:"Error while uploading image",
        });

    }
}




