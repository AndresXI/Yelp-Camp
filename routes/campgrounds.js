var express = require("express");
var router = express.Router();
var Campground = require('../models/campground.js');
var middleware = require('../middleware/index.js')


//INDEX-campgrounds page
router.get("/", function(req, res) {
  //get all campgrounds from DBs
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds,});
    }
  });
});


//NEW-show the form to submit a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
})


//CREATE-adding a new campground to databse
router.post("/", middleware.isLoggedIn, function(req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name: name, price: price, image: image, description: description, author: author};
  //create a new campground and save to data base
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      //reidrect back to campgrounds page
      console.log(newlyCreated);
      res.redirect("/campgrounds"); //default reidrect is a get request
    }
  });
});


//SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
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


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});
    });
});


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  //find and update the correct campground
  var campId = req.params.id;
  var campgroundData = req.body.campground;
  Campground.findByIdAndUpdate(campId, campgroundData, function(err, updatedCampground){
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + campId);
    }
  });
});


//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
})


module.exports = router;
