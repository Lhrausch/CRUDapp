const mongoose = require("mongoose")
const Schema = mongoose.Schema

const dataSchema = new Schema({
    name: {type: String, required:true, trim: true},
    rating: {type: Number, required:true, trim: true},
    price: {type: Number, required:true, trim: true},
    location: {
    city:  {type: String} ,
    state:  {type: String} ,
    streetNumber:  {type: String} ,
    },
    tags: {type: [String], required:false, trim: true},
    image: {type: [String], required:true, trim: true},
    foodImage: {type: [String], required:false, trim: true},
    visited: Boolean,
}, {timestamp: true})


const Data = mongoose.model("Data", dataSchema)

module.exports = Data