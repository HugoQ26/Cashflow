const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date
})


let User = mongoose.model('User', user);


const saveUser = (email, password) => {
    const user = new User({email, password});
    user.save((err, user) => {
        if(err) return console.error(err);
        console.log('User saved to Db', user); 
    })
      
}

module.exports = {
    saveUser,
    User
}