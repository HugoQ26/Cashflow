const database = require('./mongoose');

module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        let itemsDb = database.Bill.aggregate([
            
            {
                $match: {createdBy: userId}
            },
            {
                $project: {month: {$month: "$date"},year: {$year: "$date"}, day: {$dayOfMonth: "$date"}, item: 1, date: 1, category: 1, price: 1, qty: 1, owner: 1}
            },
            {   $facet: 
                {
                    items: [
                        {
                            $group: {
                                _id: "$item"
                            }                            
                        },                        
                        {
                            $sort: {"_id": 1}
                        }
                    ],
                    categories: [
                        {
                            $group: {
                                _id: "$category"
                            }                            
                        },
                        {
                            $sort: {"_id": 1}
                        }
                    ],
                    lastFiveAdded: [
                        {
                            $group: {
                                _id: {day: "$day", month: "$month",item: "$item", id: "$_id", qty: "$qty", price: "$price", category: "$category"}
                            }                            
                        },
                        {
                            $sort: {"_id.id": -1}
                        },
                        {
                            $limit: 5
                        }
                    ]  
                }     
            } 
        ])
        resolve(itemsDb);
    })
}

