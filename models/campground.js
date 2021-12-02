const mongoose = require('mongoose');
const Review = require('./reviews')

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = {toJSON: {virtuals: true}}; 


const campGroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
    // want to connect campground model to review model with one-to-many where you embed the objectIds in here
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);

// this is the function where i can change the layout of the main campgrounds popups
campGroundSchema.virtual('properties.popUpMarkup').get(function () {

    return `<h3>${this.title}</h3><p>${this.price}</p><button><a href="/campgrounds/${this._id}">See Campground</a></button>`
    
    // `<a href="/campgrounds/${this._id}">${this.title}</a>`
});

campGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Campground', campGroundSchema);