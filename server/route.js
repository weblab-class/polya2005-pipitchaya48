const fs = require("fs");
const path = require("path");
const jsonRoute = JSON.parse(fs.readFileSync(path.resolve(__dirname, "route.json")));

const getRoute = (startLocation, endLocation) => {
  const visited = new Set([startLocation]);
  const agenda = [[startLocation]];
  const neighbors = jsonRoute.neighbors;

  while (agenda) {
    const oldPath = agenda.shift();
    const lastNode = oldPath.at(-1);
    const searchNodes = neighbors[lastNode];
    for (let i = 0; i < searchNodes.length; i++) {
      const newNode = searchNodes[i];
      if (!visited.has(newNode)) {
        const newPath = oldPath.concat([newNode]);
        if (newNode === endLocation) {
          return newPath;
        } else {
          agenda.push(newPath);
          visited.add(newNode);
        }
      }
    }
  }

  return null;
};

const reportRoute = (node1, node2) => {
  const reportedPaths = jsonRoute.reportedPaths;
  const neighbors = jsonRoute.neighbors;

  reportId = node1.toString() + "+" + node2.toString();

  // add to reported paths
  reportedPaths.push({
    _id: reportId,
    reportedTime: Date.now(),
  });

  // remove reported paths from available paths
  const neighborsOf1 = neighbors[node1];
  const index1 = neighborsOf1.indexOf(node2);
  neighborsOf1.splice(index1, 1);
  neighbors[node1] = neighborsOf1;

  const neighborsOf2 = neighbors[node2];
  const index2 = neighborsOf2.indexOf(node1);
  neighborsOf2.splice(index2, 1);
  neighbors[node2] = neighborsOf2;

  fs.writeFileSync(
    path.resolve(__dirname, "route.json"),
    JSON.stringify(
      {
        reportedPaths: reportedPaths,
        neighbors: neighbors,
      },
      null,
      2
    )
  );

  return reportId;
};

const shiftRoute = () => {
  const reportedPaths = jsonRoute.reportedPaths;
  const neighbors = jsonRoute.neighbors;

  // remove reported paths;
  const parsedId = reportedPaths.shift()._id.split("+");
  const node1 = parsedId[0];
  const node2 = parsedId[1];

  // remove reported paths from available paths
  neighbors[node1].push(node2.toString());
  neighbors[node2].push(node1.toString());

  fs.writeFileSync(
    path.resolve(__dirname, "route.json"),
    JSON.stringify(
      {
        reportedPaths: reportedPaths,
        neighbors: neighbors,
      },
      null,
      2
    )
  );
};

module.exports = {
  getRoute,
  reportRoute,
  shiftRoute,
};

/* Change from hardcoded name to ids
const mongoose = require("mongoose");

// Server configuration below
const mongoConnectionURL =
  "mongodb+srv://pipitchayas48692:pKrRtfhHbiQ5Pyf8@cluster0.zne9e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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

const Location = require("./models/location");

const changeObj = [
  { target: "1", id: "678c11a37b6b2c3edc90fbe8" },
  { target: "4", id: "678c91c1b01808abdd6c1145" },
  { target: "5", id: "678c91c1b01808abdd6c1146" },
  { target: "6", id: "678c91c1b01808abdd6c1147" },
  { target: "7", id: "678c91c1b01808abdd6c1148" },
  { target: "8", id: "678c91c1b01808abdd6c1149" },
  { target: "3", id: "678c91c1b01808abdd6c1144" },
  { target: "10", id: "678c13967b6b2c3edc90fbf4" },
  { target: "2", id: "678c9168573877f0bc3923fd" },
  { target: "9", id: "678c91c1b01808abdd6c114a" },
  { target: "6b", id: "678c9529999562e4792ee72d" },
  { target: "6c", id: "678c956c65049d94833c8edb" },
];

// NEXT: change building names to Ids in .json
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
};

toCall4();
*/
