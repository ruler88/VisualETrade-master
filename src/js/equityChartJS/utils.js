var dateFilepathString = function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + "/" + 
    	String("00"+month).slice(-2) + "/" +
    	String("00"+day).slice(-2);
}

var isUnderlier = function(equityName) {
	if(equityName.indexOf(":") == -1) {
		return true;
	}
	return false;
}

var extractUndelier = function(equityName) {
	return equityName.split(":")[0];
}

var getOptionType = function(equityName) {
	return equityName.split(":")[4];
}

var getOptionStrikePrice = function(equityName) {
	return parseFloat(equityName.split(":")[5]);
}

var getExpirationDate = function(equityName) {
	return equityName.split(":")[2] + "-" + 
		equityName.split(":")[3];
}

var generateCallPutButtons = function(callPutMap) {
	if(!callPutMap) { return ""; }
	
	var sortOptions = [];
	for( var option in callPutMap ) {
		sortOptions.push(option);
	}
	sortOptions.sort();

	var htmlString = "";
	htmlString += "<div class=\'optionBlock\'>";
	for( var i in sortOptions ) {
		var option = sortOptions[i];
		htmlString += "<button type=\'button\' class=\'btn btn-primary btn-sm optionButton\' " + 
			"onclick=\'equityButtonClick(\"" + option + "\")\'>";		//individual option buttons
		htmlString += getOptionType(option) + " " + 
			getExpirationDate(option) + " " +
			getOptionStrikePrice(option);
		htmlString += "</button>";
	}
	htmlString += "</div>";

	return htmlString;
}

var generateEquityButtonHtml = function(underlier, optionMap) {
	var htmlString = "";
	htmlString += "<div class=\'equityMargin\'>";
	htmlString += "<div class=\'underlier\'>";
	htmlString += "<button type=\'button\' class=\'btn btn-primary btn-lg underlier\' " +
		"onclick=\'equityButtonClick(\"" + underlier + "\")\'>";
	htmlString += underlier + "</button>";
	htmlString += "</div>";

	htmlString += generateCallPutButtons(optionMap["CALL"]);
	htmlString += generateCallPutButtons(optionMap["PUT"]);
	htmlString += "</div";
	return htmlString;
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

/*
<div class="equityMargin" id="equityButtons">
    <div class="underlier">
      <button type="button" class="btn btn-primary btn-lg underlier">GOOG</button>
    </div>
    <div class="optionBlock">
      <button type="button" class="btn btn-primary btn-sm optionButton">A</button>
      <button type="button" class="btn btn-primary btn-sm optionButton">B</button>

    </div>
    <div class="optionBlock">
      <button type="button" class="btn btn-primary btn-sm optionButton">C</button>
    </div>
</div>

*/