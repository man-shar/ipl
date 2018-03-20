const d3 = require("d3");
const path = require('path');
const fs = require('fs');
const print = console.log;
const matchTypesPath = __dirname + "/match_types.json";
const matchTypes = JSON.parse(fs.readFileSync(matchTypesPath, "utf-8"))
const outFile = __dirname + "/india_bowling.json"

// remove test matches
const matches = fs.readdirSync("/home/manas/projects/ipl/src/assets/data/india_male/json/")
  .filter((d) => {
    return matchTypes[d.split(".")[0] + ""] !== "Test";
  });

oppInnings = {};

matches.forEach((match) => {
  stats = JSON.parse(fs.readFileSync("/home/manas/projects/ipl/src/assets/data/india_male/json/" + match, "utf-8"));

  // print(stats["innings"][0]["1st innings"]["team"])

  if(stats["innings"][0]["1st innings"]["team"] !== "India") {
    oppInnings[match.split(".")[0]] = stats["innings"][0];
  }

  else {
    oppInnings[match.split(".")[0]] = stats["innings"][1];
  }
});

// uncomment to write to file.
// fs.writeFileSync(outFile, JSON.stringify(oppInnings, null, 2));