var firstDate;
var lastDate;
var dates = [
{"startDate":new Date("Sun Dec 09 01:36:45 EST 2013"),
"endDate":new Date("Sun Dec 11 02:36:45 EST 2013"),
"taskName":"E Job","status":"RUNNING"}];

var eqNames = [];
var eqCount = {};

var format = "%m-%d";

var taskStatus = {  //replace with eq underlier
    "SUCCEEDED" : "bar",
    "FAILED" : "bar-failed",
    "RUNNING" : "bar-running",
    "KILLED" : "bar-killed"
};


var gantt = d3.gantt().taskTypes(eqNames).taskStatus(taskStatus).tickFormat(format).height(450).width(1000);

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
    gantt.redraw(dates);
}

function removeDate(date, dateEqList) {
    removeAllEq(dateEqList);

    var localStartDate = date;
    for(var i=0; i<dates.length; i++) {
        console.log(dates[i]);
    }
}

function getEndDate() {
    var lastEndDate = Date.now();
    if (tasks.length > 0) {
    lastEndDate = tasks[tasks.length - 1].endDate;
    }

    return lastEndDate;
}

