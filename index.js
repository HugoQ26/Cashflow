const http = require('http');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const csrf = require('csurf');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const credentials = require('./credentials.js');


// const sessionStoreUri = process.env.SESION_STORE_URI;
// const sessionCollection = process.env.SESSION_STORE_COLLECTION;
// const sessionSecret = process.env.SESSION_SECRET;
// const mongoDbUri = process.env.MONGO_URI;

const sessionStoreUri = process.env.SESION_STORE_URI || credentials.SESION_STORE_URI ;
const sessionCollection = process.env.SESSION_STORE_COLLECTION || credentials.SESSION_STORE_COLLECTION;
const sessionSecret = process.env.SESSION_SECRET || credentials.SESSION_SECRET;
const mongoDbUri = process.env.MONGO_URI || credentials.MONGO_URI;

const csrfProtection = csrf();
 
var store = new MongoDBStore({
    uri: sessionStoreUri,
    collection: sessionCollection
  });

store.on('error', function(error) {
console.log(error);
});


const server = http.createServer(app);
const index_router = require('./Routes/index');
const error_page = require('./Routes/404');

app.use(helmet());
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: sessionSecret,
    cookie: { maxAge: 1000 * 60 * 60 * 12},
    resave: false,
    saveUninitialized: false,
    store: store,
    name:'sessionId'
}));
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next)=>{
    res.locals.isLogin = req.session.isLogin
    res.locals.csrfToken = req.csrfToken()
    next();
})


app.use(index_router);
app.use(error_page);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
    mongoose.connect(mongoDbUri, {useNewUrlParser: true}, (err) => {
        if (err) {
            throw err;            
        }
        console.log('Connected to database');         
    })
    
    
})
