const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

// utility func for async
const wrapAsync = require('../utility/wrapAsync')

// requiiring reviewSchema
const { reviewSchema } = require('../schemaValidator.js')

// import error handler class AppError
const ExpressError = require('../utility/expressError');

// requiring models
const Review = require('../models/reviews')
const Campground = require('../models/campground')

// require controllers
const reviewController = require('../controllers/review')



// added middleware to validate review posting
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

// delete route for review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview))


module.exports = router;