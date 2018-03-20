const d3 = require("d3");
const path = require('path');
const fs = require('fs');
const print = console.log;

const unique_rosters_path = __dirname + "/unique_rosters.json";
const unique_rosters = JSON.parse(fs.readFileSync(unique_rosters_path, "utf-8"));
const tp = d3.timeParse("%d %b %Y");
const tf = d3.timeFormat("%d %b %Y");

var dates = Object.keys(unique_rosters);
dates = dates.map((date) => {
  return tp(date);
});

dates.sort((a, b) => {
  if(a > b)
    return 1
  else
    return -1
});

sorted = {};

dates.forEach((date) => {
  sorted[tf(date)] = 
})