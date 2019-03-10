const database = require('./mongoose');


module.exports = (userId) => {
    database.Bill.updateMany({}, {createdBy: userId}, {upsert: true}, (err, doc) => {
        if (err) {
            return console.log(err);            
        }
        console.log(doc);
        
    });
}