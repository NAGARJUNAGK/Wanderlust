const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const User = require("./user.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
        "https://media.istockphoto.com/id/1090614334/photo/beautiful-cloudscape-over-the-sea-waves-sunrise-shot.jpg?s=1024x1024&w=is&k=20&c=lLt8Gj7Z3N6xfhcFRzchM7pWx0MbYve5hhUjM-lWSik=",
    set: (v) => 
        v === "" 
            ? "https://media.istockphoto.com/id/1090614334/photo/beautiful-cloudscape-over-the-sea-waves-sunrise-shot.jpg?s=1024x1024&w=is&k=20&c=lLt8Gj7Z3N6xfhcFRzchM7pWx0MbYve5hhUjM-lWSik=" 
            : v,
  },
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.review}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
