const database = require('./mongoose');

var _ = require('lodash');

// const catNames = () => {
//     return new Promise((resolve, reject) => {
//         database.Cat.find({}, {category: 1, _id: 0}, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 const items = new Set();
//                 for(let i of data) {
//                     items.add(i.category);
//                 }               
//                 resolve([...items]);
//                 return [...items];                
//             }
//         })
//     });
// }

const catcat = () => {
    return new Promise((resolve, reject) => {
        let k = database.Bill.aggregate([
            
            {
                $project: {month: {$month: "$date"},year: {$year: "$date"}, _id: -1, item: 1, date: 1, category: 1, price: 1, qty: 1}
            },
            {   $facet: 
                {
                    items: [
                        {
                            $group: {
                                _id: { item: "$item"}
                            }                            
                        },
                        {
                            $sort: {"_id.item": 1}
                        }
                    ],
                    categories: [
                        {
                            $group: {
                                _id: { cat: "$category"}
                            }                            
                        },
                        {
                            $sort: {"_id.cat": 1}
                        }
                    ]

                        
                }     
            },
            // {
            //     $group: {
            //         _id: {year: "$category"},                    
            //         total: {$sum: "$price"},
            //         totalQt: {$sum: "$qty"},
            //         avgPrice: {$avg: "$price"}                    
            //     }
            // },            
            {
                $sort: {total: -1}
            },
            {
                $limit: 100
            }
            
        ])
        resolve(k);
    })
}

// const catcat = () => {
//     return new Promise((resolve, reject) => {
//         let k = database.Bill.aggregate([
            
//             {
//                 $project: {month: {$month: "$date"},year: {$year: "$date"}, _id: -1, item: 1, date: 1, category: 1, price: 1, qty: 1}
//             },
//             // {
//             //     $match: {category, month}
//             // },
//             {
//                 $group: {
//                     _id: {month: "$month"},                    
//                     total: {$sum: "$price"},
//                     totalQt: {$sum: "$qty"}
                    
//                 }                          
//             },
//             {
//                 $group: {
//                     _id: "$_id.month",
//                     total: {
//                         $push: { 
//                             total:"$category",
//                             totalQt:"$totalQt"
//                         }
//                     }
//                 }                          
//             },
            
            
//         ])
        
//         resolve(k);
//     })
// }

const bill = (cb = () => {}) => {
    return new Promise((resolve, reject) => {        
        database.Bill.find({}, {_id:0, __v:0}, (err, data) => {
            if (err) {
                reject(err);
                cb(err);
            } else {                
                resolve(data);
                cb(null, data);                        
                return data;
            }
        })
    })
}

const monthAndYear = (bill, cb = () => {}) => {
    
    
    const data = [];
    return new Promise((resolve, reject) => {
        for(let i of bill) {            
            // data.push({[i.date.getMonth()]: {}, year: i.date.getFullYear()})
            data.push({month: i.date.getMonth(), year: i.date.getFullYear()})    
        }        
        const dataUniqe = _.uniqWith(data, _.isEqual);
        resolve(dataUniqe);
        return dataUniqe;
    })    
}

const monthsNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

const allDataSorted = (bill) => {    
    const result = {};
    return new Promise((resolve, reject) => {

        for(let item of bill) {           
            let month = item.date.getMonth();
            let year = item.date.getFullYear();
            let category = item.category;
            if(!result.hasOwnProperty(year)) {
                result[year] = {};
    
                if(!result[year].hasOwnProperty(month)) {
                    result[year][month] = {};
                    if (!result[year][month].hasOwnProperty(category)) {
                        result[year][month][category] = [];
                        result[year][month][category].push(item);
                    } else {
                        result[year][month][category].push(item);
                    }
                } else {
                    if (!result[year][month].hasOwnProperty(category)) {
                        result[year][month][category] = [];
                        result[year][month][category].push(item);
                    } else {
                        result[year][month][category].push(item);
                    }
                };
            } else {
                if(!result[year].hasOwnProperty(month)) {
                    result[year][month] = {};
                    if (!result[year][month].hasOwnProperty(category)) {
                        result[year][month][category] = [];
                        result[year][month][category].push(item);
                    } else {
                        result[year][month][category].push(item);
                    }
                } else {
                    if (!result[year][month].hasOwnProperty(category)) {
                        result[year][month][category] = [];
                        result[year][month][category].push(item);
                    } else {
                        result[year][month][category].push(item);
                    }
                };
            };
        }  
        resolve(result);
        return result;

    })
}

const math = (allDataSorted) => {
    let m = allDataSorted;
    // console.log(allDataSorted);
}






module.exports = {
    bill,
    // catNames,
    monthAndYear,
    allDataSorted,
    math,
    monthsNames,
    catcat
}