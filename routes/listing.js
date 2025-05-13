const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //handeling errors
const ExpressError = require("../utils/ExpressError.js"); //generating errors
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// middelware for server side validation for listing
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// index listing page
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New route
router.get("/new", (req, res) => {
  res.render("listings/new");
});

// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    if(!listing){
      req.flash("error","listing you requested does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","listing you requested does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;