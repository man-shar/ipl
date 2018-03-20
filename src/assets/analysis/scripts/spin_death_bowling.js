const d3 = require("d3");
const path = require('path');
const fs = require('fs');
const print = console.log;

const deathBowlers = JSON.parse(fs.readFileSync(__dirname + "/death_bowlers.json", "utf-8"));
const bowlerTypes = JSON.parse(fs.readFileSync(__dirname + "/bowler_types.json", "utf-8"));
const outFile = __dirname + "/spin_death.json";

const matches = Object.keys(deathBowlers);
let spinDeath = {};

function isSpinner(bowler) {
  var cats = ["break", "googly", "chinaman"];
  var spin = false;
  cats.forEach((cat) => {
    if (bowlerTypes[bowler].indexOf(cat) !== -1)
      spin = true;
  })

  return spin;
}

for (var i = matches.length - 1; i >= 0; i--) {
  let bowlers = deathBowlers[matches[i]];
  spinDeath[matches[i]] = new Set();

  bowlers.forEach((bowler) => {
    if (isSpinner(bowler))
      spinDeath[matches[i]].add(bowler);
  })

  spinDeath[matches[i]] = Array.from(spinDeath[matches[i]]);
}


// uncomment to write to file.
// print(outFile)
// fs.writeFileSync(outFile, JSON.stringify(spinDeath, null, 2));