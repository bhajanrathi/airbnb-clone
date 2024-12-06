const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const Review = require('../models/review');
const Listing = require('../models/listing');
const { validateReview, isLoggedIn, isAuthor } = require('../middleware.js');

//Review
//Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = await Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;