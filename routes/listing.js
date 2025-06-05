const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //handeling errors
const ExpressError = require("../utils/ExpressError.js"); //generating errors
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingControllers.index)) //index route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,  
    wrapAsync(listingControllers.createListing)
  ); //create route

// New route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing)) //showing route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.updateListing)
  ) //update route
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing)); //delete route

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)
);

module.exports = router;
