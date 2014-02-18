var datesEquityFile = '/mnt/tradingData/datesEquity.json';
var startDate = null;
var endDate = null;
var eqAttribute = null;     //which equity variable to show, i.e. ask, askSize, volume, etc

var attributeEnum = {
    time : 0,
    ask : 1,
    bid : 2,
    askSize : 3,
    bidSize : 4,
    numTrades : 5,
    totalVolume : 6
};

var populateDateDropdown = function(allDates) {
    for(var i=0; i<allDates.length; i++) {
        //using startDateFlag to determine which dropdown
        $( "#startDateDropdown" ).append( "<li><a href=\"javascript:setDates("+allDates[i]+",true)\">" + allDates[i] + "</a></li>" );
        $( "#endDateDropdown" ).append( "<li><a href=\"javascript:setDates("+allDates[i]+",false)\">" + allDates[i] + "</a></li>" );
    }
}

var populateEquityAttributeDropdown = function() {
    for( var attr in attributeEnum ) {
        var tmpAttr = "\'" + attr + "\'";
        $( "#equityAttributeDropdown" ).append( "<li><a href=\"javascript:setAttribute("+tmpAttr+")\">" + attr + "</a></li>" );
    }
}

//load json with equity dates
$.ajax({
    url: datesEquityFile,
    dataType: 'json',
    async: false,
    success: function(jsonData) {
        populateDateDropdown(jsonData.dates);
        populateEquityAttributeDropdown();
    },
    error: function() {
      alert('Error loading ' + datesEquityFile);
    }
});


var displayEquityList = function() {
    //TODO show equity list at bottom

}

var setAttribute = function(attribute) {
    eqAttribute = attribute;
    $( "#eqAttrDisplay" ).empty();
    $( "#eqAttrDisplay" ).append(attribute);
    if( startDate && endDate && eqAttribute) {
        //if both dates are available, show equities
        displayEquityList();
    }
}

var setDates = function(dateText, startDateFlag) {
    var newDate = stringToDate(dateText+"");
    if(startDateFlag) {
        //set start date
        if(!endDate || endDate > newDate) {
            startDate = newDate;
            $( "#startDateDisplay" ).empty();
            $( "#startDateDisplay" ).append(dateText);
        } else {
            alert("Invalid date selection");
        }
    } else {
        //set end date
        if(!startDate || startDate < newDate) {
            endDate = newDate;
            $( "#endDateDisplay" ).empty();
            $( "#endDateDisplay" ).append(dateText);
        } else {
            alert("Invalid date selection");
        }
    }

    if( startDate && endDate && eqAttribute) {
        //if both dates are available, show equities
        displayEquityList();
    }
}