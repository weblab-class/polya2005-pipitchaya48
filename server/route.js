const fs = require("fs");
const path = require("path");
const neighbors = JSON.parse(fs.readFileSync(path.resolve(__dirname, "route.json")));

const getRoute = (startLocation, endLocation) => {
  const visited = new Set([startLocation]);
  const agenda = [[startLocation]];

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

module.exports = getRoute;
