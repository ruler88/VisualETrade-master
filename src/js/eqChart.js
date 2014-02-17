$(document).ready(function() {
$.getJSON('/mnt/eqJson/2014/02/11/RIO', function(jsonData) {
//note: entire js file is wrapped in this jquery json loader

    console.log("POINTA");
    console.log(jsonData.time);
    var gg = jsonData.time.map(function(d) { return new Date(d)});
    console.log(gg);


console.log(gg);

var testdata = [
  {
    "key" : "Equity GOOG" ,
    "bar": true,
    "values" : [ [ new Date(2012,1,2) , 1271000.0] , [ new Date(2012,1,3) , 1271000.0] , [ new Date(2012,1,4) , 1271090.51] ]
  },
  {
    "key" : "Option 12" ,
    "values" : [ [ new Date(2012,1,2) , 71.89] , [ new Date(2012,1,3) , 75.51] , [ new Date(2012,1,4) , 75.51] ]
  }
].map(function(series) {
  series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
  return series;
});


nv.addGraph(function() {
    var chart = nv.models.linePlusBarWithFocusChart()
        .margin({top: 30, right: 60, bottom: 50, left: 70})
        .x(function(d,i) { return i })
        .color(d3.scale.category10().range());

    chart.xAxis.tickFormat(function(d) {

      var dx = testdata[0].values[d] && testdata[0].values[d].x || 0;
      if (dx > 0) {
          return d3.time.format('%x')(new Date(dx))
      }
      return null;
    });

    chart.x2Axis.tickFormat(function(d) {
      var dx = testdata[0].values[d] && testdata[0].values[d].x || 0;
      return d3.time.format('%x')(new Date(dx))
    });
    
    chart.y1Axis
        .tickFormat(d3.format(',f'));

    chart.y3Axis
        .tickFormat(d3.format(',f'));
        
    chart.y2Axis
        .tickFormat(function(d) { return '$' + d3.format(',.2f')(d) });

    chart.y4Axis
        .tickFormat(function(d) { return '$' + d3.format(',.2f')(d) });
        
    chart.bars.forceY([0]);
    chart.bars2.forceY([0]);
    //chart.lines.forceY([0]);
    nv.log(testdata);
    d3.select('#chart1 svg')
        .datum(testdata)
        .call(chart);

//    nv.utils.windowResize(chart.update);

    return chart;
});



});
});