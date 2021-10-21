// url for campfinder --> https://rocky-castle-23837.herokuapp.com/
// run this code to debug heroku error --> heroku logs --tail


// code so that when website is live/production
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


// requiring all npm packages
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const Joi = require('joi')
const session = require('express-session')
const flash = require('connect-flash')
const MongoDBStore = require("connect-mongo")(session);


// for authentication
const passport = require('passport');
const passportLocal = require('passport-local')

// requiring all models
const Campground = require('./models/campground')
const Review = require('./models/reviews')
const { campgroundSchema, reviewSchema } = require('./schemaValidator.js')
const User = require('./models/user')

// splitting up routes
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

// import error handler class AppError
const ExpressError = require('./utility/expressError');

// mongo atlast db
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

// connect mongoose to mongo DB server 27017 -- mongodb://localhost:27017/yelp-camp
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch((err) => {
        console.log("MONGO ERROR: " + err)
    })

// setting up views directory
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


mongoose.set('useFindAndModify', false);
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

// setting up public directory
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.secret || 'mysecret';

// new mongo store
const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR: ", e);
})


// setting up sessions
const sessionConfig = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig));

// setting up flash
app.use(flash())


// setting up athentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()))

// guides how info is stored and retrived
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// flash middleware --> these are global vars i can use on any file
app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// adding users route
app.use('/', usersRoutes);
// implementing the campground routes
app.use('/campgrounds', campgroundRoutes)
// implementing the reviews routes
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})


// to handle async errors
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'OH NO, SOMETHING WENT WRONG'
    res.status(status).render('error', { err });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})