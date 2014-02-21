var bit4, roll;
bit4 = bit4 || {};
bit4.yahtzee = {};

(function () {
	bit4.yahtzee.grandTotal = 0;
	bit4.yahtzee.upper = {};
	bit4.yahtzee.lower = {};
	bit4.yahtzee.upper.scores = {
		ones: 0,
		twos: 0,
		threes: 0,
		fours: 0,
		fives: 0,
		sixes: 0,
		bonus: 0,
		total: 0};	
	bit4.yahtzee.lower.scores = {
		threeOfKind: 0,
		fourOfKind: 0,
		fullHouse: 0,
		smStr: 0,
		lgStr: 0,
		yahtzee: 0,
		bonusYahtzee: 0,
		chance: 0,
		total: 0};
	bit4.yahtzee.diceToBeRolled = [0,1,2,3,4,5];

	// methods
	bit4.yahtzee.roll = function () {
		var i, die;

		for (i = 1; i < bit4.yahtzee.diceToBeRolled.length; i++) {
			if (bit4.yahtzee.diceToBeRolled[i] === undefined) {
				continue;}

			die = document.getElementById("d" + i);
			roll = bit4.dice.roll1(6);
			die.src = "images/dice" + roll + ".gif";}
	};

	bit4.yahtzee.keepIt = function (checkbox) {
		var id = checkbox.id;

		if (checkbox.checked === true) {
			delete bit4.yahtzee.diceToBeRolled[id];
			return;}

		if (checkbox.checked === false) {
			bit4.yahtzee.diceToBeRolled[id] = id;}

	};

}());