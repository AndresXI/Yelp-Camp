var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   flash = require("connect-flash"),
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

 //connects to local database
mongoose.connect(process.env.DATABASEURL, { useMongoClient: true });
mongoose.connect(process.env.databaseURL, { useMongoClient: true });
//mongo lab database
//mongoose.connect('mongodb://andres:Barcelona10@ds061288.mlab.com:61288/yelp_camp', { useMongoClient: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("public")); //used to get public/css
app.use(flash());
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
  //comes from passpart js
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

// //used for heroku servers
// app.listen(process.env.PORT, process.env.IP, function () {
//     console.log("Server running!");
// });

//used for out local server
app.listen(3000, function() {
  console.log("listen to port 3000");
});
