const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon=require('../models/couponModel')
const Order=require('../models/orderModel');

const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const validateMongoDbId = require('../utils/validateMongodbID');
const mailSender = require('../utils/mailSender');
const randomstring = require('randomstring');
const uniqid=require('uniqid');
const orderModel = require('../models/orderModel');





//signup route
exports.signup = async (req, res) => {
    try {
        //get data
        const { firstName, lastName, email, password, mobile } = req.body;

        //check if user already exist
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exits"
            })
        }

        //secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: "Error in Hashing Password"
            })
        }

        //create entry for User
        const user = await User.create({
            firstName, lastName, email, password: hashedPassword, mobile
        })

        return res.status(200).json({
            success: true,
            message: "User created Succesfully"
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered please try again later"
        })

    }
}

//login route
exports.login = async (req, res) => {
    try {
        //fetch data from req body
        const { email, password } = req.body;

        //check gor email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details"
            })
        }
        //check for user in Database
        let user = await User.findOne({ email });
        //ifUser doesnot exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exists .PLease SignUp"
            })
        }
        // now user exists and check for password and create a JWT
        if (await bcrypt.compare(password, user.password)) {
            // password verified

            // create a JWT
            const payload = {
                email: user.email,
                id: user._id,
            }

            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2d"
                });
            //  add token to object            
            user = user.toObject();
            user.password = undefined;
            user.token = token;



            //  create cookie    
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged In Successfully"
            })

            //  res.status(200).json({
            //         success:true,
            //         user,
            //         token,
            //         message:"User Logged In Successfully"
            //     })


        } else {
            //passwords do not match
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            }

            )
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Login Failure",
        })


    }
}
//admin login
exports.loginAdmin = async (req, res) => {
    try {
        //fetch data from req body
        const { email, password } = req.body;

        //check gor email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details"
            })
        }
        //check for user in Database
        let admin = await User.findOne({ email });
        //if Admin doesnot exists
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin does not exists .PLease SignUp"
            })
        }
        //if the users enetered is not a admin 
        if(admin.role!=='admin'){
            return res.status(401).json({
                success: false,
                message: "User is not Admin ."
            })
        }


        // now admin exists and check for password and create a JWT
        if (await bcrypt.compare(password, admin.password)) {
            // password verified

            // create a JWT
            const payload = {
                email: admin.email,
                id: admin._id,
            }

            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2d"
                });
            //  add token to object            
            admin = admin.toObject();
            admin.password = undefined;
            admin.token = token;



            //  create cookie    
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                admin,
                message: "User Logged In Successfully"
            })

            //  res.status(200).json({
            //         success:true,
            //         admin,
            //         token,
            //         message:"User Logged In Successfully"
            //     })


        } else {
            //passwords do not match
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            }

            )
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Login Failure",
        })


    }
}

//update a user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.user;
        validateMongoDbId(id);
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
            {
                new: true,
            });
        return res.status(200).json({
            success: true,
            message: "User Updated SuccesFully",
            updatedUser,
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be Updated please try again later"
        })
    }
}

//save user Address
exports.saveAddress=async(req,res)=>{
    try{
        const {id}=req.user;
        validateMongoDbId(id);

        const updatedUser = await User.findByIdAndUpdate(id, {
            address: req?.body?.address,
        },
            {
                new: true,
            });
        return res.status(200).json({
            success: true,
            message: "User  Address Updated SuccesFully",
            updatedUser,
        })


    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error while storing the Address"
        })

    }
}


//get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const getUsers = await User.find();
        // res.set('Cache-Control', 'no-store');
        return res.status(200).json({
            success: true,
            message: "All users retreived Succesfully",
            getUsers,
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: " All Users cannot be fetched please try again later"
        })

    }
}

// Get a single User
exports.getUser = async (req, res) => {
    try {
        const { id } = req.user;
        validateMongoDbId(id);
        const getSingleUser = await User.findById(id);
        return res.status(200).json({
            success: true,
            message: `user with ${id} retreived Succesfully`,
            getSingleUser,
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be fetched please try again later"
        })
    }
}

//delete a User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.user;
        validateMongoDbId(id);

        const deletedUser = await User.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: `user with  id:${id} deleted Succesfully`,
            deletedUser,
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted please try again later"
        })
    }
}
//block a user
exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);

        const blocked = await User.findByIdAndUpdate(id, {
            isBlocked: true,
        },
            {
                new: true,
            });
        console.log("Consolling blokced user", blocked.isBlocked)
        return res.status(200).json({
            success: true,
            message: "User  blocked sucessfully"
        })



    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be blocked please try again later"
        })

    }
}
//unblock a user
exports.unblockUser = async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);

        const unBlocked = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        },
            {
                new: true,
            })
        return res.status(200).json({
            success: true,
            message: "User  unblocked sucessfully"
        });
        console.log("Consolling unblokced user", unBlocked)


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be unblocked please try again later"
        })

    }
}

//logout 
exports.logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token');

        // Find the user by ID
        const { id } = req.user;
        const user = await User.findById(id);

        // If the user is found, update the token field to null
        if (user) {
            user.token = null;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Failed to logout',
        });
    }
};



