var convertDateToFile = function(date, equity) {
  return "/mnt/eqJson/" + dateFilepathString(date) + "/" + equity;
}

var bidAskSpread = function(jsonData, i) {
  return jsonData["ask"][i] - jsonData["bid"][i];
}
var bidAskPercent = function(jsonData, i) {
  if( jsonData["bid"][i] == 0 ) return 0;
  return (jsonData["ask"][i] - jsonData["bid"][i]) / jsonData["bid"][i];
}


var addJsonFile = function(startDate, endDate, type, key, yAxis, attribute, data, dataProcFunction, specialLabel) {
  //loads values from json file and put it to test data
  var equityMap = {};
  equityMap["key"] = specialLabel ? specialLabel : attribute + ":" + key;
  equityMap["type"] = type;
  equityMap["yAxis"] = yAxis;

  var resultArr = [];
  while( startDate <= endDate ) {
    var filename = convertDateToFile(startDate, key);
    
    $.ajax({
      url: filename,
      dataType: 'json',
      async: false,
      success: function(jsonData) {
        console.log("successfully loaded: " + filename);
        var jsonTime = jsonData.time.map(function(d) { return new Date(d).addHours(3)});

        for(var i=0; i<jsonTime.length; i++) {
          var graphPoint = {};
          graphPoint.x = jsonTime[i];

          if(!dataProcFunction) {
            graphPoint.y = jsonData[attribute][i];
          } else {
            graphPoint.y = dataProcFunction(jsonData, i);
          }
          
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
}

var showOptionDeltaHelper = function(underlierVals, optionVals, i, deltaArr) {
  var delta = (optionVals[i].y - optionVals[i-1].y) / (underlierVals[i].y - underlierVals[i-1].y);
  var graphPoint = {};
  graphPoint.x = underlierVals[i].x;
  graphPoint.y = delta;
  deltaArr.push(graphPoint);
}
var createEqMap = function(arrVal, type, yAxis, key) {
  var equityMap = {};
  equityMap["values"] = arrVal; equityMap["type"] = type;
  equityMap["yAxis"] = yAxis; equityMap["key"] = key;
  return equityMap;
}
var showOptionDelta = function(chartData, optionChartData, yAxis, type) {
  var underlierVals = chartData[0]["values"];
  var optionValsA = chartData[1]["values"];
  var optionValsB = chartData[2]["values"];
  var deltaArrA = [];
  var deltaArrB = [];
  var equityMapA = {};
  var equityMapB = {};

  if(!underlierVals || !optionValsA || !optionValsB ||
    underlierVals.length<2 || optionValsA.length <2 || optionValsB.length <2 ||
    underlierVals.length != optionValsA.length || underlierVals.length != optionValsB.length) {
    alert("SOMETHING FUCKED UP");
    console.log("underlier: " + underlierVals.length + " " + underlierVals);
    console.log("Option A: " + optionValsA.length + " " + optionValsA);
    console.log("Option B: " + optionValsB.length + " " + optionValsB);
    return;
  }
  for( var i=1; i<underlierVals.length; i++ ) {
    if(underlierVals[i].x.getTime() != optionValsA[i].x.getTime()) {
      // alert("time mismatch");
      // return;
    }
    if( Math.abs(underlierVals[i].y - underlierVals[i-1].y) > 0.01 ) {
      showOptionDeltaHelper(underlierVals, optionValsA, i, deltaArrA);
      showOptionDeltaHelper(underlierVals, optionValsB, i, deltaArrB);
    }
  }
  optionChartData.push(createEqMap(deltaArrA, type, yAxis, chartData[1]["key"]));
  optionChartData.push(createEqMap(deltaArrB, type, yAxis, chartData[0]["key"]));
}



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


var addGraph = function(chartData, chartId, primaryAxisLabel, secondaryAxisLabel) {

  nv.addGraph(function() {
      var chart = nv.models.multiChart()
          .margin({top: 30, right: 60, bottom: 50, left: 70})
          .color(d3.scale.category10().range());

      chart.xAxis.tickFormat(function(d) {
        return d3.time.format('%b %d %I:%M:%S%p')(new Date(d))
      });

      chart.yAxis1
          .tickFormat(d3.format(',.2f'))
          .axisLabel(primaryAxisLabel);

      chart.yAxis2
          .tickFormat(d3.format(',.2f'))
          .axisLabel(secondaryAxisLabel);

      chart.xAxis
           .axisLabel('Date');

      d3.select('#'+ chartId + ' svg')
        .datum(chartData)
        .transition().duration(500).call(chart);

      return chart;
  });

/*
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
*/
};
