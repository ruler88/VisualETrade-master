var firstDate;
var lastDate;
var dates = [];         //dates with all equity of that date

var eqNames = [];       //live equity names
var eqCount = {};       //equity name with count
var filters = [];       //only show equities with these names

var format = "%m-%d";

var taskStatus = {  //replace with eq underlier
    "SUCCEEDED" : "bar",
    "FAILED" : "bar-failed",
    "RUNNING" : "bar-running",
    "KILLED" : "bar-killed"
};


var gantt = d3.gantt()
.taskTypes(eqNames)
.taskStatus(taskStatus)
.tickFormat(format)
.height(550).width(1200);

gantt.timeDomainMode("fixed");
gantt.tickFormat(format);

gantt(dates);
gantt.redraw(dates);



function updateEqNames() {
    eqNames.length = 0;
    for(var name in eqCount) {
        eqNames.push(name);
    }
    eqNames.sort();
}

function addAllEq(newEq) {
    //put it in the map
    for(var i=0; i<newEq.length; i++) {
        var name = String(newEq[i]);
        if( eqCount[name] ) {   //equity already exists
            eqCount[name] += 1;
        } else {                //no equity
            eqCount[name] = 1;
        }
    }
    updateEqNames();
}

function removeAllEq(rmEq) {
    //remove one day's eq from map
    for(var i=0; i<rmEq.length; i++) {
        var name = String(rmEq[i]);
        if( eqCount[name] ) {       //safety check
            eqCount[name] -= 1;
            if( eqCount[name] <= 0 ) {
                delete eqCount[name];
            }
        }
    }
    updateEqNames();    
}

function filter(dates) {
    if( filters.length == 0 ) {
        return dates;
    }

    //filtering list of equity names
    for(var i=eqNames.length; i>=0; i--) {
        for(var j=0; j<filters.length; j++) {
            if( String(eqNames[i]).indexOf(filters[j]) == -1 ) {
                eqNames.splice(i, 1);
                break;
            }
        }
    }

    var filteredDates = [];
    for(var i=dates.length-1; i>=0; i--) {
        for(var j=0; j<filters.length; j++) {
            if( String(dates[i].taskName).indexOf(filters[j]) != -1 ) {
                filteredDates.push(dates[i]);
                break;
            }
        }
    }
    return filteredDates;
}

function getStatus(date, dateEq) {
    //get expiring option
    date = d3.time.day.offset(date, 1);
    var optionDateFormat = date.getFullYear()+":"+(date.getMonth()+1)+":"+date.getDate();
    
    if( dateEq.indexOf(optionDateFormat) != -1 ) {
        return "FAILED"
    }
    return "SUCCEEDED";
}

function addDate(date, dateEqList) {
    addAllEq(dateEqList);
    var localStartDate = date;

    for(var i=0; i<dateEqList.length; i++) {
        var eqStatus = getStatus(localStartDate, String(dateEqList[i]));
        dates.push({
            "startDate" : localStartDate,
            "endDate" : d3.time.day.offset(localStartDate, 1),
            "taskName" : String(dateEqList[i]),
            "status" : eqStatus
        });
    }

    gantt.timeDomain( [startDate, endDate] );
    gantt.redraw( filter(dates) );
}

function removeDate(date, dateEqList) {
    eqNames.splice(0,1);
    removeAllEq(dateEqList);
    var localStartDate = date;
    for(var i=dates.length-1; i>=0; i--) {
        if( dates[i].startDate.getTime() == date.getTime() ) {
            dates.splice(i, 1);
        }
    }

    gantt.timeDomain( [startDate, endDate] );
    gantt.redraw( filter(dates) );
}

function addFilter(form) {
    var filterText = form.filterText.value;
    form.filterText.value = "";
    filters.push( filterText );
    $('#filterTable').append("<tr><td>"+filterText+"</td></tr>");
    gantt.redraw( filter(dates) );
}
