const database = require('../database/mongoose');
const auth = require('../database/usersDb');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {        
        api_key: process.env.SEND_GRID_APIKEY        
    }
}));

const signup_get = (req, res) => {
    res.render('signup', {
        duplicateEmail: req.session.duplicateEmail,
        passwordsMismatch: req.session.passwordsMismatch
    })
    req.session.duplicateEmail = false,
    req.session.passwordsMismatch = false
    req.session.save();
}
const signup_post = (req, res) => {

    const {email, password, confirmPassword} = req.body;
    auth.User.find({email}, (err, doc) => {
        if(err) return console.error(err);
        if(doc.length) {
            console.log('User already exist in Db');
            req.session.duplicateEmail = true;
            req.session.save(err => {                    
                res.redirect('/signup');                                    
            })
        } else {
            if(password != confirmPassword) {
                console.log('Hasło nie zgadza sie z dupliatem');
                req.session.passwordsMismatch = true;
                req.session.save(err => {                    
                    res.redirect('/signup');                                    
                })
            } else {
                bcrypt.hash(password, 12, (err, hash) => {
                    auth.saveUser(email, hash);
                    //req.session.isLogin = true;
                    transporter.sendMail({
                        to: 'mkubiak73@gmail.com',
                        from: 'cashflow@martin.pl',
                        subject: 'Signup succeeded',
                        html: '<b>Awesome sauce</b>'
                    }).then((result) => {
                        console.log(result);
                        
                    });
                    req.session.save(err => {
                      console.log(err);
                      res.redirect('/');
                    })
                });
            }
        }
    })
}

const loginGet = (req, res) => {
    res.render('login', {
        title: 'Login',
        //wrongPass: req.flash('password'),
        wrongPass: req.session.wrongPassword,
        wrongEmail: req.session.wrongEmail,
        mailSend: req.session.mailSend
    })
    req.session.wrongPassword = false;
    req.session.wrongEmail = false;
    req.session.mailSend = false;
    req.session.save();
}

const loginPost = (req, res) => {
    const {email, password} = req.body;
    auth.User.findOne({email}, (err, user) => {
        if(user) {
            bcrypt.compare(password, user.password).then((passMatch)=>{
              if(passMatch) {
                console.log(`${email} is loged`);
                req.session.isLogin = true;
                req.session.user = user;
                req.session.save(err => {
                  console.log(err);
                  res.redirect('/');
                })

              } else {
                console.log('Wrong password');
                req.session.wrongPassword = true;
                req.session.save(err => {                    
                    res.redirect('/login');                    
                  })
              }

            }).catch((err)=>{
              console.log(err);
              console.log('Something went wrong');
              res.redirect('/login')
            })
        } else {
            // console.log('User does Not exist');
            req.session.wrongEmail = true;            
            req.session.save(err => {
                res.redirect('/login')                                   
              })
        }
    })
}

const logoutGet = (req, res) => {
    req.session.destroy(function(err) {
        console.log('User sucessfully logout');
        res.redirect('/');
    })


}

const remindPasswordGet = (req, res) => {
    res.render('passwordrecover', {
        title: 'Password recover',
        noUser: req.session.noUser        
    })
    req.session.noUser = false;
    req.session.save();
}

const remindPasswordPost = (req, res) => {
    const {email} = req.body;
    crypto.randomBytes(32,(err, buffer) => {
        if(err) {
            console.log(err);            
            return res.redirect('/passwordrecover');
        }
        const token = buffer.toString('hex');

        (async () => {
            try {
                const user = await auth.User.findOne({email});                
                if(!user) {
                    console.log('No such a user');
                    req.session.noUser = true;
                    return req.session.save(err => {
                        res.redirect('/passwordrecover'); 
                    })
                } else {                    
                    // console.log(user);
                        
                    user.resetToken = token;
                    user.resetTokenExpiration = Date.now() + (1000*60*60);
                    user.save((err) => {                    
                            if (err) {
                                return console.log(err);                            
                            }
                            req.session.mailSend = true;
                            req.session.save((err) => {
                                res.redirect('/');
                            })
                            transporter.sendMail({
                                to: email,
                                from: 'cashflow@martin.pl',
                                subject: 'Password reset',
                                html: `
                                    <p>You requested a password reset</p>
                                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                                    `
                            })
                    });

                }
                
            } catch (error) {
                console.log(error);                
            }
        })();
    });
}

const newPassGet = (req, res) => {
    const {resetToken} = req.params;
    const dateNow = Date.now();    

    (async () => {
        try {
            const user = await auth.User.findOne({resetToken, resetTokenExpiration: {$gt: Date.now()}});                
            if(!user) {
                console.log('No such a token or time expired');
                return res.redirect('/passwordrecover');                
            }            
            
            console.log('Okey');
                res.render('new_password', {
                    title: 'New password',
                    email: user.email,
                    resetToken
                })
            
                
                
            
            
        } catch (error) {
            console.log(error);                
        }
    })();
}

const newPassPost = (req, res) => {
    const {email, resetToken, newPassword, confirmNewPassword} = req.body;

    auth.User.findOne({email, resetToken, resetTokenExpiration: {$gt: Date.now()}}, (err, user) => {
        if(err) return console.error(err);
        if(user) {
            console.log('We are about to change a password');            
        
            if(newPassword != confirmNewPassword) {
                console.log('Hasło nie zgadza sie z dupliatem');
                return res.redirect(`/reset/${resetToken}`);
            } else {
                bcrypt.hash(newPassword, 12, (err, hashedPassword) => {
                    if(err) {
                        console.log('hashed password error');
                        return res.redirect(`/reset/${resetToken}`)
                        
                    }
                    user.password = hashedPassword;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    user.save();                    
                    transporter.sendMail({
                        to: email,
                        from: 'cashflow@martin.pl',
                        subject: 'New password',
                        html: '<b>You successfully changed your password</b>'
                    }).then((result) => {
                        console.log(result);
                        
                    });                    
                    console.log('All good - prepare to login');
                    res.redirect('/login');
                      
                });
            }
        }
    })


}


module.exports = {
    signup_get,
    signup_post,
    loginGet,
    loginPost,
    logoutGet,
    remindPasswordGet,
    remindPasswordPost,
    newPassGet,
    newPassPost
}
