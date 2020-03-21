// Data Journalism and D3

// Define SVG Area
var svgWidth = 800;
var svgHeight = 500;

// Define chart margin's
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

//define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
 
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then (function(stateData){

    console.log(stateData);

    // Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;

    });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(stateData, d=>d.poverty) + 2])
    .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
    .domain([2, d3.max(stateData, d=>d.healthcare) + 2])
    .range([height, 0]);


    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "#5DADE2")
    .attr("opacity", ".8");


    // Input text in circles
    chartGroup.selectAll("text.state")
    .data(stateData)
    .enter()
    .append("text")
    .attr("class", "state")
    .attr("x", d => xLinearScale(d.poverty) -9)
    .attr("y", d => yLinearScale(d.healthcare) + 5)
    .attr("font-size", "12px")
    .attr("font-family", "Verdana")
    .attr("stroke", "white")
    .text(function(d) {
        return d.abbr;
    });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2) -60)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

}).catch(function(error) {
 console.log(error);
});
