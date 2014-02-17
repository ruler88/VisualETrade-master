

var getJsonFile = function(filename) {

  var resultArr = [];

  $.ajax({
    url: filename,
    dataType: 'json',
    async: false,
    success: function(jsonData) {
      var jsonTime = jsonData.time.map(function(d) { return new Date(d)});

      for(var i=0; i<jsonTime.length; i++) {
        var graphPoint = {};
        graphPoint.x = jsonTime[i];
        graphPoint.y = jsonData.ask[i];
        resultArr.push(graphPoint);
      }

    },
    error: function() {
      alert('Error loading ');
    }
  });

  // $.getJSON(filename, function(jsonData) {
  //   var jsonTime = jsonData.time.map(function(d) { return new Date(d)});
  //   var testValues = [];
  //   for(var i=0; i<jsonTime.length; i++) {
  //     var graphPoint = {};
  //     graphPoint.x = jsonTime[i];
  //     graphPoint.y = jsonData.ask[i];
  //     resultArr.push(graphPoint);
  //   }
  // });
  
  return resultArr;
};




var testdata = [
  {
    "key" : "Equity GOOG" ,
    "bar": false,
    "values" : [ ]
  },
  {
    "key" : "Option 12" ,
    "bar": true,
    "values" : [ ]
  }
];

testdata[0].values = getJsonFile('/mnt/eqJson/2014/02/11/RIO');
testdata[1].values = getJsonFile('/mnt/eqJson/2014/02/11/RIO:2014:2:22:CALL:55.00');
console.log(testdata[0]);


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



