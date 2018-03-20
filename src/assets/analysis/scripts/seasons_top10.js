const d3 = require("d3");
const path = require('path');
const fs = require('fs');
const print = console.log;

var outFile = path.join(__dirname, "seasons_top10.json");

years = d3.range(2008, 2018);

props = [
  "best_averages_bowling", 
  "highest_averages_batting", 
  "most_wickets",
  "best_bowling_figures", 
  "most_runs"
];

seasons_top10 = {};

// fs.writeFileSync(outFile, "");

function findTop10(data, prop, year) {
  seasons_top10[prop]["columns"] = data.columns.slice();
  // print(seasons_top10[prop]["columns"]);
  for (let i = 0; i < 10; i++) {
    seasons_top10[prop][year].push(data[i])
  }
}

props.forEach((prop) => {
  seasons_top10[prop] = {};
  years.forEach((year, i) => {
    seasons_top10[prop][year] = [];
    // "best_bowling_figures"
    fileLoc = "file:///home/manas/projects/ipl/src/assets/data/ipl_data/" + prop + "/" + year + "_" + prop + ".csv";
    d3.csv(fileLoc, (err, data) => {
      // if err throw err;
      findTop10(data, prop, year)
      fs.writeFileSync(outFile, JSON.stringify(seasons_top10, null, 2));
    });
  });
});