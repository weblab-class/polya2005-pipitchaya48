// Change from hardcoded name to ids
const mongoose = require("mongoose");

// Server configuration below
const mongoConnectionURL =
  "mongodb+srv://mit-tunnel-app:A6yxxeLcyyA9EhNs@cluster0.rsfva.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = "Cluster0";

// mongoose 7 warning
mongoose.set("strictQuery", false);

// connect to mongodb
mongoose
  .connect(mongoConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

const fs = require("fs");
const path = require("path");
const Location = require("../models/location");

const neighborsName = JSON.parse(fs.readFileSync(path.resolve(__dirname, "neighborsName.json")));
const nameToId = JSON.parse(fs.readFileSync(path.resolve(__dirname, "nameToId.json")));
const neighborsId = JSON.parse(fs.readFileSync(path.resolve(__dirname, "neighborsId.json")));

/*
๊๊0. Populate neighborsName with building names and its neighbors
1. use checkMutual() to check if all routes are bidirectional
2. use fetchNameToId() to populate nameToId.json with mapping from Location.name to Location._id (in string)
3. edit names in nameToId.json to reflect the names we used in neighborsName.json
4. use compareNames() to check that all buildling names in neighhborsName have associated ids
5. use mapNameToId() to convert names to ids & populate neighborsId.json
*/

const checkMutual = () => {
  for (key in neighborsName) {
    neighborsName[key].forEach((location) => {
      if (!neighborsName[location].includes(key)) {
        console.log(`Error at key = ${key}, location = ${location}`);
        return 0;
      }
    });
  }
  console.log("done");
};

const fetchNameToId = () => {
  const newObj = {};
  const getRidOfBldg = (str) => {
    return str.slice(5, str.length);
  };
  Location.find({}).then((locations) => {
    locations.forEach((location) => {
      newObj[getRidOfBldg(location.name)] = location._id.toString();
    });
    fs.writeFileSync(path.resolve(__dirname, "nameToId.json"), JSON.stringify(newObj), null);
  });
  console.log("Names to Ids fetched");
};

const compareNames = () => {
  for (key in neighborsName) {
    if (!(key in nameToId)) {
      console.log(`The name ${key} not found in nameToId.json`);
      return 0;
    }
  }
  console.log("Names compared sucessfully");
};

const mapNameToId = () => {
  const newNeighbors = {};

  for (key in neighborsName) {
    const oldArray = neighborsName[key];
    const newArray = [];
    oldArray.forEach((name) => {
      newArray.push(nameToId[name]);
    });
    newNeighbors[nameToId[key.toString()]] = newArray;
  }

  fs.writeFileSync(path.resolve(__dirname, "neighborsId.json"), JSON.stringify(newNeighbors), null);

  console.log("neighborsId.json updated");
};

mapNameToId();

/* NEXT: change building names to Ids in .json
const toCall = (target) => {
  Location.findOne({ name: target }).then((location) => {
    changeObj.push({
      target: target,
      id: location._id.toString(),
    });
    console.log(changeObj);
  });
};

const toCall2 = (name) => {
  const newLocation = new Location({
    name: name,
    latitude: 0,
    longitude: 0,
    hardCoded: true,
  });
  newLocation.save();
  console.log("added");
};

const toCall3 = (target, toInsert) => {
  const neighbors = jsonRoute.neighbors;

  for (var key in neighbors) {
    const holder = neighbors[key];
    const index = holder.indexOf(target);
    if (index !== -1) {
      holder.splice(index, 1, toInsert);
      neighbors[key] = holder;
    }
  }

  fs.writeFileSync(
    path.resolve(__dirname, "route.json"),
    JSON.stringify({
      reportedPaths: jsonRoute.reportedPaths,
      neighbors: neighbors,
    })
  );
};

const toCall4 = () => {
  const neighbors = jsonRoute.neighbors;
  const newNeighbors = {};
  for (let i = 0; i < changeObj.length; i++) {
    newNeighbors[changeObj[i].id] = neighbors[changeObj[i].target];
  }
  console.log(newNeighbors);
}; */
