const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js"); //handeling errors
const ExpressError = require("../utils/ExpressError.js"); //generating errors
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

//Reviews
// post route
router.post(
  "/",
  isLoggedIn,
  validatereview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review added");
    console.log("new review added");
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete review
router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
