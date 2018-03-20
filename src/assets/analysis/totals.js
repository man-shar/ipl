// ave
// balls
// ground
// opposition
// result
// rpo
// runs
// start_date
// team
// wkts

var q = d3.queue();

q.defer(d3.csv, "./data/allT20sTeamWiseResults.csv")

q.await(chart);

function chart(error, data) {
  results = new Set();
  var dateFormat = d3.timeParse("%d %b %Y");

  data = data.map(function(d, i) {
    results.add(d.result);

    return {
      "ave": +d.ave,
      "balls": +d.balls,
      "ground": d.ground,
      "opposition": d.opposition,
      "result": d.result,
      "rpo": +d.rpo,
      "runs": +d.runs,
      "start_date": dateFormat(d.start_date),
      "team": d.team,
      "wkts": +d.wkts
    }
  });

  // remove n/r matches

  data = data.filter(function(d) {
    return d.result !== "n/r";
  });

  var won = data.filter(function(d) {
    return d.result === "won";
  });

  var lost = data.filter(function(d) {
    return d.result === "lost";
  });

  for (let i =0; i < data.length; i += 2) {
    data[i]["avg_total"] = ((data[i]["runs"] * data[i]["balls"]) + (data[i + 1]["runs"] * data[i + 1]["balls"])) / (data[i]["balls"] + data[i + 1]["balls"]);
  }

  var avg_total = data.filter(function(d) {
    return d.avg_total;
  });

  var year_wise = d3.nest()
    .key(function (d) {
      return d.start_date.getMonth() + "_" + d.start_date.getFullYear();
    })
    .entries(data);

  var avg_year_wise = year_wise.map(function (year, i) {
    total = year.values.reduce(function (acc, d, i) {
      return acc + d.runs
    }, 0)

    avg = total / year.values.length;

    return {
      start_date: new Date(+year.key.split("_")[1], +year.key.split("_")[0], 15),
      avg: avg
    }
  })

  // console.log(won);
  // console.log(lost);
  console.log(avg_year_wise);

  var width = 1100;
  var height = 600;
  var margin = {top: 20, right: 20, bottom: 30, left: 50};

  var svg = d3.select("body")
    .append("svg")
    .attr("id", "totals_chart")
    .attr("width", width)
    .attr("height", height)

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

  var width = +svg.attr("width") - margin.left - margin.right;
  var height = +svg.attr("height") - margin.top - margin.bottom;

  var line_won = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.start_date); })
    .y(function(d) { return y(d.runs); });

  var line_lost = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.start_date); })
    .y(function(d) { return y(d.runs); });

  var line_avg_total = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.start_date); })
    .y(function(d) { return y(d.avg_total); });

  var line_year_wise_avg = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.start_date); })
    .y(function(d) { return y(d.avg_total); });

  var line_year_wise_avg = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.start_date); })
    .y(function(d) { return y(d.avg); });

  var x = d3.scaleTime()
    .rangeRound([0, width]);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  x.domain(d3.extent(data, function(d) { return d.start_date; }));
  y.domain(d3.extent(data, function(d) { return d.runs; }));

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(30).tickFormat(d3.timeFormat("%b")))
    .append("text")
    .attr("fill", "#000")
    .attr("x", width / 2)
    .attr("y", 21)
    .attr("dy", "0.71em")
    .style("font-size", "13px")
    .attr("text-anchor", "end")
    .text("Year");

  

  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .style("font-size", "13px")
    .text("Runs");

  // g.append("path")
  //   .datum(won)
  //   .attr("fill", "none")
  //   .attr("stroke", "green")
  //   .attr("stroke-linejoin", "round")
  //   .attr("stroke-linecap", "round")
  //   .attr("stroke-width", 1.5)
  //   .attr("d", line_won);

  // g.append("path")
  //   .datum(lost)
  //   .attr("fill", "none")
  //   .attr("stroke", "red")
  //   .attr("stroke-linejoin", "round")
  //   .attr("stroke-linecap", "round")
  //   .attr("stroke-width", 1.5)
  //   .attr("d", line_lost);

  // g.append("path")
  //   .datum(avg_total)
  //   .attr("fill", "none")
  //   .attr("stroke", "steelblue")
  //   .attr("stroke-linejoin", "round")
  //   .attr("stroke-linecap", "round")
  //   .attr("stroke-width", 1.5)
  //   .attr("d", line_avg_total);

  g.append("path")
    .datum(avg_year_wise)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line_year_wise_avg);
}