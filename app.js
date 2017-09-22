var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   passport = require("passport"),
   LocalStrategy = require("passport-local"),
   Campground = require('./models/campground.js'),
   methodOverride = require("method-override"),
   Comment = require("./models/comment.js"),
   User = require("./models/user"),
   seedDB = require("./seeds.js");
//requiring routes
var commentRoutes = require('./routes/comments.js'),
    campgroundRoutes = require('./routes/campgrounds.js'),
    indexRoutes = require('./routes/index.js');

 //connects to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("public")); //used to get public/css
//removes all campgrounds, seeding the database
//seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: "this is the secret key",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.session());
//middleware that runs for every single route
app.use(function(req, res, next){
  //req.user contains the id and username of the current user
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(3000, function() {
  console.log("listen to port 3000");
});
