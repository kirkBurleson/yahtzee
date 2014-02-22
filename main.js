var bit4 = bit4 || {};
bit4.yahtzee = {};

(function () {
	bit4.yahtzee.rounds = 0;
	bit4.yahtzee.rolls = 3;
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
	bit4.yahtzee.diceTotals = [0,0,0,0,0,0];

	bit4.yahtzee.roll = function () {
		var i, die, roll;

		if (bit4.yahtzee.rolls === 0) {
			return;	}		

		// roll the dice
		for (i = 1; i < bit4.yahtzee.diceToBeRolled.length; i++) {
			if (bit4.yahtzee.diceToBeRolled[i] !== undefined) {
				die = document.getElementById("d" + i);
				roll = bit4.dice.roll1(6);
				bit4.yahtzee.diceTotals[i] = roll; // save die value for quick lookup later
				die.src = "images/dice" + roll + ".gif"; } }

		// adjust roll count
		bit4.yahtzee.rolls--;
		document.getElementById("rollsLeft").innerHTML = bit4.yahtzee.rolls;
	};

	bit4.yahtzee.keepIt = function (checkbox) {
		var id = checkbox.id;

		if (checkbox.checked === true) {
			delete bit4.yahtzee.diceToBeRolled[id];
			return; }

		if (checkbox.checked === false) {
			bit4.yahtzee.diceToBeRolled[id] = id; }
	};

	bit4.yahtzee.applyLowerSectionPoints = function (button) {

	};

	bit4.yahtzee.applyUpperSectionPoints = function (button) {
		var i, score, checkForBonus, adjustTotals, addScoreToTotals, clearForNextRoll;

		if (bit4.yahtzee.rolls !== 0) {
			return; }

		checkForBonus = function () {
			if (bit4.yahtzee.upper.scores.total >= 63) {
				bit4.yahtzee.upper.scores.bonus = 35;
				adjustTotals();
			}
		};

		adjustTotals = function () {
			// add upper totals and show in 'Total' column
			bit4.yahtzee.upper.scores.total =
				bit4.yahtzee.upper.scores.ones +
				bit4.yahtzee.upper.scores.twos +
				bit4.yahtzee.upper.scores.threes +
				bit4.yahtzee.upper.scores.fours +
				bit4.yahtzee.upper.scores.fives +
				bit4.yahtzee.upper.scores.sixes +
				bit4.yahtzee.upper.scores.bonus;

			document.getElementById("upperTotal").value = bit4.yahtzee.upper.scores.total;
		};

		clearForNextRoll = function () {
			if (++bit4.yahtzee.rounds > 13) {
				bit4.yahtzee.gameOver = true; }

			// set number of rolls left
			bit4.yahtzee.rolls = 3;
			document.getElementById("rollsLeft").innerHTML = bit4.yahtzee.rolls;

			// uncheck checkboxes
			document.getElementById("1").checked = false;
			document.getElementById("2").checked = false;
			document.getElementById("3").checked = false;
			document.getElementById("4").checked = false;
			document.getElementById("5").checked = false;

			// reset dice to be rolled
			bit4.yahtzee.diceToBeRolled = [0,1,2,3,4,5];
		};

		score = 0;
		switch (button.name) {
			case "ones":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 1) {
						score++; }}

				button.value = score;
				bit4.yahtzee.upper.scores.ones = score;
				button.disabled = true;
				adjustTotals();
				clearForNextRoll();
				checkForBonus();
				break;

			case "twos":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 2) {
						score += 2; }}

				button.value = score;
				bit4.yahtzee.upper.scores.twos = score;
				button.disabled = true;
				adjustTotals();
				clearForNextRoll();
				checkForBonus();
				break;

			case "threes":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 3) {
						score += 3; }}

				button.value = score;
				bit4.yahtzee.upper.scores.threes = score;
				button.disabled = true;
				adjustTotals();
				clearForNextRoll();
				checkForBonus();
				break;

			case "fours":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 4) {
						score += 4; }}

				button.value = score;
				bit4.yahtzee.upper.scores.fours = score;
				button.disabled = true;
				adjustTotals();
				clearForNextRoll();
				checkForBonus();
				break;

			case "fives":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 5) {
						score += 5; }}

				button.value = score;
				bit4.yahtzee.upper.scores.fives = score;
				button.disabled = true;
				adjustTotals();
				clearForNextRoll();
				checkForBonus();
				break;

			case "sixes":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 6) {
						score += 6; }}

				button.value = score;
				bit4.yahtzee.upper.scores.sixes = score;
				button.disabled = true;
				adjustTotals();
				clearForNextRoll();
				checkForBonus();
				break;
		}
	};

}());