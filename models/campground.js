var mongoose = require("mongoose");

//SCHEMA SETUP
//blueprint for campground
var campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  location: String,
  lat: Number,
  lng: Number,
  image: String,
  description: String,
  //associating a commnet with campground
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      //we are just embedding a reference with an ID
      ref: "Comment"
    }
  ]
});


//creating a campground model
//esports the model in app.js
module.exports = mongoose.model("Campground", campgroundSchema);
