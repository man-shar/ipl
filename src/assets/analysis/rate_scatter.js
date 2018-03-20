// player,runs,mins,bf(balls faced),n4s,n6s,sr,inns,opposition,ground,start_date,

var q = d3.queue();

q.defer(d3.csv, "./data/batting.csv")

q.await(chart);
rate = {
  runs:0,
  mins:100,
};

function chart(error, data) {
  var dateFormat = d3.timeParse("%d %b %Y");


  data = data.filter(function (d) {
    return +d.mins > 0;
  })

  data = data.map(function(d, i) {
    rate = (+d.runs / +d.mins) > (+rate.runs / +rate.mins) ? d : rate;
    return {
      player:d.player,
      opposition: d.opposition,
      ground: d.ground,
      runs: +d.runs,
      mins: +d.mins,
      bf: +d.bf,
      n4s: +d.n4s,
      n6s: +d.n6s,
      sr: +d.sr,
      start_date: dateFormat(d.start_date),
      rate: +d.runs / +d.mins
    }
  });

  data = data.filter(function (d) {
    return +d.rate > 2;
  })

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

  var x = d3.scaleTime()
    .rangeRound([0, width]);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  x.domain(d3.extent(data, function(d) { return d.start_date; }));
  y.domain(d3.extent(data, function(d) { return d.rate; }));


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

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", "steelblue")
    .attr("cx", function(d) {
      return x(d.start_date)
    })
    .attr("cy", function (d) {
      return y(d.rate);
    })
    .attr("r", 5)
    .style("opacity", 0.5)
    .on("click", function (d) {
      console.log(d);
    });
}