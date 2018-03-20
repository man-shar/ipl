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

var established_players = new Set();

print("player,category,ipl,intl_match_date,debut");

function dateIsBeforeIPL(date) {
  return date.getMonth() <= 4;
}

// to chekc how many matchesa player has played till this date
function hasNotPlayerMuch(player, date) {
  const date_index = sorted_dates.indexOf(date);
  let c = 0;
  for (i = 0;i < date_index; i++) {
    if(unique_rosters[date]["roster"].indexOf(player) !== -1)
      c++;
  }

  return c <= 20;
}

function recentDebut(currentYear, playerToCheck) {
  return ((currentYear - debuts[playerToCheck]["debut"]) <= 2);
}

// metric is that if a player played the previous two ipls good, he came in the team because of the ipl.
// check if this match date is before the ipl in this year, previous year and year before that.
function checkGoodSeason(playerToCheck, currentYear, date) {
  var full_name = full_names[playerToCheck];
  // check this year and year before it.
  var upperYear = currentYear;
  var lowerYear = currentYear - 1;
  // check if this match date is before the ipl in this year.
  if (dateIsBeforeIPL(date)) {
    // if so, check previous year and year before that.
    upperYear = currentYear - 1;
    lowerYear = currentYear - 2;
  }

  for (let i = upperYear; i >= (lowerYear), (i >= 2008 && i < 2018); i--) {
    for (let j = 0; j < props.length; j++) {
      let prop = props[j];
      let top10 = seasons_top10[prop][i + ""];
      try {
        top10.forEach(function(player) {
          if (player["Player"] === full_name && recentDebut(currentYear, playerToCheck)) {
            print(full_name + "," + prop + "," + i + "," + tf(date) + "," + debuts[playerToCheck]["debut"]);
          }
        })
      }
      catch(e) {
        print(e)
        print(playerToCheck, prop, i, j);
      }
    }
  }
}

for (let i=0; i < sorted_dates.length; i++) {
  let date = sorted_dates[i];
  let year = tp(date).getFullYear();

  let players = unique_rosters[date]["roster"];
  
  // ignore tests
  if(unique_rosters[date]["type"] === "Test")
    continue

  for (let j=0; j < players.length; j++) {
    let playerToCheck = players[j];
    checkGoodSeason(playerToCheck, year, tp(date));
  }
}