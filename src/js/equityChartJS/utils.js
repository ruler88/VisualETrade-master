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