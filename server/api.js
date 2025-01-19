/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const { User } = require("./models/user");
const Location = require("./models/location");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.post("/exchange-token", auth.exchangeToken);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// save change of navigation settings
router.post("/navigation-settings", (req, res) => {
  // logged in
  if (req.user) {
    const field = req.body.field;
    User.findById(req.user._id).then((user) => {
      const navsettings = user.navsettings;
      if (field === "avoidGrass") {
        navsettings.avoidGrass = req.body.value;
        user.save();
        res.send(req.body.value);
      } else if (field === "stayIndoor") {
        navsettings.stayIndoor = req.body.value;
        user.save();
        res.send(req.body.value);
      } else {
        res.status(400).send(`The field ${field} is not valid`);
      }
    });
  } else {
    res.send(req.body.value);
  }
});

// get current navigation settings
router.get("/navigation-setting", (req, res) => {
  // logged in
  if (req.user) {
    User.findById(req.user._id).then((user) => {
      res.send(user.navsettings);
    });
  } else {
    res.send(null);
  }
});

// import hardcoded locations to the database
router.post("/hardcoded-locations-import", (req, res) => {
  const newLocation = new Location({
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    hardCoded: true,
  });

  newLocation.save();

  res.send(`${newLocation.name} added.`);
});

// get accessible locations _id & names
router.get("/location-names", (req, res) => {
  let locationsList = [];
  // hardcoded locations
  Location.find({ hardCoded: true })
    .then((hardcodedLocations) => {
      locationsList = hardcodedLocations;
    })
    .then((hardcodedLocations) => {
      // user's saved locations
      if (req.user) {
        User.findById(req.user._id).then((user) => {
          locationsList = user.savedPlaces.concat(locationsList);
          req.session.locations = locationsList; // share this locations list with all endpoints
          res.send(
            locationsList.map((hardcodedLocation) => ({
              _id: hardcodedLocation._id,
              name: hardcodedLocation.name,
            }))
          );
        });
      } else {
        res.send(locationsList);
      }
    });
});

// TO-DO: get location coords from _id
router.get("/location-coords", (req, res) => {
  // const desiredLocation = req.session.locations.find(
  //   (location) => location._id === req.body.locationId
  // );
  res.send({
    latitude: 5,
    longitude: 6,
  });
});

// TO-DO: post new locations

// TO-DO: get route from start to destination

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
