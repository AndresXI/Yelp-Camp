var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

//==============================
//COMMENTS ROUTE
//==============================
//node automaticallly looks in the folder views to render html templates



//comments new
router.get("/new", isLoggedIn, function(req, res){
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

//comments CREATE ROUTE
router.post("/", isLoggedIn, function(req, res){
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
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save()
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});


//Comment EDIT ROUTE
router.get("/:comments_id/edit", function(req, res){
  Comment.findById(req.params.comments_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {campgroundID: req.params.id, comment: foundComment});
    }
  });
});


//COMMENT UPDATE ROUTE
router.put("/:comment_id", function(req, res){
  campgroundID = req.params.id;
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err) {
      res.redirect('back');
    } else {
      res.redirect("/campgrounds/" + campgroundID);
    }
  });
});



//middleware function
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
