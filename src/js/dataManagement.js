var dateMap = {};       //all dates placed in map, in {date, true} format
var dateEq = [];

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

var stringToDate = function(dateString) {
    return new Date(extractYear(dateString), extractMonth(dateString), extractDay(dateString));
}

var generateTableHtml = function(availableDates) {
    //generate the HTML code for date table
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
    //change start/end dates when there is a date addition
    if( startDate > date ) {
        startDate = date;
    }
    if( endDate < d3.time.day.offset(date, 1) ) {
        endDate = d3.time.day.offset(date, 1);
    }
}

var removeStartEndDates = function(date) {
    //change start/end dates when there is a date removal
    if( startDate.getTime() == date.getTime() ) {
        for( var key in dateMap ) {
            if( dateMap[key] ) {
                startDate = new Date(String(key));
                return;
            }
        }
    }
    if( endDate.getTime() == d3.time.day.offset(date, 1).getTime() ) {
        var tmpDateKeeper;
        for( var key in dateMap ) {
            if( dateMap[key] ) {
                tmpDateKeeper = new Date(String(key));
            }
        }
        endDate = d3.time.day.offset( tmpDateKeeper, 1 );
    }
}

var toggleDate = function(date) {
    //adding or removing a date on the chart
    var dateString = String(date);
    var trueDate = stringToDate(dateString);
    if(dateMap[trueDate]) {
        //remove date
        delete dateMap[trueDate];
        removeStartEndDates(trueDate);
        removeDate(trueDate, dateEq[date]);
    } else {
        //add date
        dateMap[trueDate] = true;
        addStartEndDates(trueDate);
        addDate(trueDate, dateEq[date]);
    }
}


$(document).ready(function() {
$.getJSON('/mnt/tradingData/datesEquity.json', function(jsonData) {
        for(var i=0; i<jsonData.dates.length; i++) {
            var tmpDate = jsonData.dates[i];
            dateEq[tmpDate] = jsonData[tmpDate];
        }

        //load json
        var tableRows = generateTableHtml(jsonData.dates);

        for(var i=0; i<tableRows.length; i++) {
            $('#dateTable').append(tableRows[i]);
        }
  });
});