var express = require("express");
var router = express.Router();
var Campground = require('../models/campground.js');


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
router.get("/new", function(req, res) {
  res.render('campgrounds/new');
})

//CREATE-adding a new campground to databse
router.post("/", function(req, res) {
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

module.exports = router;
