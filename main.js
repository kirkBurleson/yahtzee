var bit4 = bit4 || {};
bit4.yahtzee = {};

(function () {
	bit4.yahtzee.checkboxesAreLocked = true;
	bit4.yahtzee.msgPointer;
	bit4.yahtzee.intervalID;
	bit4.yahtzee.gameOver = false;
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
	bit4.yahtzee.dieValues = [0,0,0,0,0,0];

	startMessages = function () {
		bit4.yahtzee.msgPointer = document.getElementById("msgBox");
		bit4.yahtzee.intervalID = setInterval(function () {
			var state = bit4.yahtzee.gameState;
			if (state === "roll") { 
				bit4.yahtzee.msgPointer.innerHTML = "Roll the dice!";	}
			else if (state === "apply") {
				bit4.yahtzee.msgPointer.innerHTML = "Apply the score!"; }
			else if (state === "game_over") {
				bit4.yahtzee.msgPointer.innerHTML = "GAME OVER"; }
		}, 1000);
	};
	

	startMessages();

	bit4.yahtzee.resetRollsCounter = function () {
		bit4.yahtzee.rolls = 3;
		document.getElementById("rollsLeft").innerHTML = bit4.yahtzee.rolls;
	};

	bit4.yahtzee.gameIsOver = function () {
		return (++bit4.yahtzee.rounds) > 13;
	};

	bit4.yahtzee.clearCheckboxes = function () {
		document.getElementById("1").checked = false;
		document.getElementById("2").checked = false;
		document.getElementById("3").checked = false;
		document.getElementById("4").checked = false;
		document.getElementById("5").checked = false;
	};

	bit4.yahtzee.resetDiceContainer = function () {
		bit4.yahtzee.diceToBeRolled = [0,1,2,3,4,5];
	};

	bit4.yahtzee.clearDiceImages = function () {
		document.getElementById("d1").src = "images/diceBlank.gif";
		document.getElementById("d2").src = "images/diceBlank.gif";
		document.getElementById("d3").src = "images/diceBlank.gif";
		document.getElementById("d4").src = "images/diceBlank.gif";
		document.getElementById("d5").src = "images/diceBlank.gif";			
	};

	bit4.yahtzee.clearForNextRoll = function () {
		bit4.yahtzee.resetRollsCounter();
		bit4.yahtzee.clearCheckboxes();
		bit4.yahtzee.resetDiceContainer();
		bit4.yahtzee.clearDiceImages();
		bit4.yahtzee.lockCheckboxes();

		if (bit4.yahtzee.gameIsOver()) {
			bit4.yahtzee.gameOver = true;
			bit4.yahtzee.gameState = "game_over";
			clearInterval(bit4.yahtzee.intervalID);
			bit4.yahtzee.rolls = 0; // this will lock the game down
			return;
		}		
	};

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
				bit4.yahtzee.dieValues[i] = roll; // save die value for quick lookup later
				die.src = "images/dice" + roll + ".gif"; } }

		// adjust roll count
		bit4.yahtzee.rolls--;
		document.getElementById("rollsLeft").innerHTML = bit4.yahtzee.rolls;
		if (bit4.yahtzee.rolls === 0) {
			bit4.yahtzee.gameState = "apply"; }
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

	bit4.yahtzee.getDiceTotal = function () {
		var container = bit4.yahtzee.dieValues;
		return container[1] + container[2] + container[3] +
					 container[4] + container[5];
	};

	bit4.yahtzee.applyLowerSectionPoints = function (button) {
		var i,
				fullhouse,
				smStraight,
				score,
				count,
				updateLowerTotal;

		if (bit4.yahtzee.rolls === 3) {
			return; }

		bit4.yahtzee.unlockCheckboxes();

		updateLowerTotal = function () {
			var scores = bit4.yahtzee.lower.scores;

			scores.total = scores.threeOfKind + scores.fourOfKind + scores.fullHouse +
										 scores.smStr + scores.lgStr + scores.yahtzee +
										 scores.bonusYahtzee + scores.chance;

			document.getElementById("lowerTotal").value = scores.total;
		};

		score = 0;
		count = [0,0,0,0,0,0,0];
		// how many of each die values do we have?
		for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
			count[bit4.yahtzee.dieValues[i]]++; }

		console.log(bit4.yahtzee.dieValues);
		console.log(count);

		switch (button.name) {
			case "3 of kind":
				for (i = 1; i < count.length; i++) {
					if (count[i] === 3) {
						score = bit4.yahtzee.getDiceTotal();
						bit4.yahtzee.lower.scores.threeOfKind = score; }}
				break;

			case "4 of kind":
				for (i = 1; i < count.length; i++) {
					if (count[i] === 4) {
						score = bit4.yahtzee.getDiceTotal();
						bit4.yahtzee.lower.scores.fourOfKind = score; }}
				break;

			case "full house":
				fullHouse = 0;

				for (i = 1; i < count.length; i++) {
					if (count[i] === 2) {
						fullHouse += 2; }
					if (count[i] === 3) {
						fullHouse += 3; }}

				if (fullHouse === 5) {
					score = 25;
					bit4.yahtzee.lower.scores.fullHouse = score; }
				break;

			case "sm straight":
				if (count[3] > 0 && count[4] > 0) {
					if ((count[5] > 0 && count[6] > 0) ||
							(count[1] > 0 && count[2] > 0) ||
							(count[2] > 0 && count[5] > 0)) {
								score = 30;
								bit4.yahtzee.lower.scores.smStr = score; }}
				break;

			case "lg straight":
				if (count[2] > 0 && count[3] > 0 && count[4] > 0 && count[5] > 0) {
					if (count[1] > 0 || count[6] > 0) {
							score = 40;
							bit4.yahtzee.lower.scores.lgStr = score; }}
				break;

			case "yahtzee":
				if (count[1] === 5 || count[2] === 5 ||
						count[3] === 5 || count[4] === 5 ||
						count[5] === 5 || count[6] === 5) {
							score = 50;
							bit4.yahtzee.lower.scores.yahtzee = score; }
				break;

			case "chance":
				score = bit4.yahtzee.getDiceTotal();
				bit4.yahtzee.lower.scores.chance = score;
				break;
		}

		button.value = score;
		button.disabled = true;
		updateLowerTotal();
		bit4.yahtzee.clearForNextRoll();
	};

	bit4.yahtzee.applyUpperSectionPoints = function (button) {
		var i,
				score,
				applyUpperBonus,
				updateUpperTotal,
				addScoreToTotals,
				clearForNextRoll;

		if (bit4.yahtzee.rolls === 3) {
			return; }

		bit4.yahtzee.unlockCheckboxes();

		applyUpperBonus = function () {
			if (bit4.yahtzee.upper.scores.total >= 63) {
				bit4.yahtzee.upper.scores.bonus = 35;
				document.getElementById("bonus").value = 35;
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

		score = 0;
		switch (button.name) {
			case "ones":
				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 1) {
						score++; }}

				bit4.yahtzee.upper.scores.ones = score;
				break;

			case "twos":
				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 2) {
						score += 2; }}

				bit4.yahtzee.upper.scores.twos = score;
				break;

			case "threes":
				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 3) {
						score += 3; }}

				bit4.yahtzee.upper.scores.threes = score;
				break;

			case "fours":
				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 4) {
						score += 4; }}

				bit4.yahtzee.upper.scores.fours = score;
				break;

			case "fives":
				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 5) {
						score += 5; }}
				
				bit4.yahtzee.upper.scores.fives = score;
				break;

			case "sixes":
				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 6) {
						score += 6; }}
				
				bit4.yahtzee.upper.scores.sixes = score;				
				break;
		}

		button.value = score;
		button.disabled = true;
		updateUpperTotal();
		applyUpperBonus();
		bit4.yahtzee.clearForNextRoll();		
		bit4.yahtzee.gameState = "roll";
	};

}());