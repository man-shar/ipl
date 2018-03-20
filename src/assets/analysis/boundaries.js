// player,runs,mins,bf(balls faced),n4s,n6s,sr,inns,opposition,ground,start_date,

var q = d3.queue();

q.defer(d3.csv, "./data/batting.csv")

q.await(chart);

function chart(error, data) {
  var dateFormat = d3.timeParse("%d %b %Y");

  data = data.map(function(d, i) {
    return {
      runs: +d.runs,
      mins: +d.mins,
      bf: +d.bf,
      n4s: +d.n4s,
      n6s: +d.n6s,
      sr: +d.sr,
      start_date: dateFormat(d.start_date),
    }
  });

  // remove n/r matches

  
  var month_wise = d3.nest()
    .key(function (d) {
      return d.start_date.getMonth() + "_" + d.start_date.getFullYear();
    })
    .entries(data);

  var avg_month_wise = month_wise.map(function (year, i) {
    total = year.values.reduce(function (acc, d, i) {
      return acc + d.n4s + d.n6s;
    }, 0);

    avg = total / year.values.length

    return {
      start_date: new Date(+year.key.split("_")[1], +year.key.split("_")[0], 15),
      avg: avg
    }
  })

  // console.log(won);
  // console.log(lost);
  console.log(month_wise);
  console.log(avg_month_wise);

  var width = 1100;
  var height = 600;
  var margin = {top: 20, right: 20, bottom: 30, left: 50};

  var svg = d3.select("body")
    .append("svg")
    .attr("id", "avgs_chart")
    .attr("width", width)
    .attr("height", height)

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

  var width = +svg.attr("width") - margin.left - margin.right;
  var height = +svg.attr("height") - margin.top - margin.bottom;

  var line_month_wise_avg = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.start_date); })
    .y(function(d) { return y(d.avg); });

  var x = d3.scaleTime()
    .rangeRound([0, width]);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  x.domain(d3.extent(avg_month_wise, function(d) { return d.start_date; }));
  y.domain(d3.extent(avg_month_wise, function(d) { return d.avg; }));

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

  g.append("path")
    .datum(avg_month_wise)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line_month_wise_avg);
}