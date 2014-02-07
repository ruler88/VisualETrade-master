var dateMap = {};       //all dates placed in map, in {date, true} format

var extractMonth = function(dateString) {
    var month = dateString.substring(4,6);
    return parseInt(month) - 1; //js month is off by one
}

var extractDay = function(dateString) {
    var day = dateString.substring(6,8);
    return parseInt(day);
}

var extractYear = function(dateString) {
    var year = dateString.substring(0,4);
    return parseInt(year);
}


var generateTableHtml = function(availableDates) {
    var tableHtml = new Array();
    var tmpTableRow = "<tr>" //use this tmp var to keep entire row (month) of dates
    var month = extractMonth(availableDates[0]);
    for(var i=0; i<availableDates.length; i++) {
        if(month != extractMonth(availableDates[i])) {
            tmpTableRow += "</tr>";
            tableHtml.push(tmpTableRow);
            tmpTableRow = "<tr>"  //reset the tmp var
            month = extractMonth(availableDates[i]);
        }
        tmpTableRow += '<td><button type="button" class="btn btn-primary" data-toggle="button" onclick="toggleDate(' + 
            availableDates[i] + ')">' + 
            availableDates[i] + '</button></td>';
    }
    if(tmpTableRow.length > 5) {
        //add on the last row
        tmpTableRow += "</tr>";
        tableHtml.push(tmpTableRow);
    }
    return tableHtml;
}

var startDate = new Date();
var endDate = new Date(0);

var addStartEndDates = function(date) {
    if( startDate > date ) {
        startDate = date;
    }
    if( endDate < d3.time.day.offset(date, 1) ) {
        endDate = d3.time.day.offset(date, 1);
    }
}

var removeStartEndDates = function(date) {
    if( startDate.getTime() == date.getTime() ) {
        console.log("in");
        for( var key in dateMap ) {
            if( dateMap[key] ) {
                startDate = key;
                return;
            }
        }
    }
    if( endDate == date ) {

    }

    
}

var toggleDate = function(date) {
    var dateString = String(date);
    var trueDate = new Date(extractYear(dateString), extractMonth(dateString), extractDay(dateString));
    if(dateMap[trueDate]) {
        delete dateMap[trueDate];
        removeStartEndDates(trueDate);
        console.log(startDate);
    } else {
        dateMap[trueDate] = true;
        addStartEndDates(trueDate);
        addDate(trueDate);
        console.log(startDate);
    }
}


$(document).ready(function() {
$.getJSON('/mnt/tradingData/datesEquity.json', function(jsonData) {
        //load json
        var tableRows = generateTableHtml(jsonData.dates);

        for(var i=0; i<tableRows.length; i++) {
            $('#dateTable').append(tableRows[i]);
        }
  });
});