const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //handeling errors
const ExpressError = require("../utils/ExpressError.js"); //generating errors
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// index listing page
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "review", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "listing you requested does not exist");
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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing you requested does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// update route
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  isOwner,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
