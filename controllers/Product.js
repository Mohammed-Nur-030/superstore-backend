const Product=require("../models/productModel");
const User=require("../models/userModel")
const slugify=require("slugify");
const validateMongoDbId = require("../utils/validateMongodbID");





exports.createProduct=async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const product = await Product.create(req.body);
        
       
        res.json({
            sucsess:true,
            message:"Product created sucessfully",
            product,
        })
        console.log(product)

    }catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"Product couldnot be create .PLease try again later"
        })

    }
}

exports.getaProduct=async(req,res)=>{
    try{
        const {id}=req.params;
     
        const findProduct=await Product.findById(id);
        // .populate("color");
  
        if (!findProduct) {
            return res.status(404).json({ error: 'Product not found.' });
          }

        return res.status(200).json({
            success:"true",
            message:"Product fetched Succesfully",
            findProduct,
        })

    }catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"Product couldnot be fetched .PLease try again later"
        })


    }
}
exports.getAllProducts=async(req,res)=>{
    try{
        //filtering
        const queryObj={...req.query};
        const excludeFields=["page","sort","limit","fields"];
        // if any of the about fields come in our query obj then delete it
        excludeFields.forEach(element => {
            delete queryObj[element]
        });
        console.log("queryObj=>",queryObj);
        console.log("req.query=>",req.query);
        let queryStr=JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        console.log(JSON.parse(queryStr));

        let query=Product.find(JSON.parse(queryStr));
       

       //sorting
       if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);

       }else{
        query=query.sort('-createdAt');
       }

       //limiting the fields
       if(req.query.fields){
        const fields=req.query.fields.split(',').join(' ');
        query=query.select(fields);

       }else{
        query=query.select('-__v');

       }

       //pagination
       const page=req.query.page;
       const limit=req.query.limit;
       const skip=(page -1)*limit;
       query=query.skip(skip).limit(limit);
       if(req.query.page){
        const productCount=await Product.countDocuments();
        if(skip>=productCount){
            return res.status(303).json({
                success:false,
                message:"This Paage doesnt Exists"
            })
        }
       }
       console.log(page,limit,skip);

       const product=await query;  
    
        res.json({
            sucsess:true, 
            message:" All Products fetched sucessfully",
            product,
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"Products couldnot be fetched .PLease try again later"
        })
    }
}

exports.updateProduct=async(req,res)=>{
    try{
        const {id}=req.params;
        // the updated products will be sent through the requests body if the title is changed then the slug also need to be changed.
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const updateProduct= await Product.findByIdAndUpdate(id,req.body ,{new:true});
        res.json({
            sucsess:true,
            message:"Product updated Sucessfully",
            updateProduct,
        })

    }catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"Product couldn't be updated .Please try again later"
        })

    }
}

exports.deleteProduct=async(req,res)=>{
    try{
        const {id}=req.params;
        
   
        const deleteProduct= await Product.findByIdAndDelete(id);
        res.json({
            sucsess:true,
            message:`Product ${deleteProduct} deleted  Sucessfully`,
            
        })

    }catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"Product couldn't be updated .Please try again later"
        })

    }
}

exports.addToWishList=async(req,res)=>{
    try{
        const{id}=req.user;
        const {prodId}=req.body;

        const user =await User.findById(id);
        //check if the product is already there in his wishlist
        const alreadyAdded=user.wishList.find((id)=>id.toString()===prodId);

        if(alreadyAdded){
            let user=await User.findByIdAndUpdate(id,{
                $pull:{wishList:prodId},
            },{
                new:true,
            })
            res.json({
                message:"Item Removed from WihList",
                user,
            })
        }
        else{
            let user=await User.findByIdAndUpdate(id,{
                $push:{wishList:prodId},
            },{
                new:true,
            })
            res.json({
                message:"Item Added To WishList",
                user,
            })


        }


    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Error adding the product to cart",
        })

    }
} 
exports.rating = async (req, res) => {
    try {
      console.log("Inside Rating");
      const { id } = req.user;
      const { star, prodId, comment } = req.body;
  
      const product = await Product.findById(prodId);
      const user = await User.findById(id);
  
      // check if already rated
      let alreadyRated = product.ratings.find(
        (rating) => rating.postedby.toString() === id.toString()
      );
  
      if (alreadyRated) {
        // Update the existing rating
        alreadyRated.star = star;
        alreadyRated.comment = comment;
        alreadyRated.name = user.firstName; // Update the name field
        await product.save();
      } else {
        // Add a new rating
        product.ratings.push({
          star: star,
          comment: comment,
          postedby: id,
          name: user.firstName, // Add the name field
        });
        await product.save();
      }
  
      const updatedProduct = await Product.findById(prodId);
  
      let totalRatings = updatedProduct.ratings.length;
      let ratingSum = updatedProduct.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);
  
      let actualRating = Math.round(ratingSum / totalRatings);
  
      updatedProduct.totalRating = actualRating;
      const finalProduct = await updatedProduct.save();
  
      res.status(200).json({
        message: "Rating Updated",
        finalProduct,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Error rating the product",
      });
    }
  };
  
  
  