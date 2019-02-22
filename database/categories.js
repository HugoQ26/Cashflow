// const database = require('./mongoose');

// const cat = (cb = () => {}) => {
//     return new Promise((resolve, reject) => {
//         database.Cat.find({}, {_id:0, __v:0}, (err, data) => {
//             if (err) {
//                 reject(err);
//                 cb(err);
//             } else {                
//                 resolve(data);
//                 cb(null, data);
//                 console.log(data.length);
                
//                 return data;
//             }
//         })
//     })
// }

// module.exports = {
//     cat
// }