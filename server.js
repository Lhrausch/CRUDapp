//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const Restaurant = require('./models/schema.js');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
const seedRestaurant = require("./models/seed.js")
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


// Restaurant.create(seedRestaurant, (err, data) => {
//     if (err) console.log(err.message);
//     console.log("Added Data");
// })

// Restaurant.collection.drop()



//___________________
// Routes
//___________________
//localhost:3000
app.get("/", (req, res) => {
  Restaurant.find({}, (err, allRestaurants) => {
      res.render("index.ejs",
      {
          restaurants: allRestaurants,
          tabTitle: "Data Home"
      })
  })    
})
//// create a new data
app.get("/new/", (req, res) => {
  res.render("new.ejs",
  {
      tabTitle: "Add New Data"
  })
})

///// read // show route
app.get("/:id/", (req, res) => {
  Restaurant.findById(req.params.id, (err, foundRestaurant) => {
      res.render("show.ejs", 
      {
          restaurant: foundRestaurant,
          tabTitle: "Data Info"
      })
  })
})




// post route to store serach param
app.post("/search/", (req, res) => {
  let city = location.city
  Restaurant.find({city: req.body.searchString}, (err, foundRestaurants) => {
      res.render("index.ejs", 
      {
          restaurants: foundRestaurants,
          tabTitle: "Search Results"
      })
  })
})


// route to ADD new data and redirect to index
app.post("/", (req, res) => {

    if(req.body.visited === 'on'){
      req.body.visited = true;
  } else {
      req.body.visited = false;
  }

  req.body.location = {
    city:  req.body.city ,
    state:  req.body.state ,
    streetNumber:  req.body.streetNumber,
    zipcode: req.body.zipcode,
  }
  Restaurant.create(req.body, (err, newData) => {
      if (err) {
          res.send(err)
      } else {
          res.redirect("/")
      }
  })
})
//// edit route
app.get("/:id/edit/", (req, res) => {
  Restaurant.findById(req.params.id, (err, foundRestaurant) => {
      res.render("edit.ejs", 
          {
          tabTitle: "Edit Data Details",
          restaurant: foundRestaurant,
          }
      )
  })
})
///////////////////////////   change route
app.put("/:id/", (req,res) => {
  req.body.location = {
    city:  req.body.city ,
    state:  req.body.state ,
    streetNumber:  req.body.streetNumber,
    zipcode: req.body.zipcode,
  }
  Restaurant.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedData) => {
      console.log(req.body);
      res.redirect("/")
  })
})

app.delete("/:id/", (req,res) => {
  Restaurant.findByIdAndRemove(req.params.id, (err, foundRestaurant) => {
      res.redirect("/")
  })
})


//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));