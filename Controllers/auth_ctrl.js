const database = require('../database/mongoose');
const auth = require('../database/usersDb');
var bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const credentials = require('../credentials.js');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {        
        api_key: process.env.SEND_GRID_APIKEY
        // api_key: process.env.SEND_GRID_APIKEY || credentials.SEND_GRID_APIKEY
    }
}));

const signup_get = (req, res) => {
    res.render('signup', {
        //isLogin: req.session.isLogin,
    })
}
const signup_post = (req, res) => {

    const {email, password, confirmPassword} = req.body;
    auth.User.find({email}, (err, doc) => {
        if(err) return console.error(err);
        if(doc.length) {
            console.log('User already exist in Db');
            res.redirect('/signup')
        } else {
            if(password != confirmPassword) {
                console.log('Hasło nie zgadza sie z dupliatem');
                res.redirect('/signup')
            } else {
                bcrypt.hash(password, 12, (err, hash) => {
                    auth.saveUser(email, hash);
                    req.session.isLogin = true;
                    transporter.sendMail({
                        to: 'mkubiak73@gmail.com',
                        from: 'cashflow@martin.pl',
                        subject: 'Signup succeeded',
                        body: `<h1> Noto dupa zbita</h1>`
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
        wrongPass: req.flash('password'),
        wrongEmail: req.flash('user')
    })
}

const loginPost = (req, res) => {
    const {email, password} = req.body;
    auth.User.findOne({email}, (err, doc) => {
        if(doc) {
            bcrypt.compare(password, doc.password).then((passMatch)=>{
              if(passMatch) {
                console.log(`${email} is loged`);
                req.session.isLogin = true;
                req.session.save(err => {
                  console.log(err);
                  res.redirect('/');
                })

              } else {
                console.log('Wrong password');
                req.flash('password', 'Ivalid password');
                res.redirect('/login');
              }

            }).catch((err)=>{
              console.log(err);
              console.log('Wrong password');
              res.redirect('/login')
            })
        } else {
            console.log('User does Not exist');
            req.flash('user', 'Ivalid user email');
            res.redirect('/login')
        }
    })
}

const logoutGet = (req, res) => {
    req.session.destroy(function(err) {
        console.log('User sucessfully logout');
        res.redirect('/');
    })


}

module.exports = {
    signup_get,
    signup_post,
    loginGet,
    loginPost,
    logoutGet
}
