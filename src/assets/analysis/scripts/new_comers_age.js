const d3 = require("d3");
const path = require('path');
const fs = require('fs');
const print = console.log;

const seasons_top10_path = __dirname + "/seasons_top10.json";
const full_names_path = __dirname + "/full_names.json";
const unique_rosters_path = __dirname + "/unique_rosters.json";
const debuts_path = __dirname + "/debuts.json";

const seasons_top10 = JSON.parse(fs.readFileSync(seasons_top10_path, "utf-8"));
const unique_rosters = JSON.parse(fs.readFileSync(unique_rosters_path, "utf-8"));
const full_names = JSON.parse(fs.readFileSync(full_names_path, "utf-8"));
const debuts = JSON.parse(fs.readFileSync(debuts_path, "utf-8"));
const dates = Object.keys(unique_rosters);
const props = Object.keys(seasons_top10);
const tp = d3.timeParse("%d %b %Y");
const tf = d3.timeFormat("%d %b %Y");

var sorted_dates = Object.keys(unique_rosters);
sorted_dates = sorted_dates.map((date) => {
  return date;
});

sorted_dates.sort((a, b) => {
  if(tp(a) > tp(b))
    return 1
  else
    return -1
});

