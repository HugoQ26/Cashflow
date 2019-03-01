const database = require('./mongoose');


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
// }  sortBy, incDec, 
const cat = (year, month, category, sortBy, incDec, cb = () => {}) => {

    return new Promise((resolve, reject) => {
        let all = database.Bill.aggregate([           
            
            {
                $project: {month: {$month: "$date"},year: {$year: "$date"}, _id: -1, item: 1, date: 1, category: 1, price: 1, qty: 1}
            },
            {
                $match: {category, month}
            },          
            {
                $group: {
                    _id: {item: "$item"},                    
                    total: {$sum: "$price"},
                    totalQt: {$sum: "$qty"}         
                }
            },            
            {
                $sort: {[sortBy]: incDec}
            }
            
        ])       
        
        resolve(all);

    })

}

const catAll = (year, month, category, sortByLeft, incDecLeft, sortByRight, incDecRight, cb = () => {}) => {
    return new Promise((resolve, reject) => {
        let k = database.Bill.aggregate([
            
            {
                $project: {month: {$month: "$date"},year: {$year: "$date"}, _id: -1, item: 1, date: 1, category: 1, price: 1, qty: 1}
            },
            {
                $match: {category, month}
            },
            {   $facet: 
                {
                    items: [
                        {
                            $group: {
                                _id: {item: "$item"},                    
                                total: {$sum: "$price"},
                                totalQt: {$sum: "$qty"}
                            }                          
                        },
                        {
                            $sort: {[sortByLeft]: incDecLeft}
                        }
                    ],
                    all: [
                        {
                            $group: {
                                _id: { all: "$item", price: "$price", qty: "$qty", day: {$dayOfMonth: "$date"}}
                            }                            
                        },
                        {
                            $sort: {[sortByRight]: incDecRight}
                        }
                    ]
                }     
            }
            
            
        ])
        
        resolve(k);
    })
}


module.exports = {
    cat,
    catAll
    

}