// Controller for Changing Password
exports.forgetPassword = async (req, res) => {
    try { 
        const email = req.body.email
        console.log("email", email);

        const user = await User.findOne({ email: email });

        if (user) {
            const randomString = randomstring.generate();
            console.log("randomString", randomString);
            const data = await User.updateOne({ email: email }, {
                refreshToken: randomString,
            },
                {
                    new: true,
                });
            console.log("user", user)
            const url = `http://localhost:3000/forgot-password/${randomString}`;

            await mailSender(
                email,
                "Password Reset",
                `Your Link for email verification is ${url}. Please click this url to reset your password.`
            );


            res.status(200).json({
                success: true,
                message: "Please check your inbox of for reset Email"
            })

        } else {

            res.status(200).json({
                success: false,
                message: "User with this email doesn't exists",
            })
        }

    } catch (err) {
        console.error(err);
        return res.json({
            sucess: false,
            message: "Error while Changing message",
        })
    }

};
//reset password
exports.resetPassword = async (req, res) => {
    try {
        // const token = req.query.token;
        const {token} = req.params;
        console.log("token", token)
        const tokenData = await User.findOne({ refreshToken: token });
        console.log("TokenData:", tokenData)

try{
    if (token) {
        const { password, confirmPassword } = req.body;

        if (confirmPassword !== password) {
            return res.json({
                success: false,
                message: "Password and Confirm Password Does not Match",
            });
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        console.log("Password=", password)
        console.log("encryptedPassword=", encryptedPassword)
        const userData = await User.findOneAndUpdate(
            { _id: tokenData._id },
            {
                password: encryptedPassword, refreshToken: '',
            },
            { new: true }
        );
        console.log(userData);
        // Send notification email
		try {
			const emailResponse = await mailSender(
				tokenData.email,
				"passwordUpdated",
				`Password updated successfully for ${tokenData.firstName} ${tokenData.lastName}`
				
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}
        res.json({
            success: true,
            message: `Password Reset Successful`,
        });

    }
}

      

        catch(err) {
            res.status(200).json({
                success: false,
                message: "The Link is Invalid/expired"
            })
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            message: "error while resetting the password"
        })
    }
}
//get wishlist
exports.getWishlist=async(req,res)=>{
    try{
        const {id}=req.user;
        const findUser=await User.findById(id).populate('wishList');
        
        res.status(200).json({
            success: true,
            message: ` wishList fetched  Successfully`,
            findUser,
        });


    }
catch(err){
    console.error(err);
    res.status(400).json({
        success: false,
        message: "error while getting the wishlist "
    })

} 
}

//user cart functionality
exports.userCart=async(req,res)=>{
    try{
        console.log("req.body")
        console.log(req.body)
        console.log("req.user")
        console.log(req.user)
        const {productId,color,amount,price}=req.body;
        const {id}=req.user;
        console.log("id")
        console.log(id)
        validateMongoDbId(id);
        let newCart=await new Cart({
            userId:id,
            productId,
            color,
            price,
            amount,
        }).save();

         res.status(200).json({
            success: true,
            message: ` Item Added to cart Successfully`,
            newCart,
        });


    }
    catch(err){
        console.error(err);
        
        res.status(400).json({
            success: false,
            message: "error while adding to  the cart ",
        })
    

    }
}

exports.getUserCart=async(req,res)=>{
    try{
       
        console.log("req.user")
        console.log(req.user)
        
        const {id}=req.user;
        validateMongoDbId(id);
        
        const cart=await Cart.find({userId:id}).populate('productId').populate("color");
        res.status(200).json({
            success: true,
            message: ` Cart items fetched Successfully`,
            cart,

            
        });


    }catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "error while fetching the cart items ",
        })
    

    }
}

exports.removeProductFromCart=async(req,res)=>{
    try{
        const {id}=req.user;
        const {cartItemId}=req.params;
        console.log('id')
        console.log(id)
        validateMongoDbId(id);
        const deleteProductFromCart=await Cart.deleteOne({userId:id,_id:cartItemId})
        res.status(200).json({
            success: true,
            message: ` Cart items deleted Successfully`,
            deleteProductFromCart,

            
        });

    }catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "error while deleting the cart items ",
        })
    }
}

exports.updateProductQuantityFromCart=async(req,res)=>{
    try{
        const {id}=req.user;
        const {cartItemId,newQuantity}=req.params;
        validateMongoDbId(id);
        const cartItem=await Cart.deleteOne({userId:id,_id:cartItemId})
        cartItem.quantity=newQuantity;
        cartItem.save();
        res.status(200).json({
            success: true,
            message: ` Cart item Quantity updated Successfully`,
            cartItem,

            
        });

    }catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "error while updating the cart item ",
        })

    }
}

