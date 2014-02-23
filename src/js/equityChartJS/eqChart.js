var convertDateToFile = function(date, equity) {
  return "/mnt/eqJson/" + dateFilepathString(date) + "/" + equity;
}

var addJsonFile = function(startDate, endDate, bar, key, attribute, data) {
  //loads values from json file and put it to test data
  var equityMap = {};
  equityMap["key"] = attribute + ":" + key;
  equityMap["bar"] = bar;

var resultArr = [];
  while( startDate <= endDate ) {
    var filename = convertDateToFile(startDate, key);
    
    $.ajax({
      url: filename,
      dataType: 'json',
      async: false,
      success: function(jsonData) {
        console.log("successfully loaded: " + filename);
        var jsonTime = jsonData.time.map(function(d) { return new Date(d)});

        for(var i=0; i<jsonTime.length; i++) {
          var graphPoint = {};
          graphPoint.x = jsonTime[i];
          graphPoint.y = jsonData[attribute][i];
          resultArr.push(graphPoint);
        }
      },
      error: function() {
        //file does not exist
      }
    });
    startDate = d3.time.day.offset(startDate, 1);
  }
  //console.log(resultArr);
  equityMap["values"] = resultArr;
  data.push(equityMap);
};



//data format:
// var chartData = [
//   {
//     "key" : "Equity GOOG" ,
//     "bar": false,
//     "values" : [ ]
//   },
//   {
//     "key" : "Option 12" ,
//     "bar": true,
//     "values" : [ ]
//   }
// ];

var addGraph = function(chartData) {

nv.addGraph(function() {
    var chart = nv.models.linePlusBarWithFocusChart()
        .margin({top: 30, right: 60, bottom: 50, left: 70})
        .x(function(d,i) { return i })
        .color(d3.scale.category10().range());

    chart.xAxis.tickFormat(function(d) {
      var dx = chartData[0].values[d] && chartData[0].values[d].x || 0;
      if (dx > 0) {
          return d3.time.format('%m/%d-%I:%M:%S')(new Date(dx))
      }
      return null;
    });

    chart.x2Axis.tickFormat(function(d) {
      var dx = chartData[0].values[d] && chartData[0].values[d].x || 0;
      return d3.time.format('%x')(new Date(dx))
    });
    
    chart.y1Axis
        .tickFormat(d3.format(',.2f'));

    chart.y3Axis
        .tickFormat(d3.format(',.2f'));
        
    chart.y2Axis
        .tickFormat(function(d) { return '$' + d3.format(',.2f')(d) });

    chart.y4Axis
        .tickFormat(function(d) { return '$' + d3.format(',.2f')(d) });
        
    chart.bars.forceY([0]);
    chart.bars2.forceY([0]);
    //chart.lines.forceY([0]);

    //nv.log(chartData);
    d3.select('#chart1 svg').remove();
    $('#chart1').append("<svg></svg>");

    d3.select('#chart1 svg')
        .datum(chartData)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
});
};


