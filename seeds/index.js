const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelp')

// connect mongoose to mongo DB server 27017
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch((err) => {
        console.log("MONGO ERROR: " + err)
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({ 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: `${price}`,
            // this is my author ID, if delete other users, will run into issues 
            author: '609af1a48611af6af28a6970',
            geometry : {
                type: "Point", 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sunt ut quaerat dolorum a voluptatum ex omnis et aliquid, officiis eos beatae totam dignissimos. Accusantium inventore impedit labore provident mollitia!`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dqazaofh2/image/upload/v1628784129/Yelpcamp/awar-meman-0sjVuiikqRI-unsplash_kx0p41.jpg',
                    filename: 'Yelpcamp/awar-meman-0sjVuiikqRI-unsplash_kx0p41'
                  }
              ]
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    });

