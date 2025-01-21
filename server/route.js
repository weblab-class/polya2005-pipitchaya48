const fs = require("fs");
const path = require("path");
const jsonRoute = JSON.parse(fs.readFileSync(path.resolve(__dirname, "route.json")));

const getRoute = (startLocation, endLocation) => {
  const visited = new Set([startLocation]);
  const agenda = [[startLocation]];
  const neighbors = jsonRoute.neighbors;

  while (agenda.length > 0) {
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

const getNeighbors = (locationId) => {
  return jsonRoute.neighbors[locationId.toString()];
};

module.exports = {
  getRoute,
  reportRoute,
  shiftRoute,
  getNeighbors,
};
