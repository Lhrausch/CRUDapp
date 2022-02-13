//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
const Data = require ("./models/schema.js");
const seedData = require("./models/seed.js")
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


// Data.create(seedData, (err, data) => {
//     if (err) console.log(err.message);
//     console.log("Added Data");
// })

// Movie.collection.drop()



//___________________
// Routes
//___________________
//localhost:3000
app.get("/datas", (req, res) => {
  Data.find({}, (err, allData) => {
      res.render("index.ejs",
      {
          datas: allData,
          tabTitle: "Data Home"
      })
  })    
})
//// create a new data
app.get("/datas/new", (req, res) => {
  res.render("new.ejs",
  {
      tabTitle: "Add New Data"
  })
})

///// read // show route
app.get("/datas/:id", (req, res) => {
  Data.findById(req.params.id, (err, foundData) => {
      res.render("show.ejs", 
      {
          datas: foundData,
          tabTitle: "Data Info"
      })
  })
})




// post route to store serach param
app.post("/datas/search/", (req, res) => {
  Data.find({title: req.body.searchString}, (err, foundData) => {
      res.render("index.ejs", 
      {
          datas: foundData,
          tabTitle: "Search Results"
      })
  })
})


// route to ADD new data and redirect to index
app.post("/datas", (req, res) => {
  req.body.cast = req.body.cast.split(", ")
  Data.create(req.body, (err, newData) => {
      if (err) {
          res.send(err)
      } else {
          res.redirect("/data")
      }
  })
})

app.get("/datas/:id/edit", (req, res) => {
  Data.findById(req.params.id, (err, foundData) => {
      res.render("edit.ejs", 
          {
          tabTitle: "Edit Data Details",
          datas: foundData,
          }
      )
  })
})
///////////////////////////   change route
app.put("/datas/:id", (req,res) => {
  req.body.cast = req.body.cast.split(", ")
  Data.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedData) => {
      res.redirect("/data")
  })
})

app.delete("/datas/:id", (req,res) => {
  Data.findByIdAndRemove(req.params.id, (err, foundData) => {
      res.redirect("/data")
  })
})


//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));