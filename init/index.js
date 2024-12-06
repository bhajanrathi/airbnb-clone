const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {console.log("Connected to DB")})
    .catch((err) => {console.log(err)});

async function main () {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, 
        owner: '67505adb8779d27bbf2e8b0d',
    }));
    await Listing.insertMany(initData.data);
}

initDB();