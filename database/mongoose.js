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
    }
})

const category = new Schema({
    category: String
})

let Bill = mongoose.model('Bill', item);
let Cat = mongoose.model('Category', category);

const saveBill = (item, qty, category, date, price, owner) => {
    Bill.create({ item, qty, category, date, price, owner }, function (err, item) {
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

// const itemsNames = () => {
//     return new Promise((resolve, reject) => {
//         Bill.find({}, {item: 1, _id: 0}, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 const items = new Set();
//                 for(let i of data) {
//                     items.add(i.item);
//                 }                
//                 resolve([...items]);                
//             }
//         })
//     });
// }

// const catNames = () => {
//     return new Promise((resolve, reject) => {
//         Cat.find({}, {category: 1, _id: 0}, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 const items = new Set();
//                 for(let i of data) {
//                     items.add(i.category);
//                 }  
//                 resolve([...items]);                
//             }
//         })
//     });
// }

// const all = () => {
//     return new Promise((resolve, reject) => {
//         Bill.find({}).sort("-_id").limit(4).exec((err, data) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(data);
//             }
//         })
        
//     })
// }

// const getMonth = (month, category) => {
//     return new Promise((resolve, reject) => {

//         Bill.find({category: category})
//         .where('date').gt(`new Date(2019, ${month}), 1`).lt(`new Date(2019, ${month}), 1`)
//         .exec((err, data) => {
//             if (err) {
//                 reject(err)
//             } else {                
//                 resolve(data);
//                 return data;
//             }
//         })
        
//     })
// }

// const calc = (getMonth) => {
//     return new Promise((resolve, reject) => {
//         let sum = 0;
//         for(let i of getMonth) {
//             sum += (i.qty * i.price);            
//         }
//         console.log(sum);
        
//         resolve(sum);
//     });
// }



module.exports = {
    Bill,
    Cat,
    saveBill
    // itemsNames,
    // catNames,
    // all,
    // getMonth,
    // calc,
    // check
}