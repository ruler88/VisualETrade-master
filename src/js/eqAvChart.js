var firstDate;
var lastDate;
var dates = [];         //dates with all equity of that date

var eqNames = [];       //live equity names
var eqCount = {};       //equity name with count
var filters = ["GOOG"];       //only show equities with these names

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
.height(600).width(1200);

gantt.timeDomainMode("fixed");
gantt.tickFormat(format);

gantt(dates);
gantt.redraw(dates);

function updateEqNames() {
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

    for(var j=filters.length; j>=0; j--) {
        if( eqNames[j].indexOf(filters[j]) == -1 ) {
            eqNames.splice(j, 1);
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

function addDate(date, dateEqList) {
    addAllEq(dateEqList);
    var localStartDate = date;

    for(var i=0; i<dateEqList.length; i++) {
        dates.push({
            "startDate" : localStartDate,
            "endDate" : d3.time.day.offset(localStartDate, 1),
            "taskName" : String(dateEqList[i]),
            "status" : "SUCCEEDED"
        });
    }

    gantt.timeDomain( [startDate, endDate] );
    gantt.redraw( filter(dates) );
}

function removeDate(date, dateEqList) {
    eqNames.splice(0,1);
    var localStartDate = date;
    for(var i=dates.length-1; i>=0; i--) {
        if( dates[i].startDate.getTime() == date.getTime() ) {
            dates.splice(i, 1);
        }
    }

    gantt.timeDomain( [startDate, endDate] );
    gantt.redraw( filter(dates) );
}

function getEndDate() {
    var lastEndDate = Date.now();
    if (tasks.length > 0) {
    lastEndDate = tasks[tasks.length - 1].endDate;
    }

    return lastEndDate;
}

