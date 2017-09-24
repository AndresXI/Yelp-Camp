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
            res.redirect("back");
          }
        }
      });

    } else {
      res.redirect("back");
    }
  }



middlewareObj.checkCampgroundOwnership = function(req, res, next){
  //middleware authorization

    if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
          res.redirect("back")
        } else {
          //check if author id mathces the logged in user id
          //req.user._id, is a string
          //foundCampground.author.id, is a mongoose Object not a string
          if(foundCampground.author.id.equals(req.user._id)) {
            //continue with the rest of the parent function
              next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      res.redirect("back");
    }
  }

  middlewareObj.isLoggedIn = function(req, res, next) {
    //middleware function
      if(req.isAuthenticated()){
        return next();
      }
      res.redirect("/login");
    }

module.exports = middlewareObj
