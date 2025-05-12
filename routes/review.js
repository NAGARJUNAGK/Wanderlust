const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js"); //handeling errors
const ExpressError = require("../utils/ExpressError.js"); //generating errors
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

// middelware for server side validation for review
const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
      throw new ExpressError(400, error);
    } else {
      next();
    }
  };

//Reviews
// post route
router.post(
  "/",
  validatereview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New review added");
    console.log("new review added");
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete review
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;