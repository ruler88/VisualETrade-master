var datesEquityFile = '/mnt/tradingData/datesEquity.json';
var startDate = null;
var endDate = null;
var eqAttribute = null;     //which equity variable to show, i.e. ask, askSize, volume, etc
var equityMap = {};
var allDatesCache = null;
var datesJsonData = null;

var manifestSwitcher = true; //this variable switches between true and false for bar/line equity
var primaryEquity = null;
var secondaryEquity = null;

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
    for(var i=allDates.length-1; i>=0; i--) {
        //using startDateFlag to determine which dropdown
        $( "#startDateDropdown" ).append( "<li><a href=\"javascript:setDates("+allDates[i]+",true)\">" + allDates[i] + "</a></li>" );
        $( "#endDateDropdown" ).append( "<li><a href=\"javascript:setDates("+allDates[i]+",false)\">" + allDates[i] + "</a></li>" );
    }
}
var repopulateDateDropdown = function() {   //shorten enddate list 
    $( "#endDateDropdown" ).empty();
    for(var i=allDatesCache.length-1; i>=0; i--) {
        if( !startDate || stringToDate(allDatesCache[i]+"") >= startDate ) {
            $( "#endDateDropdown" ).append( "<li><a href=\"javascript:setDates("+allDatesCache[i]+",false)\">" + allDatesCache[i] + "</a></li>" );
        }
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
        allDatesCache = jsonData.dates;
        datesJsonData = jsonData;
        populateDateDropdown(jsonData.dates);
        populateEquityAttributeDropdown();
    },
    error: function() {
      alert('Error loading ' + datesEquityFile);
    }
});

var displayEquityList = function() {
    $( ".equityMargin").remove();
    for( var underlier in equityMap ) {
        var equityGroup = equityMap[underlier];
        $( "#equityButtonPlaceHolder" ).after(generateEquityButtonHtml(underlier, equityGroup));
    }
}

var loadEquityList = function() {
    if( ! (startDate && endDate) ) { return; }  //not enough data to display
    var localStartDate = startDate;
    while(localStartDate <= endDate) {
        var dateString = dateToString(localStartDate);
        var dailyEquity = datesJsonData[dateString];
        if(dailyEquity) {       //only available date
            for( var i=0; i<dailyEquity.length; i++ ) {
                var tmpEq = dailyEquity[i];
                var underlier = isUnderlier(tmpEq) ? tmpEq : extractUndelier(tmpEq);   //extract underlier if needed
                
                if( !equityMap[underlier] ) {   //initialize underlier map if it doesn't already exist
                    equityMap[underlier] = {};
                }

                if( !isUnderlier(tmpEq) ) {  //use map-of-map datastructure to store the equities
                    var optionType = getOptionType(tmpEq);
                    if( !equityMap[underlier][optionType] ) {
                        equityMap[underlier][optionType] = {};
                    }
                    equityMap[underlier][optionType][tmpEq] = true;
                }
            }
        }
        
        localStartDate = d3.time.day.offset(localStartDate, 1);
    }

    displayEquityList();
}

var setAttribute = function(attribute) {
    eqAttribute = attribute;
    $( "#eqAttrDisplay" ).empty();
    $( "#eqAttrDisplay" ).append(attribute);
    if( startDate && endDate && eqAttribute) {
        //if both dates are available, show equities
        loadEquityList();

        if( primaryEquity && secondaryEquity ) {
            showChart();
        }
    }

}

var setDates = function(dateText, startDateFlag) {
    var newDate = stringToDate(dateText+"");
    if(startDateFlag) {
        //set start date
        if(!endDate || endDate >= newDate) {
            startDate = newDate;
            $( "#startDateDisplay" ).empty();
            $( "#startDateDisplay" ).append(dateText);
        } else {
            alert("Invalid date selection");
        }
    } else {
        //set end date
        if(!startDate || startDate <= newDate) {
            endDate = newDate;
            $( "#endDateDisplay" ).empty();
            $( "#endDateDisplay" ).append(dateText);
        } else {
            alert("Invalid date selection");
        }
    }
    repopulateDateDropdown();
    if( startDate && endDate && eqAttribute) {
        //if both dates are available, show equities
        loadEquityList();
    }
}

var showChart = function() {
    var chartData = [];
    addJsonFile(startDate, endDate, false, primaryEquity, eqAttribute, chartData);
    addJsonFile(startDate, endDate, true, secondaryEquity, eqAttribute, chartData);

    addGraph(chartData);
    delete chartData;
}

var equityButtonClick = function(equityName) {
    if( !primaryEquity || manifestSwitcher ) {
        primaryEquity = equityName;
        $("#primaryEquity").text(primaryEquity);
    } else {
        secondaryEquity = equityName;
        $("#secondaryEquity").text(secondaryEquity);
    }
    manifestSwitcher = !manifestSwitcher;
    if(primaryEquity && secondaryEquity) {
        showChart();
    }
}

var dummyDataButton = function() {  //remove later
    setDates("20140214", true);
    setDates("20140221", false);
    setAttribute("ask");

    //var chartData = [];

    //addGraph(chartData);
}
