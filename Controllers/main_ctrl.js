// const mongoose = require('mongoose')
const database = require('../database/mongoose');
const mainPageDb = require('../database/mainPageDb');
const catChoose = require('../database/categories');
const addItemDb = require('../database/add_item_db');
const index = require('../database/index');
//const batch = require('../database/admin');


const homePage = (req, res) => {
    
    
    const info = (async () => {
        

        try {
         
          let result = await mainPageDb(req.user._id);
          

          res.render('index', {
              title: 'Bills',
              added: req.session.added,
              all: result,
              mths: index.monthsNames
          });

        } catch (error) {
            console.log(error);
        }
    })();
}


const addItemGet = (req, res) => {

    const info = (async () => {

        // let monthNo = req.session.month;
        // let category = req.session.category;



        try {   
                    
            let db = await addItemDb(req.user._id);
            const itemsNames = db[0].items;
            const categories = db[0].categories;
            const lastfiveAdded = db[0].lastFiveAdded;
            const enableDelete = req.query.enableDelete;
                        

            res.render('add_item', {                
                title: 'Add Item',
                itemsNames,
                categories,
                lastfiveAdded,
                month: index.monthsNames,
                enableDelete: false || enableDelete               
            });

        } catch (error) {
            console.error(error);
        }

    })();
}

const addItemPost = (req, res) => {

        const item = req.body.item;
        const qty = req.body.qty;
        const category = req.body.category;
        const date = req.body.date;
        const price = req.body.price;
        const owner = req.body.owner;
        const createdBy = req.user._id
        //console.log(req.body);
        
        req.session.added = {
          item, qty, category, date, price, addedDate: new Date().toLocaleDateString()
        };
        database.saveBill(item, qty, category, date, price, owner, createdBy);
        req.session.save(err => {
          console.error(err);
          res.redirect('/additem');
        })
}

const filterItems = (req, res) => {

    req.session.month = req.body.month;
    req.session.category = req.body.category;
    req.session.save(err => {
      if (err) {
        console.error(err);
      }
      res.redirect('/additem');      
    })


}

const category = (req, res) => {
    


    const info = (async () => {

        // let monthNo = req.session.month;
        // let category = req.session.category;

        try {

            const year = req.params.year;
            const month = parseInt(req.params.month,10);
            const category = req.params.category;
            const incDecLeftSwitch = parseInt(req.query.incDecLeft,10);
            const incDecRightSwitch = parseInt(req.query.incDecRight,10);
            const sort = {
                sortByLeft: req.query.sortLeft || 'total',
                incDecLeft: incDecLeftSwitch || -1,
                sortByRight: req.query.sortRight || 'total',
                incDecRight: incDecRightSwitch || -1
            } 
            console.log(sort);
            
            const userId = req.user._id;
            
            let categories2 = await catChoose.catAll(year, month+1, category, sort.sortByLeft, sort.incDecLeft, sort.sortByRight, sort.incDecRight, userId);
            //console.log(categories);
            
            //console.log(categories2[0]);

            res.render('categories', {
                title: 'Category',
                path: req.path,
                year,
                month: index.monthsNames[month],
                category,
                all: categories2[0],
                incSwitch: 1
                
            });
            
        } catch (error) {
            console.log(error);
        }

    })();
}

const deleteItemPost = (req, res) => {
    const itemId = req.body.id;
    const user = req.user._id
    database.Bill.deleteOne({_id: itemId, createdBy: user}, (err, done) => {
        if(err) {
            console.log(err);            
        } else {
            if(!done.deletedCount){
                console.log('Something went wrong');
                return res.redirect('/additem');
            }            
            console.log('Item sucessfully deleted');            
            res.redirect('/additem');
        }
    })
}

module.exports = {
    homePage,
    addItemGet,
    addItemPost,
    filterItems,
    category,
    deleteItemPost
};
