"use strict";

/* Boilerplate jQuery */
$(function() {
  $.get("res/illiniFootballScores_streak.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     visualize(data);
   })
   .fail(function (e) {
     alert("Failed to load CSV data!");
   });
});

/* Visualize the data in the visualize function */
var visualize = function(data) {
  console.log(data);

  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 115 },
     // width = 800 - margin.left - margin.right,
     width = 1000,

     height = (data.length * 3); // used to determine spacing between the y axis 

  //mouseover


  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//creating lists for years and opponents
var opponents = _.map(data, "Opponent");
opponents = _.uniq(opponents);
// opponents can now be used as the domain in your scale

var years = _.map(data, "Season");
years = _.uniq(years);
// years can now be used as the domain in your scale




var yearScale = d3.scaleLinear().domain([1892,2014]).range([0,width]);
//a powerful function: scale, takes a domain and range of the function and provides implementation for you

var opponentScale = d3.scalePoint().domain(opponents).range([0,height]);
var xAxis = d3.axisTop().scale(yearScale).tickFormat(d3.format("d"));
var yAxis = d3.axisLeft().scale(opponentScale);
svg.append("g").call(xAxis);
svg.append("g").call(yAxis);

var tip = d3.tip()
            .attr('class','d3-tip')
            .html(function(d){

                return "Date: " + d.Date + "| "
                 + "Score:- " + "\n" + "Illini: " + d.IlliniScore + "\n " +
                d.Opponent + ": " + d.OpponentScore + "\n" ;
            });


// == VIZUALIZATION SHAPES ==
svg.call(tip);
svg.selectAll("circles")
 .data(data) // like a forloop, as long as we have data
 .enter()
 .append("circle") // every line below enter runs 10 times , so we append 10 circles
 .attr("r",function(d){
    return 4 + d.WinStreak/1.01;

 })
 .style("fill",function(d){
  if(d.Result == "W"){
    return "orange";
  }
  return "purple";
 })
 .attr("cx",function(d){
   return yearScale(d.Season); // d is our data and score is an attribute of our data
 }) 
 .attr("cy", function(d){
  return opponentScale(d.Opponent);
 })
 .on("mouseover",tip.show)
 .on("mouseout",tip.hide)
};
