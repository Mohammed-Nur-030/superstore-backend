const express=require('express');
const router= express.Router();

const {signup,login,getAllUsers,getUser,deleteUser,updateUser,blockUser,unblockUser,logout,forgetPassword,resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders,getAllOrders, updateOrderStatus,getOrderByUserId,
    updateProductQuantityFromCart,
    removeProductFromCart}=require('../controllers/Auth');
const {authMiddleware,isAdmin}=require('../middlewares/authMiddleware');
const { checkout, paymentVerification } = require('../controllers/Payment');

router.post('/signup',signup);
router.post('/login',login);
router.post('/admin-login',loginAdmin);
router.post('/add-to-cart',authMiddleware,userCart);
router.get('/get-cart-items',authMiddleware,getUserCart);
router.delete('/empty-cart-items',authMiddleware,emptyCart);
router.delete('/delete-cart-item/:cartItemId',authMiddleware,removeProductFromCart);
router.delete('/update-product-cart/:cartItemId/:newQuantity',authMiddleware,updateProductQuantityFromCart);

router.post("/cart/apply-coupon",authMiddleware,applyCoupon);
router.post("/cart/create-order",authMiddleware,createOrder);
router.get("/order/get-orders",authMiddleware,getOrders);
router.get("/order/get-all-orders",authMiddleware,isAdmin,getAllOrders);

// router.post('/order/checkout',authMiddleware,checkout);
// router.post('/order/paymenyVerification',authMiddleware,paymentVerification);




router.get("/order/get-orderby-user/:id",authMiddleware,isAdmin,getOrderByUserId);

router.put("/order/update-order-status/:id",authMiddleware,isAdmin,updateOrderStatus);


router.get('/all-users',authMiddleware,isAdmin,getAllUsers);
router.get('/get-wishlist',authMiddleware, getWishlist);
router.post('/forget-password',forgetPassword);
router.put('/reset-password/:token',resetPassword);
router.get('/:id',authMiddleware,isAdmin,getUser);
router.delete('/:id',deleteUser);
router.put('/update-user',authMiddleware,updateUser);
router.put('/save-address',authMiddleware,saveAddress);
router.put('/block-user/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);
router.post('/logout', authMiddleware, logout);



module.exports=router;