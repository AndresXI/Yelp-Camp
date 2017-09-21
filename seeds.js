var mangoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
//starter data
var data = [
  {
    name: "Clouds Rest",
    image: "http://fmobserver.com/wp-content/uploads/2014/04/Summer_camp_tentsPM1.jpg",
    description: "a dope ass campground"
  },
  {
    name: "Clouds black",
    image: "https://www.campamerica.co.uk/images/uploads/images/Private-Camp---Camp-Westmont-1400-x-610.png",
    description: "a dope ass campground"
  },
  {
    name: "Blue Forest",
    image: "http://cdn.skim.gs/image/upload/v1456338674/msi/summer-camp_frhitu.jpg",
    description: "a dope ass campground"
  }
]

function seedDB() {
  //remove all campgrounds
  Campground.remove({}, function(err){
    if(err) {
      console.log(err);
    } else {
      console.log("campgrounds removed");
    }
  });
  //add a few campgrounds
  //adding each one using a forEach loop
  data.forEach(function(seed){
      Campground.create(seed, function(err, campground){
        if(err){
          console.log(err);
        } else {
          console.log("added a campground");
          //create a commnet for each campground
          Comment.create(
            {
              text: "This place is great but I wish there was internet",
              author: "Homer"
            }, function(err, comment){
              if (err){
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("created new comnent");
              }

            });
        }
      });
});
  //add a few comments
}

//exporting the function to app.js
module.exports = seedDB;
