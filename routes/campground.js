const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campground');
const wrapAsync = require('../utility/wrapAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Campground = require('../models/campground');

router.get('/', wrapAsync(campgrounds.index))

router.post('/', isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id', wrapAsync(campgrounds.searchCampground))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.editCampground))


module.exports = router;
