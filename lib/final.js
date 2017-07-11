   var w = 600;
    var h = 600;

var WIDTH = 1000, HEIGHT = 600; //originally 1600
var COLOR_FIRST = "#3fae07", COLOR_LAST = "#ff0404";
var COLOR_COUNTS = 10;
var MAP1_TITLE = "Poverty Rate (States)";
var MAP_VALUE_2 = "obese_children_and_adolescents_number";
var MAP2_TITLE = "Heart Disease Mortality (35+ Adults)";
var SCALE = 0.5;
var active = d3.select(null);
var centered;

var stateMap = new Object();
var totalPopulation = 0;
var total_child_population = 0;
d3.csv("india_census.csv", function(data) {
 data.forEach(function(d) {
 if (stateMap[d.state_name] !=null) {
  var state_data = stateMap[d.state_name] ;
  console.log("state exist" + d.state_name + " " + state_data.population_total + " new " + d.population_total);
  totalPopulation = totalPopulation + parseInt(d.population_total);
  total_child_population = total_child_population + parseInt(d.population_total_0_6);
  state_data.population_male = parseInt(state_data.population_male) + parseInt(d.population_male);
  state_data.population_female = parseInt(state_data.population_female) + parseInt(d.population_female);
  state_data.population_total = parseInt(state_data.population_total) + parseInt(d.population_total);
  state_data.child_populationTotal = parseInt(state_data.child_populationTotal) + parseInt(d.population_total_0_6);




  stateMap[d.state_name] = state_data;
 // console.log("state populationTotal" + d.state_name  + state_data.population_total);
} else {
 var state_data={};
 state_data.state_name = d.state_name;
 state_data.population_total = parseInt(d.population_total);
 state_data.child_populationTotal = parseInt(d.population_total_0_6);

 state_data.population_male = parseInt(d.population_male);
 state_data.population_female = parseInt(d.population_female);
 stateMap[d.state_name] = state_data;
 totalPopulation = totalPopulation + parseInt(d.population_total);
 total_child_population = total_child_population + parseInt(d.population_total_0_6);

 //console.log("state does not exist" + d.state_name + d.population_total);
}

   
  });
});





var RED = "#FF0000",
    YELLOW = "#FFA000" //"#FFCC00",
    GREEN = "#228B22";

 var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10,0])
              .html(function(d) {
                var stateName = d.id;
                var state_data = stateMap[d.id.toUpperCase()];
                if (state_data != null) {
                var population_total = state_data.population_total;
                return "<span class='details'>" +
                       stateName + "<br>" +
                       "Total Population <span class='details'>" +
                              inMillions(population_total) + "M";
                            }
              });

 var quantize = d3.scaleQuantize()
          .domain([5,8,25])
          .range([GREEN,YELLOW,RED]);


           var scaleColor = d3.scaleLinear()
                    .domain([5,8,25])
                    .range([GREEN, YELLOW, RED])

    var proj = d3.geo.mercator() .translate([250, 150]) // translate to center of screen
          .scale([550]);
    var path = d3.geo.path().projection(proj);
    var t = proj.translate(); // the projection's default translation
    var s = proj.scale() // the projection's default scale

  var quantize = d3.scaleQuantize()
          .domain([5,20,25])
          .range([GREEN,YELLOW,RED]);

    var map = d3.select("#chart").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
//        .call(d3.behavior.zoom().on("zoom", redraw))
         .call(initialize)
         .on("click", stopped, true);

  map.call(tip);

    var india = map.append("svg:g")
        .attr("id", "india");

    d3.json("states.json", function (json) {
      india.selectAll("path")
          .data(json.features)
        .enter().append("path")
          .style("fill", function(d) {
                   var stateName = d.id;

                   if (stateName == undefined || stateMap[d.id.toUpperCase()] == undefined) return;
                   //return scaleColor(poverty_data[stateName][3]);
                   console.log("value is " + Math.abs(Number(stateMap[d.id.toUpperCase()].population_total)) / 1.0e+6);
                   return quantize(Math.abs(Number(stateMap[d.id.toUpperCase()].population_total)) / 1.0e+6);
                })
               .on("mouseover", function(d,i) {
                 var stateName = "Punjab";
                 $(this).attr("fill-opacity", "0.8");

                 if (stateName == undefined) return;
                  //console.log(d,i);
                  d3.select(this).style("fill-opacity", 0.6);
                  tip.show(d);

               })
               .on("mouseout", function(d,i) {
                  //console.log(d,i);
                  d3.select(this).style("fill-opacity", 1.0);
                  tip.hide(d);
               })
               .on("click", function(d,i) {
                  var stateName = d.id;
                  console.log("You clicked on ", stateName);
                  makeBar(".chart1", stateName);

                  makeDonut('#pieTotal', stateName);

               })
               .attr("d", path);

    });

    function initialize() {
      proj.scale(6700);
      proj.translate([-1240, 720]);
    }
// If the drag behavior prevents the default click,
      // also stop propagation so we don’t click-to-zoom.
      function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
      }

