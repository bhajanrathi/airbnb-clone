const express = require("express");
const wrapAsync = require('../utils/wrapAsync');
const Listing = require("../models/listing");
const router = express.Router();
const Review = require("../models/review");
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');

//index route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you're trying to search does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
}));

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you're trying to search does not exist!");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  // Find the listing and get the associated reviews
  let listing = await Listing.findById(id);
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
  }
  res.redirect("/listings");
}));

module.exports = router;