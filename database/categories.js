const database = require("./mongoose");

const catAll = (
  year,
  month,
  category,
  sortByLeft,
  incDecLeft,
  sortByRight,
  incDecRight,
  userId,
  cb = () => {}
) => {
  return new Promise((resolve, reject) => {
    let k = database.Bill.aggregate([
      {
        $match: { createdBy: userId }
      },
      {
        $project: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          _id: -1,
          item: 1,
          date: 1,
          category: 1,
          price: 1,
          qty: 1
        }
      },
      {
        $match: { category, month }
      },
      {
        $facet: {
          items: [
            {
              $group: {
                _id: { item: "$item" },
                total: { $sum: "$price" },
                totalQt: { $sum: "$qty" }
              }
            },
            {
              $sort: { [sortByLeft]: incDecLeft }
            }
          ],
          all: [
            {
              $group: {
                _id: {
                  all: "$item",
                  price: "$price",
                  qty: "$qty",
                  day: { $dayOfMonth: "$date" }
                }
              }
            },
            {
              $sort: { [sortByRight]: incDecRight }
            }
          ]
        }
      }
    ]);

    resolve(k);
  });
};

module.exports = {
  catAll
};
