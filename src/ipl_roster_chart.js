const print = console.log;
const tp = d3.timeParse("%d %b %Y");
const tf = d3.timeFormat("%d %b %Y");

var q = d3.queue();
q.defer(d3.json, "./src/assets/analysis/scripts/unique_rosters.json");
q.defer(d3.csv, "./src/assets/analysis/scripts/players_from_ipl.csv");
q.defer(d3.json, "./src/assets/analysis/scripts/full_names.json");

q.await(make);

function make(error, rosters_with_tests, ipl, full_names) {
  var dates = Object.keys(rosters_with_tests);
  rosters = dates.reduce((acc, date) => {
    // remove tests and replacement matches
    if(rosters_with_tests[date]["type"] !== "Test" && rosters_with_tests[date]["roster"].length === 11)
      acc[date] = rosters_with_tests[date];

    return acc;
  }, {});

  var dates = Object.keys(rosters);
  dates = dates.map((date) => {
    return date;
  });

  // sort dates
  dates.sort((a, b) => {
    if(tp(a) > tp(b))
      return 1
    else
      return -1
  });  

  // print(rosters)

  var ipl_by_date = d3.nest()
    .key(function(d) { return d.intl_match_date; })
    .entries(ipl);

  // get players that came from IPL
  fromIPL = ipl_by_date.reduce((acc, d) => {
    d.values.forEach((d) => acc.add(d.player));
    return acc;
  }, (new Set()));

  var height = 300,
      width = 1200,
      margin = {left: 30, top: 20, right: 20, bottom: 30};

  var svg = d3.select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

  height = height - margin.top - margin.bottom;
  width = width - margin.left - margin.right;

  var x = d3.scaleLinear()
    .domain([0, dates.length])
    .range([0, width]);

  var y = d3.scaleLinear()
    .domain([0, 11])
    .range([0, height]);

  var chart = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // sort roster entries for each date by players who were from IPL first.
  dates.forEach((date) => {
    let empty = [];
    rosters[date]["roster"].sort((a, b) => {
      if(fromIPL.has(full_names[a]))
        return 1;
      return -1;
    })
  })

  dates.forEach((date, i) => {
    // print(date);
    chart.append("g")
      .attr("class", "roster")
      // .selectAll("circle")
      .selectAll("rect")
      .data(rosters[date]["roster"])
      .enter()
      .append("rect")
      .attr("width", width / dates.length)
      .attr("height", height / 11)
      .attr("x", (d) => x(i))
      .attr("y", (d, i) => y(i))
      // .append("circle")
      // .attr("cx", (d) => x(i))
      // .attr("cy", (d, i) => y(i))
      // .attr("r", 2)
      .style("fill", (d) => {
        if(fromIPL.has(full_names[d]))
          return "#e45d5d";
        return "#ccc"
      })
      .style("stroke", "#fff")
      .style("stroke-width", "0.5")
      .on("click", (d) => print(rosters[date]))
  })
}