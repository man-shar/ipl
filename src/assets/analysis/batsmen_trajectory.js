// to see whether batsmen perform better in the latter half of the year after IPL.

var q = d3.queue();

q.defer(d3.csv, "./data/warner.csv");
q.defer(d3.csv, "./data/kohli.csv");
q.defer(d3.csv, "./data/rohit.csv");
q.defer(d3.csv, "./data/gayle.csv");
q.defer(d3.csv, "./data/raina.csv");

q.await(create);

function create(error, warner, kohli, rohit, gayle, raina)  {

  var dateFormat = d3.timeParse("%d %b %Y");

  var all = [warner, kohli, rohit, gayle, raina];

  // all = all.filter(function (player) {
  //   player = player.filter(function(match, i) {
  //     return match.mins != "-";
  //   });
  // });

  var width = 1100;
  var height = 600;
  var margin = {top: 20, right: 20, bottom: 30, left: 50};

  var svg = d3.select("body")
    .append("svg")
    .attr("id", "avgs_chart")
    .attr("width", width)
    .attr("height", height);

  col = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00']

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var width = +svg.attr("width") - margin.left - margin.right;
  var height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleTime()
    .rangeRound([0, width]);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  var line = d3.line()
    .x(function(d) { return x(dateFormat(d.start_date)); })
    .y(function(d) { return y(+d.runs); });

  x.domain([new Date(2006, 0, 0), new Date(2017, 11, 0)]);
  y.domain([0, 200]);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(30).tickFormat(d3.timeFormat(" %y")))
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
    .text("Fours");

  g.append("text")
  .attr("class", "name");

  all.forEach(function(player, i) {
    g.append("g")
      .append("path")
      .datum(player)
      .attr("fill", "none")
      .attr("class", player[0]["player"])
      .attr("stroke", col[i])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line)
      .on("mouseover", function() {
        g.selectAll("path").style("stroke-width", 1.5);
        d3.select(this).style("stroke-width", 5);
        d3.select(".name").text(d3.select(this).attr("class"));
      })
      .on("mouseout", function() {
        d3.select(".name").text();
      });
  })
}