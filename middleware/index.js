// all middlewares go here
var middlewareObj = {};
var Campground = require('../models/campground.js');
var Comment = require("../models/comment.js");

middlewareObj.checkCommentOwnership = function(req, res, next){
  //middleware authorization

    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          res.redirect("back")
        } else {
          //does the user own the comment?
          console.log(req.params.comment_id);
          console.log(foundComment);
          if(foundComment.author.id.equals(req.user._id)) {
            //continue with the rest of the parent function (route handler)
              next();
          } else {
            req.flash("error", "You dont have permmission to do that"); 
            res.redirect("back");
          }
        }
      });

    } else {
      req.flash("error", "You need to be logged in to that");
      res.redirect("back");
    }
  }



middlewareObj.checkCampgroundOwnership = function(req, res, next){
  //middleware authorization

    if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
          req.flash("error", "Campground not found");
          res.redirect("back")
        } else {
          //check if author id mathces the logged in user id
          //req.user._id, is a string
          //foundCampground.author.id, is a mongoose Object not a string
          if(foundCampground.author.id.equals(req.user._id)) {
            //continue with the rest of the parent function
              next();
          } else {
            req.flash("error", "You don't have permmission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that")
      res.redirect("back");
    }
  }

  middlewareObj.isLoggedIn = function(req, res, next) {
    //middleware function
      if(req.isAuthenticated()){
        return next();
      }
      req.flash("error", "Please log in first");
      res.redirect("/login");
    }

module.exports = middlewareObj
