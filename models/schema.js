const mongoose = require("mongoose")
const Schema = mongoose.Schema

const dataSchema = new Schema({
    name: {type: String, required:true, trim: true},
    rating: {type: Number, required:true, trim: true, min: 1, max: 5},
    price: {type: Number, required:true, trim: true, min: 1, max: 5},
    location: {
    city:  {type: String} ,
    state:  {type: String} ,
    streetNumber:  {type: String} ,
    zipcode: {type: Number},
    },
    tags: {type: [String], required:false},
    image: {type: [String], required:true},
    foodImage: {type: [String], required:false},
    visited: Boolean,
}, {timestamp: true})


const Data = mongoose.model("Data", dataSchema)

module.exports = Data