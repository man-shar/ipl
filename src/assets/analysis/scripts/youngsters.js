// how young were the players who came from ipl.
// average age of team.
// average age of newcomer from ipl vs non ipl.

// newcomer: hasnt played 20 intl matches.

const d3 = require("d3");
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const print = console.log;
const outFile = __dirname + "/new_players.json"

const unique_rosters_path = __dirname + "/unique_rosters.json";
const unique_rosters = JSON.parse(fs.readFileSync(unique_rosters_path, "utf-8"));
const player_details_path = __dirname + "/player_details.json"
const player_details = JSON.parse(fs.readFileSync(player_details_path, "utf-8"));
const tp = d3.timeParse("%d %b %Y");
const tf = d3.timeFormat("%d %b %Y");

var dates = Object.keys(unique_rosters);

dates.sort((a, b) => {
  if(tp(a) > tp(b))
    return 1
  else
    return -1
});

function numMatches(player, stopDate) {
  let c = 0;
  for (var i = 0; i < dates.length; i++) {
    let date = dates[i];
    if (tp(dates[i]) > tp(stopDate))
      break

    if(unique_rosters[date]["roster"].indexOf(player) !== -1)
      c++;
  }

  return c;
}

short_month = {
  "January": "Jan",
  "February": "Feb",
  "March": "Mar",
  "April": "Apr",
  "May": "May",
  "June": "Jun",
  "July": "Jul",
  "August": "Aug",
  "September": "Sep",
  "October": "Oct",
  "November": "Nov",
  "December": "Dec"
}

// to check if a player is a newcomer.
function isNewPlayer(player, date) {
  // print(numMatches(player, date))
  return (numMatches(player, date) <= 20)
}

// extract birth date from "Born" field in player_details.json of a player.
function extractBirthDate(str) {
  date = str.match(/.*? [0-9](?=,)/)
  // if not single digit date
  if(!date)
    date = str.match(/.*? [0-9][0-9](?=,)/);

  month = short_month[date[0].split(" ")[0]];
  day = date[0].split(" ")[1];
  year = str.match(/[0-9][0-9][0-9][0-9]/)  
  

  let bday = day + " " + month + " " + year;
  
  return bday
}

function calculateAge(player, currentDate) {
  let born_details = player_details[player]["Born"];
  birthDate = tp(extractBirthDate(born_details));

  var timeDiff = Math.abs(tp(currentDate).getTime() - birthDate.getTime());
  var diffYears = Math.round(timeDiff / (1000 * 3600 * 24 * 365) * 10) / 10;

  return diffYears;
}

function avgAge(players, date) {
  let avg = 0;
  players.forEach((player)=> {
    avg += calculateAge(player, date);
  })
  avg = avg / players.length;

  return avg; 
}

newPlayers = {};

dates.forEach((date) => {
  if(tp(date).getFullYear() < 2003)
    return;

  newPlayers[date] = {
    "players": [],
    "avg_age": null
  };

  players = unique_rosters[date]["roster"]
  if(unique_rosters[date]["type"] == "Test")
  {
    return
  }
  
  players.forEach((player) => {
    if (isNewPlayer(player, date)) {
      newPlayers[date]["players"].push(player);
      // print(date + ":", newPlayers[date])
    }
  });

  newPlayers[date]["avg_age"] = avgAge(newPlayers[date]["players"], date);
  print(newPlayers[date])
});

// fs.writeFileSync(outFile, JSON.stringify(newPlayers, null, 2));