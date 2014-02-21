var bit4 = bit4 || {};

bit4.utilities = bit4.utilities || {};

bit4.utilities.addHandler = function (element, typeOfEvent, handler) {
	if (element.addEventListener) {
		element.addEventListener(typeOfEvent, handler, false);}
	else if (element.attachEvent) {
		element.attachEvent("on" + typeOfEvent, handler);}
	else {
		element["on" + typeOfEvent] = handler;}
};