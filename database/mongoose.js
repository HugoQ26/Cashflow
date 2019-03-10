const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const item = new Schema({
    item: String,
    qty: Number,
    price: Number,
    category: String,
    owner: String,
    date: {
        type: Date,
    },
    createdBy: Schema.Types.ObjectId
})

const category = new Schema({
    category: String
})

let Bill = mongoose.model('Bill', item);
let Cat = mongoose.model('Category', category);

const saveBill = (item, qty, category, date, price, owner, createdBy) => {
    Bill.create({ item, qty, category, date, price, owner, createdBy }, function (err, item) {
        if (err) return handleError(err);
        console.log('Saved', item);
        
      });
    Cat.findOneAndUpdate({category}, {category}, {upsert: true}, (err, data) => {
        if (err) {
            console.log(err);
            
        } else {
            console.log('Category save to databese');            
        }
    });    
}




module.exports = {
    Bill,
    Cat,
    saveBill
}