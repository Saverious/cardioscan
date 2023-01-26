require('dotenv').config();
const bcrypt = require('bcrypt');
const {db} = require('../utils/dbConnect');
const {logging} = require('../utils/logs');

// GET- Sign up
exports.registerForm=(req,res)=>{
    res.render('main/register',{
        title:'Register',
        message1:req.flash('invalid-username'),
        message2:req.flash('password-mismatch')
    });
}

// POST- Sign up
exports.register=(req,res)=>{
    try{
        const {uname,uemail,uphone,upass,conpass}=req.body;
        const sql='SELECT * FROM users WHERE username=?';
        
        db.query(sql,[uname],async(err,data)=>{
            if(data.length>0){
                req.flash('invalid-username','Username already taken');
                res.redirect('/register');
            }else{
                if(upass===conpass){
                    const hash=await bcrypt.hash(upass,12);
                    const sql='INSERT INTO users (username, email_address, phone_number, password) VALUES (?)';
                    const values=[uname,uemail,uphone,hash];
                    db.query(sql,[values],(err,data)=>{
                        if(err){
                            logging.error('Error while inserting records:\n',err);
                        }else{
                            logging.info('Records inserted\n');
                            req.session.user=uname;
                            req.session.save(()=>{
                                res.redirect('/');
                            })
                        }
                    });
                }else{
                    req.flash('password-mismatch','Passwords do not match');
                    res.redirect('/register');
                }
            }
        });
    }catch(err){
        logging.error('\n\n*****Error message*****\n',err);
    }
}

// GET- Login
exports.loginForm=(req,res)=>{
    res.render('main/login',{
        title:'Login',
        message1:req.flash('invalid-username2'),
        message2:req.flash('invalid-password')
    });
}

// POST- login
exports.login=(req,res)=>{
    const{uname,upass}=req.body;
    const sql='SELECT username,password FROM users WHERE username=?';
    try{
        db.query(sql,[uname],async(err,data)=>{
            if(err){
                logging.error('Error message:\n',err);
            }else{
                if(data.length>0){
                    //const hash=await bcrypthash(12,upass);
                    const user=data[0];
                    bcrypt.compare(upass,user.password,(err,result)=>{
                        if(result===true){
                            req.session.regenerate(()=>{
                                req.session.user=uname;
                                req.session.save(()=>{
                                    res.redirect('/');
                                });
                            });
                        }else{
                            req.flash('invalid-password','Password is incorrect');
                            res.redirect('/login');
                        }
                    });
                }else{
                    req.flash('invalid-username2','Invalid username');
                    res.redirect('/login');
                }
            }
        });
    }catch(err){
        logging.error('***Error message***',err);
    }
}

/*
// GET- Password reset
exports.passResetForm=(req,res,next)=>{
    res.render('main/resetpass',{
        title:'Reset Password'
    });
}*/