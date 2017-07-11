
var RED = "#FF0000",
    YELLOW = "#FFA000" //"#FFCC00",
    GREEN = "#228B22";



    var noOfCities = 
      {
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "data": {"url": "india_census.csv", "format": {"type": "csv"}},
  "transform": [
    {"calculate": "datum.population_total/1000000", "as": "population_total_in_million"}
    
  ],
   "mark": "bar",
       "encoding": {
         "x": {
               "field": "name_of_city",
               "type": "ordinal",
               "axis": {"title": "City Name"},

         },
         "y": {"field": "population_total_in_million",
               "type": "quantitative",
               "axis": {"title": "Total Population (Million)"},
               "sort": "descending",
             
             },
         "color": {
           "field": "population_total_in_million",
           "scale": {
              "domain": [5,10,14],
              "type" : "symbol",
              "range": [GREEN,YELLOW,RED]

            },
           "type": "quantitative",
           "legend": {
             "title" : "Population Total"
            },
            "legend": {
              "title" : "Population Total"
             }
          }
       },

       "config": {
            "mark": {
               "filled": true,
               "color": "steelblue"
            },
            "axis" : {
              "labelFontSize": 13,
              "titleFontSize": 16
            }
       }
}


var opt = {
  "renderer": "canvas",
  "actions": {
    "export": false,
    "source": false,
    "editor": false
  }
}

var opt2 = {
  mode: "vega-lite",
  actions: false
};


vega.embed('#populationVis', noOfCities, opt2, function(error, result) {
  // result.view is the Vega View, vlSpec is the original Vega-Lite specification
  var tooltipOption = {
        showAllFields: false,
        fields: [
          { field: "population_total (%)", title: "Total Population (Millions)" }
        ]
      };
  vegaTooltip.vegaLite(result.view, noOfCities,tooltipOption);
  });



var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
}
