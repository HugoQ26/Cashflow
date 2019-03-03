const database = require('./mongoose');

module.exports = () => {
    return new Promise((resolve, reject) => {
        let k = database.Bill.aggregate([
            
            {
                $project: {month: {$month: "$date"},year: {$year: "$date"}, _id: -1, item: 1, date: 1, category: 1, price: 1, qty: 1, owner: 1}
            },
            // {
            //     $match: {category, month}
            // },
            {
                $group: {
                    _id: {month: "$month", category: "$category", year: "$year"},                    
                    total: {$sum: "$price"}
                    // totalQt: {$sum: "$qty"}
                    
                }                          
            },
            {
                $sort: {"_id.month": 1, "total": -1} 
            },
            {
                $group: {
                    _id: {month: "$_id.month", year: "$_id.year"},
                    total: {
                        $push: { 
                            category:"$_id.category",                            
                            totalSum:"$total"
                            // totalQt:"$totalQt"
                        }
                    }
                }                          
            },
            
            
            
        ])
        
        resolve(k);
    })
}