function inMillions (labelValue) {
    var number = Math.abs(Number(labelValue)) / 1.0e+6 ;
    return  number.toFixed(2);

}

  
function makeBar(svgId, stateName) {

   // Build the Bar chart

   var width = WIDTH,
      height = HEIGHT;
   var margin = {top: 20, right: 20, bottom: 30, left: 40};
   /*  var margin = {top: 50, right: 20, bottom: 30, left: 40},
      width = WIDTH - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;*/
   var data = [Number(Math.abs(Number(stateMap[stateName.toUpperCase()].population_total))/totalPopulation*100).toFixed(2),
              Number(Math.abs(Number(stateMap[stateName.toUpperCase()].child_populationTotal))/total_child_population*100).toFixed(2),
             40,
              50];

   var barChartLabels = ["Population % ",
                 "0 - 6 Child Population % ",
                 "5 - 17 Years ",
                 "Overall "];

   var barChartColors =  [" rgb(255,112,11)",
                          "rgb(144,18,41)",
                          "rgb(32, 127, 66)",
                          "rgb(65, 100, 127)"];

   var y = d3.scaleBand().range([height,0]).padding(0.1);

   //var yScale = d3.scaleOrdinal([0, height]);
   y.domain(data.map(function(d,i) {console.log(d,i,barChartLabels[i]); return barChartLabels[i]; }));

   var svgBar = d3.select(".svgBar");



   var ordinal = d3.scaleOrdinal()
     .domain(barChartLabels)
     .range(barChartColors);

   console.log("Create a Poverty Bar chart for state for ", stateName);

   d3.select("#barTitle1")
     .html("Poverty Level in <strong>" + stateName + "</strong> for various age groups");

   /*
   d3.select(".chart1")
     .attr("x",0)
     .attr("y",0)
     .attr("alignment-baseline","middle")
     .attr("text-anchor","end")
     .text(barChartLabels[0]);
   */



   d3.select(svgId)
   .selectAll("div")
     .data(data)
   .enter().append("div")
     .style("width", function(d) { 
            console.log("d is " + d + d<1? 20 : d * 20 );
           return d<1? 20 : d * 20  + "px";
       })
     .style("background-color", function(d,i) { return barChartColors[i];})
     //.text(function(d,i) { return "( " + barChartLabels[i] + " ) " + d + "%"; })
     .text(function(d,i) { return   d + "%"; })
   .exit().transition()
        .style("opacity", 0)
        .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
        .remove();

   d3.select(".chart1")
        .selectAll("div").transition()
        .duration(600)
       //.text(function(d,i) { return  "( " + barChartLabels[i] + " ) "  + d + "%"; })
       .text(function(d,i) { return   d + "%"; })
       .style("width", function(d) { return d<1? 20 : d * 20  + "px";  })

   svgBar.append("g")
     .attr("class", "legendOrdinal")
     .attr("transform", "translate(20,100)");


    var legendOrdinal = d3.legendColor()
                          .shape("path", d3.symbol().type(d3.symbolSquare).size(500)())
                          .cells(4)
                          .shapeWidth(60)
                          .orient("vertical")
                          .scale(ordinal);

    svgBar.select(".legendOrdinal")
     .call(legendOrdinal);

}



 function makeDonut(svgId, stateName) {
        'use strict';
        
var tooltip = d3.select(svgId)            
  .append('div')                             
  .attr('class', 'tooltipDonut');                 

tooltip.append('div')                        
  .attr('class', 'label');                   

tooltip.append('div')                        
  .attr('class', 'count');                   

tooltip.append('div')                        
  .attr('class', 'percent');                 


console.log("male population " + Number(stateMap[stateName.toUpperCase()].population_male));
console.log("female population " + Number(stateMap[stateName.toUpperCase()].population_female));

        var dataset = [
          {sala: "Female", value: Number(stateMap[stateName.toUpperCase()].population_female)},
          {sala: "Male", value: Number(stateMap[stateName.toUpperCase()].population_male)},
        
        ];


        var width = 300;
        var height = 300;
        var radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal()
    .range(["#f590e5", "#3E85FD"]);

 
        var svg = d3.select(svgId)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) + 
            ',' + (height / 2) + ')');
        
        
        var donutWidth = 75;

        var arc = d3.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

        var pie = d3.pie()
          .value(function(d) { return d.value; })
          .sort(null);

        var legendRectSize = 18;
        var legendSpacing = 4;
        
        var path = svg.selectAll('path')
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) { 
            return color(d.data.sala);
          
          });
        
        path.on('mouseover', function(d) {
  var total = d3.sum(dataset.map(function(d) {
    return d.value;
  }));
  var percent = Math.round(1000 * d.data.value / total) / 10;
  tooltip.select('.label').html(d.data.sala);
  tooltip.select('.percent').html(percent + '%');
  tooltip.style('display', 'block');
});
        
        path.on('mouseout', function() {
  tooltip.style('display', 'none');
});
          
        var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var offset =  height * color.domain().length / 2;
    var horz = -2 * legendRectSize;
    var vert = i * height - offset;
    return 'translate(' + horz + ',' + vert + ')';
  });
        
        legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color);
        
        legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; });

      }
