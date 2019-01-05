var   express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override'),
      seedDB = require('./seeds.js'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      flash = require('connect-flash'),
      // MODEL config   
      Campground = require('./models/campground.js'),
      Comment = require('./models/comment.js'),
      User = require('./models/user.js')

// requiring ROUTES
var campgroundRoutes = require("./routes/campgrounds.js"),
    commentRoutes = require("./routes/comments.js"),
    indexRoutes = require("./routes/index.js")

// Connecting to database for Yelpcamp 
var databaseURL = process.env.DATABASEURL || 'mongodb://localhost:27017/yelpcamp'
mongoose.connect(databaseURL, { useNewUrlParser: true });


// Turns request's body into an object to be manipulated
app.use(bodyParser.urlencoded({extended: true}));
// Tells express to expect ejs files in views
app.set('view engine', 'ejs');
// Tells express to look in public directory
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
// usage of passport
var secretcode = process.env.SECRET || "0ccczzz12asd983dfa1189"
app.use(require('express-session')({
    secret: secretcode,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// APP CONFIG
// middleware that will be ran for every route to include certain variables in templates
app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Using routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);
// seeding Database
// seedDB();

// ========================================================

// Starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Yelpcamp server has started.')
});