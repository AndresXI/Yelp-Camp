var express = require("express"),
 app = express(),
 bodyParser = require("body-parser"),
 mongoose = require("mongoose"),
 Campground = require('./models/campground.js'),
 Comment = require("./models/comment.js"),
 seedDB = require("./seeds.js");

 //connects to database
mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public")); //used to get public/css
//removes all campgrounds
seedDB();

//landing page
app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX-campgrounds page
app.get("/campgrounds", function(req, res) {
  //get all campgrounds from DBs
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

//NEW-show the form to submit a new campground
app.get("/campgrounds/new", function(req, res) {
  res.render('campgrounds/new');
})

//CREATE-adding a new campground to databse
app.post("/campgrounds", function(req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  //create a new campground and save to data base
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      //reidrect back to campgrounds page
      res.redirect("/campgrounds"); //default reidrect is a get request
    }
  });
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
  //find the campmground with provided ID
  //foundCampgrounds should now have comments
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      //render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

//==============================
//COMMENTS ROUTE
//++++++++++++++++++++++++++++++

app.get("/campgrounds/:id/comments/new", function(req, res){
  //find campground by ID to sent it the comments/new.ejs file
  var campID = req.params.id;
  Campground.findById(campID, function(err, campground){
    if(err){
      console.lof(err);
    } else{
      res.render("comments/new", {campground: campground});
    }
  });
});
//POST ROUTE
app.post("/campgrounds/:id/comments", function(req, res){
  //look up campgrounds using id
  var campID = req.params.id;
  Campground.findById(campID, function(err, campground){
    if(err) {
      console.log(err);
      redirect("/campgrounds");
    } else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
  //create new comment
  //connect new comment to campground
  //redirect back to selected campground
})
app.listen(3000, function() {
  console.log("listen to port 3000");
});
