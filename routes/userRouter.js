const express=require('express');
const router=express.Router();

const{
    registerForm,
    register,
    loginForm,
    login,
    //passReset
}=require('../controllers/userController');

router.get('/register',registerForm);
router.get('/login',loginForm);
//router.get('/reset-password',passReset);

router.post('/signup',register);
router.post('/signin',login);

module.exports=router;

