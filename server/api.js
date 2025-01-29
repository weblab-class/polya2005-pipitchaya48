/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

// ---------- Constants ----------
// Time interval in which the reportedRoute is restricted (in ms)
const reportRouteTimeInterval = 24 * 60 * 60 * 1000; // 1 day

// -------------------------------

const express = require("express");

// import models so we can interact with the database
const { User } = require("./models/user");
const Location = require("./models/location");
const ReportedRoute = require("./models/reportedRoute");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const session = require("express-session");

// import algorithms
const routeJs = require("./route");
const { use } = require("react");

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
    session.navsettings = { ...session.navsettings, [req.body.field]: req.body.value };
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
    res.send(session.navsettings || {});
  }
});

// update history
router.post("/add-history", (req, res) => {
  if (req.user) {
    const newHistory = {
      from: req.body.from,
      to: req.body.to,
      date: Date.now(),
    };
    User.findById(req.user._id).then((user) => {
      user.history.unshift(newHistory);
      user.save();
      res.send(user.history);
    });
  } else {
    res.status(401).send({ msg: "User not logged in" });
  }
});

// get history
router.get("/history", (req, res) => {
  if (req.user) {
    User.findById(req.user._id).then((user) => {
      res.send(user.history);
    });
  } else {
    res.status(401).send({ msg: "User not logged in" });
  }
});

// clear history
router.post("/clear-history", (req, res) => {
  if (req.user) {
    User.findById(req.user._id).then((user) => {
      user.history = [];
      user.save();
      res.send({ msg: "History Cleared" });
    });
  } else {
    res.status(401).send({ msg: "User not logged in" });
  }
});

// import hardcoded locations to the database
router.post("/hardcoded-locations-import", (req, res) => {
  const newLocation = new Location({
    ...req.body,
    hardCoded: true,
  });

  newLocation.save();

  res.send({ message: `${newLocation.name} added.` });
});

// get accessible locations _id, names, and coordinates
// named like this for consistency with client-side
router.get("/location-names", (req, res) => {
  let locationsList = [];
  const byName = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };
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
          res.send(locationsList.sort(byName));
        });
      } else {
        res.send(locationsList.sort(byName));
      }
    });
});

router.get("/location-coords", (req, res) => {
  Location.findById(req.query.locationId).then((location) => {
    if (location) {
      res.send({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } else {
      // TO-DO: test this with real saved Data
      User.findById(req.user._id).then((user) => {
        const desiredLocation = user.savedPlaces.find(
          (location) => location._id === req.query.locationId
        );
        res.send({
          latitude: desiredLocation.latitude,
          longitude: desiredLocation.longitude,
        });
      });
    }
  });
});

// TO-DO: post new locations

// get route from start to destination
router.get("/route", (req, res) => {
  const neighborsJson = {};
  Location.find({}).then((locations) => {
    locations.forEach((location) => {
      neighborsJson[location._id.toString()] = location.neighbors;
    });
    res.send(routeJs.getRoute(neighborsJson, req.query.startId, req.query.endId));
  });
});

// get neighbors
router.get("/neighbors", (req, res) => {
  Location.findById(req.query.locationId).then((location) => {
    res.send(location.neighbors);
  });
});

// report a route
router.post("/report", (req, res) => {
  // const reportId = routeJs.reportRoute(req.body.node1, req.body.node2);
  // res.send({ reportId: reportId });

  const node1 = req.body.node1;
  const node2 = req.body.node2;
  // remove routes from Location.neighbors
  Location.findById(node1).then((location1) => {
    const neighborsOf1 = location1.neighbors;
    const index1 = neighborsOf1.indexOf(node2);
    neighborsOf1.splice(index1, 1);
    location1.neighbors = neighborsOf1;
    location1.save();

    Location.findById(node2).then((location2) => {
      const neighborsOf2 = location2.neighbors;
      const index2 = neighborsOf2.indexOf(node1);
      neighborsOf2.splice(index2, 1);
      location2.neighbors = neighborsOf2;
      location2.save();

      // add new report obj
      const newReportedRoute = ReportedRoute({
        node1: node1,
        node2: node2,
        reportedTime: Date.now(),
      });
      newReportedRoute.save();

      console.log("report successful");
      res.send({ reportId: newReportedRoute._id, reportedTime: newReportedRoute.reportedTime });
    });
  });
});

// manual -- unreport reportedRoute by Id
router.get("/unreport-route", (req, res) => {
  // routeJs.shiftRoute();
  // res.send("Unreport successfully");

  ReportedRoute.findById(req.query.reportId).then((reportedRoute) => {
    // add routes back
    Location.findById(reportedRoute.node1).then((location1) => {
      const neighborsOf1 = location1.neighbors;
      neighborsOf1.push(reportedRoute.node2);
      location1.neighbors = neighborsOf1;
      location1.save();

      Location.findById(reportedRoute.node2).then((location2) => {
        const neighborsOf2 = location2.neighbors;
        neighborsOf2.push(reportedRoute.node1);
        location2.neighbors = neighborsOf2;
        location2.save();

        // delete reportedRoute
        ReportedRoute.deleteOne({ _id: req.query.reportId });
        console.log("unreport successful");
      });
    });
  });
});

// clear all reported routes that should be clear
// async ensure that the reported route is deleted
const updateReportedRoutes = () => {
  const timeNow = Date.now();
  ReportedRoute.find({}).then((reportedRoutes) => {
    const reportedRoutesToClear = reportedRoutes.filter(
      (route) => timeNow - route.reportedTime > reportRouteTimeInterval
    );
    console.log(reportedRoutesToClear);
    if (reportedRoutesToClear.length > 0) {
      const reportedRoute = reportedRoutesToClear[0];
      console.log(reportedRoute._id);
      // add routes back
      Location.findById(reportedRoute.node1).then((location1) => {
        const neighborsOf1 = location1.neighbors;
        neighborsOf1.push(reportedRoute.node2.toString());
        location1.neighbors = neighborsOf1;
        location1.save();

        Location.findById(reportedRoute.node2).then(async (location2Promise) => {
          const location2 = await location2Promise;
          const neighborsOf2 = location2.neighbors;
          neighborsOf2.push(reportedRoute.node1.toString());
          location2.neighbors = neighborsOf2;
          location2.save();
          console.log(location2);

          console.log(reportedRoute._id);
          // delete reportedRoute
          await ReportedRoute.deleteOne({ _id: reportedRoute._id });
          console.log("unreport successful");
        });
      });
    }
  });
};

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = {
  router,
  updateReportedRoutes,
};
