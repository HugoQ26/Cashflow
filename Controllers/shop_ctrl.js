// const mongoose = require('mongoose')
const database = require('../database/mongoose');
const mainPage = require('../database/index');
const catChoose = require('../database/categories');

const homePage = (req, res) => {

    const info = (async () => {

        try {
          //let categories = await mainPage.catNames();
          let bill = await mainPage.bill();
          //let year = await mainPage.monthAndYear(bill);
          let all = await mainPage.allDataSorted(bill);
          //let math = await mainPage.math(all);
          let catcat = await mainPage.catcat();
          //console.log(catcat[0].total);
          


          res.render('index', {
              title: 'Bills',
              added: req.session.added,
              all,
              mths: mainPage.monthsNames
          });

        } catch (error) {
            console.log(error);
        }

    })();



}


const addItemGet = (req, res) => {

    const info = (async () => {

        let monthNo = req.session.month;
        let category = req.session.category;



        try {

            let names = await database.itemsNames();
            let categories = await database.catNames();
            let all = await database.all();
            let month = await database.getMonth(monthNo, category);
            let calc = await database.calc(month);
            let added = await req.session.added;
            let check = await database.check();
            let catcat = await mainPage.catcat();

            const itemsNames = catcat[0].items;
            let catNa = [];
            let dupa = {...catcat[0].categories};
            let {cat} = dupa
            for(let i of catcat[0].categories) {
                catNa.push(i._id.cat);

            }
            //let catcatcat = [...catcat[0].categories._id.cat]
            //console.log(catcat[0].items);
            //console.log(dupa);




            res.render('add_item', {
                //isLogin: req.session.isLogin,
                categories,
                itemsNames,
                all,
                title: 'Add Item',
                monthNo,
                category,
                sum: calc,
                month,
                added: added
            });

        } catch (error) {
            console.log(error);
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
        console.log(req.body);
        
        req.session.added = {
          item, qty, category, date, price, addedDate: new Date().toLocaleDateString()
        };
        database.saveBill(item, qty, category, date, price, owner);
        req.session.save(err => {
          console.log(err);
          res.redirect('/additem');
        })
}

const filterItems = (req, res) => {

    req.session.month = req.body.month;
    req.session.category = req.body.category;
    req.session.save(err => {
      console.log(err);
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
            
            //let categories = await catChoose.cat(year, month+1, category, sort.sortByLeft, sort.incDecLeft);
            let categories2 = await catChoose.catAll(year, month+1, category, sort.sortByLeft, sort.incDecLeft, sort.sortByRight, sort.incDecRight);
            //console.log(categories);
            
            console.log(categories2[0]);

            
            

            res.render('categories', {
                title: 'Category',
                path: req.path,
                year,
                month: mainPage.monthsNames[month],
                category,
                all: categories2[0]
                
            });
            
        } catch (error) {
            console.log(error);
        }

    })();



    
}


module.exports = {
    homePage,
    addItemGet,
    addItemPost,
    filterItems,
    category
};