exports.createOrder=async()=>{
    try{
        const {id}=req.user;
        const {shippingInfo,orderItems,totalPrice,TotalPriceAfterDiscount,paymentInfo}=req.body;
            const order=await Order.create({
                shippingInfo,orderItems,totalPrice,TotalPriceAfterDiscount,paymentInfo,user:id
            })
            res.status(200).json({
                success: true,
                message: ` Order Placed Successfully`,
                order,
    
                
            });
            

    }catch(err){
        res.status(400).json({
            success: false,
            message: "Error while Placing the order ",
        })


    }

}



exports.emptyCart=async(req,res)=>{
    try{
        const {id}=req.user;
        validateMongoDbId(id);
        console.log("id",id)
        
        const user=await User.findOne({ _id: id });
        const cart=await Cart.findOneAndRemove({orderBy:user.id})
        res.status(200).json({
            success: true,
            message: ` Cart items emptied Successfully`,
            cart,

            
        });


    }catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "error while empting the cart  ",
        })
    

    }
}
exports.applyCoupon=async(req,res)=>{
    try{
        const {coupon}=req.body;
        const validCoupon =await Coupon.findOne({name:coupon});
        const {id}=req.user;
        validateMongoDbId(id);

        if(validCoupon===null){
            res.status(400).json({
                success: false,
                message: "Invalid coupon  ",
            })
        }
        const user=await User.findOne({_id:id});
        let {products,cartTotal}=await Cart.findOne({orderBy:user.id}).populate('products.product');
        let totalAfterDiscount=(cartTotal-(cartTotal * validCoupon.discount)/100).toFixed(2);
        const finalAfterDiscount=await Cart.findOneAndUpdate({orderBy:user.id},
            {
                totalAfterDiscount,

            },{
                new:true
            })


        res.status(200).json({
            success: true,
            message: ` Coupon applied Successfully`,
            totalAfterDiscount,
            finalAfterDiscount,

        });
 }
 catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Error while applying the coupon  ",
        })
    

    }
}

// exports.createOrder=async(req,res)=>{
//     try{
//         const {COD,couponApplied}=req.body;
//         const {id}=req.user;
//         validateMongoDbId(id);
//         if(!COD){
//             return res.json({
//                 message:"Create Cash Order failed"
//             })
//         }
//         const user=await User.findById(id);
//         let userCart=await Cart.findOne({orderBy:user.id});
//         let finalAmount=0;
//         if(couponApplied && userCart.totalAfterDiscount){
//             finalAmount=userCart.totalAfterDiscount;
//         }
//         else{
//             finalAmount=userCart.cartTotal;
//         }

//         let newOrder=await new Order({
//             products:userCart.products,
//             paymentIntent:{
//                 id:uniqid(),
//                 method:"COD",
//                 amount:finalAmount,
//                 status:"Cash on Delivery",
//                 created:Date.now(),
//                 currency:"INR",
//             },
//             orderBy:user.id,
//             orderStatus:"Cash on Delivery"

//         }).save();

//         let update=userCart.products.map((item)=>{
//             return {
//                 updateOne:{
//                     filter:{_id: item.product._id},
//                     update:{$inc:{quantity:-item.count, sold:+item.count}}
//                 }
//             }
//         })
         
//         const updated=await Product.bulkWrite(update,{});

//         res.status(200).json({
//             success: true,
//             message: ` Order  Successfully Placed`,
//             newOrder,
            

//         });



//     }catch(err){
//         console.error(err);
//         res.status(400).json({
//             success: false,
//             message: "Error while ordering  ",
//         })
        
    

//     }
// }
exports.getOrders=async(req,res)=>{
    try{
        const {id}=req.user;
        validateMongoDbId(id);
        const userOrders=await orderModel.findOne({orderBy:id}).populate('products.product').populate("orderBy").populate("paymentIntent").exec();

        res.status(200).json({
            success: true,
            message: ` Orders  fetched Successfully`,
            userOrders,
            

        });


    }catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Error while fetching the orders  ",
        })

    }
}
exports.getAllOrders=async(req,res)=>{
    try{
       
      
        const allOrders=await orderModel.find().populate('products.product').populate("orderBy").exec();

        res.status(200).json({
            success: true,
            message: `All Orders  fetched Successfully`,
            allOrders,
            

        });


    }catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Error while fetching the orders  ",
        })

    }
}
exports.getOrderByUserId=async(req,res)=>{
    try{
        const {id}=req.params;
        validateMongoDbId(id);
        const userOrders=await orderModel.findOne({orderBy:id}).populate('products.product').populate("orderBy").populate("paymentIntent").exec();

        res.status(200).json({
            success: true,
            message: ` Orders  fetched Successfully`,
            userOrders,
            

        });


    }catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Error while fetching the orders  ",
        })

    }
 
}

exports.updateOrderStatus=async(req,res)=>{
    try{
        const {status}=req.body;
        const {id}=req.params;
        validateMongoDbId(id);
        const updatedOrder=await Order.findByIdAndUpdate(id,{
            orderStatus:status,
            paymentIntent:{
                status:status,
            },
            
        },{
            new:true
        })
        res.status(200).json({
            success: true,
            message: ` Orders  updated Successfully`,
            updatedOrder,
            

        });

    }catch(err){
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Error while Updating the order  ",
        })


    }
}



