var bit4 = bit4 || {};
bit4.yahtzee = {};

(function () {
	bit4.yahtzee.checkboxesAreLocked = true;
	bit4.yahtzee.msgPointer;
	bit4.yahtzee.intervalID;
	bit4.yahtzee.gameState = "roll";
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

	startMessages = function () {
		bit4.yahtzee.msgPointer = document.getElementById("msgBox");
		bit4.yahtzee.intervalID = setInterval(function () {
			var state = bit4.yahtzee.gameState;
			if (state === "roll") { 
				bit4.yahtzee.msgPointer.innerHTML = "Roll the dice!";
			}
		}, 1000);
	};
	

	startMessages();

	bit4.yahtzee.lockCheckboxes = function () {
		bit4.yahtzee.checkboxesAreLocked = true;
	};

	bit4.yahtzee.unlockCheckboxes = function () {
		bit4.yahtzee.checkboxesAreLocked = false;
	};

	bit4.yahtzee.roll = function () {
		var i, die, roll;

		if (bit4.yahtzee.rolls === 0) {
			return;	}

		if (bit4.yahtzee.checkboxesAreLocked) {
			bit4.yahtzee.unlockCheckboxes();
		}

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
		if (bit4.yahtzee.rolls === 0) {
			bit4.yahtzee.gameState = "Apply the score!"; }
	};

	bit4.yahtzee.keepThisDie = function (checkbox) {
		var id;

		// return if checkboxes are locked
		if (bit4.yahtzee.checkboxesAreLocked) {
			checkbox.checked = false;
			return; }

		id = checkbox.id;

		if (checkbox.checked === true) {
			delete bit4.yahtzee.diceToBeRolled[id];
			return; }

		if (checkbox.checked === false) {
			bit4.yahtzee.diceToBeRolled[id] = id; }
	};

	bit4.yahtzee.applyLowerSectionPoints = function (button) {

	};

	bit4.yahtzee.applyUpperSectionPoints = function (button) {
		var i,
				score,
				applyUpperBonus,
				updateUpperTotal,
				addScoreToTotals,
				clearForNextRoll;

		// must use all rolls before applying the score
		if (bit4.yahtzee.rolls !== 0) {
			return; }

		bit4.yahtzee.unlockCheckboxes();

		applyUpperBonus = function () {
			if (bit4.yahtzee.upper.scores.total >= 63) {
				bit4.yahtzee.upper.scores.bonus = 35;
				updateUpperTotal();
			}
		};

		updateUpperTotal = function () {
			var scores = bit4.yahtzee.upper.scores;

			scores.total = scores.ones + scores.twos + scores.threes +
										 scores.fours + scores.fives + scores.sixes +
										 scores.bonus;

			document.getElementById("upperTotal").value = bit4.yahtzee.upper.scores.total;
		};

		resetRollsCounter = function () {
			bit4.yahtzee.rolls = 3;
			document.getElementById("rollsLeft").innerHTML = bit4.yahtzee.rolls;
		};

		gameIsOver = function () {
			return (++bit4.yahtzee.rounds) > 13;
		};

		clearCheckboxes = function () {
			document.getElementById("1").checked = false;
			document.getElementById("2").checked = false;
			document.getElementById("3").checked = false;
			document.getElementById("4").checked = false;
			document.getElementById("5").checked = false;
		};

		resetDiceContainer = function () {
			bit4.yahtzee.diceToBeRolled = [0,1,2,3,4,5];
		};

		clearDiceImages = function () {
			document.getElementById("d1").src = "images/diceBlank.gif";
			document.getElementById("d2").src = "images/diceBlank.gif";
			document.getElementById("d3").src = "images/diceBlank.gif";
			document.getElementById("d4").src = "images/diceBlank.gif";
			document.getElementById("d5").src = "images/diceBlank.gif";			
		};

		clearForNextRoll = function () {
			if (gameIsOver()) {
				bit4.yahtzee.gameOver = true;
				bit4.yahtzee.gameState = "GAME OVER";
				clearInterval(bit4.yahtzee.intervalID);
				return;
			}

			resetRollsCounter();
			clearCheckboxes();
			resetDiceContainer();
			clearDiceImages();
			bit4.yahtzee.lockCheckboxes();
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
				updateUpperTotal();
				clearForNextRoll();
				applyUpperBonus();
				break;

			case "twos":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 2) {
						score += 2; }}

				button.value = score;
				bit4.yahtzee.upper.scores.twos = score;
				button.disabled = true;
				updateUpperTotal();
				clearForNextRoll();
				applyUpperBonus();
				break;

			case "threes":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 3) {
						score += 3; }}

				button.value = score;
				bit4.yahtzee.upper.scores.threes = score;
				button.disabled = true;
				updateUpperTotal();
				clearForNextRoll();
				applyUpperBonus();
				break;

			case "fours":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 4) {
						score += 4; }}

				button.value = score;
				bit4.yahtzee.upper.scores.fours = score;
				button.disabled = true;
				updateUpperTotal();
				clearForNextRoll();
				applyUpperBonus();
				break;

			case "fives":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 5) {
						score += 5; }}

				button.value = score;
				bit4.yahtzee.upper.scores.fives = score;
				button.disabled = true;
				updateUpperTotal();
				clearForNextRoll();
				applyUpperBonus();
				break;

			case "sixes":
				for (i = 1; i < 6; i++) {
					if (bit4.yahtzee.diceTotals[i] === 6) {
						score += 6; }}

				button.value = score;
				bit4.yahtzee.upper.scores.sixes = score;
				button.disabled = true;
				updateUpperTotal();
				clearForNextRoll();
				applyUpperBonus();
				break;
		}
		bit4.yahtzee.gameState = "Roll the dice!";
	};

}());