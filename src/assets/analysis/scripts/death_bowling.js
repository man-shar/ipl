const d3 = require("d3");
const path = require('path');
const fs = require('fs');
const print = console.log;

const matchTypesPath = __dirname + "/match_types.json";
const matchTypes = JSON.parse(fs.readFileSync(matchTypesPath, "utf-8"))
const seasonsTop10Path = __dirname + "/seasons_top10.json";
const fullNamesPath = __dirname + "/full_names.json";
const uniqueRostersPath = __dirname + "/unique_rosters.json";
const debutsPath = __dirname + "/debuts.json";
const indiaBowlingPath = __dirname + "/india_bowling.json"
const matches = fs.readdirSync("/home/manas/projects/ipl/src/assets/data/india_male/json/")
  .filter((d) => {
    return matchTypes[d.split(".")[0] + ""] !== "Test";
  });

const seasonsTop10 = JSON.parse(fs.readFileSync(seasonsTop10Path, "utf-8"));
const uniqueRosters = JSON.parse(fs.readFileSync(uniqueRostersPath, "utf-8"));
const fullNames = JSON.parse(fs.readFileSync(fullNamesPath, "utf-8"));
const indiaBowling = JSON.parse(fs.readFileSync(indiaBowlingPath, "utf-8"));
const debuts = JSON.parse(fs.readFileSync(debutsPath, "utf-8"));
const dates = Object.keys(uniqueRosters);
const props = Object.keys(seasonsTop10);
const tp = d3.timeParse("%d %b %Y");
const tf = d3.timeFormat("%d %b %Y");
const outFile = __dirname + "/death_bowlers.json";

death20 = ["15", "16", "17", "18", "19"];
death50 = ["45", "46", "47", "48", "49"];

death_bowlers = {};

matches.forEach((match) => {
  // n is this match's file number
  let n = match.split(".")[0];
  let stats = indiaBowling[n];
  if(!stats)
    return;
  let inn = Object.keys(stats)[0];
  stats = stats[inn]["deliveries"];
  let death = matchTypes[n] === "T20" ? death20 : death50;
  death_bowlers[n] = new Set();

  // loop over last 5 overs.
  for (var i = stats.length - 1; i >= (stats.length - 30); i--) {
    let deliv = stats[i];
    let over = Object.keys(deliv)[0].split(".")[0];
    if(death.indexOf(over) !== -1)
      death_bowlers[n].add(deliv[Object.keys(deliv)[0]]["bowler"]);
  }

  death_bowlers[n] = Array.from(death_bowlers[n])
});

// print(death_bowlers)

// uncomment to write to file.
// print(outFile)
// fs.writeFileSync(outFile, JSON.stringify(death_bowlers, null, 2));