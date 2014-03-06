var bit4 = bit4 || {};
bit4.yahtzee = bit4.yahtzee || {};

(function () {
	bit4.yahtzee.msgPointer;
	bit4.yahtzee.hi = 0;
	bit4.yahtzee.intervalID;
	bit4.yahtzee.gameOver = false;
	bit4.yahtzee.gameState = "roll";
	bit4.yahtzee.rounds = 0;
	bit4.yahtzee.maxRounds = 13;
	bit4.yahtzee.maxRolls = 3;
	bit4.yahtzee.rolls = bit4.yahtzee.maxRolls;
	bit4.yahtzee.grandTotal = 0;
	bit4.yahtzee.diceToBeRolled = [0,1,2,3,4,5];
	bit4.yahtzee.dieValues = [0,0,0,0,0,0];
	bit4.yahtzee.upper = {};
	bit4.yahtzee.lower = {};
	bit4.yahtzee.upper.scores = {
		ones:   {score: 0, scored: false},
		twos:   {score: 0, scored: false},
		threes: {score: 0, scored: false},
		fours:  {score: 0, scored: false},
		fives:  {score: 0, scored: false},
		sixes:  {score: 0, scored: false},
		bonus:  0,
		total:  0 };	
	bit4.yahtzee.lower.scores = {
		threeOfKind:  {score: 0, scored: false},
		fourOfKind:   {score: 0, scored: false},
		fullHouse:    {score: 0, scored: false},
		smStr:        {score: 0, scored: false},
		lgStr:        {score: 0, scored: false},
		yahtzee:      {score: 0, scored: false},
		bonusYahtzee: {score: 0, scored: false},
		chance:       {score: 0, scored: false},
		total:        0 };	

	// start the message system
	(function () {
		bit4.yahtzee.msgPointer = document.getElementById("msgBox");
		bit4.yahtzee.intervalID = setInterval(function () {
			var state = bit4.yahtzee.gameState;
			if (state === "roll") { 
				bit4.yahtzee.msgPointer.innerHTML = "Roll the dice!";	}
			else if (state === "apply") {
				bit4.yahtzee.msgPointer.innerHTML = "Apply the score!"; }
			else if (state === "game_over") {
				bit4.yahtzee.msgPointer.innerHTML = "GAME OVER";
				clearInterval(bit4.yahtzee.intervalID); }
		}, 1000);
	}());

	bit4.yahtzee.resetRollsCounter = function () {
		bit4.yahtzee.rolls = bit4.yahtzee.maxRolls;
		document.getElementById("rollsLeft").innerHTML = bit4.yahtzee.rolls;
	};

	bit4.yahtzee.gameIsOver = function () {
		return (bit4.yahtzee.rounds) === bit4.yahtzee.maxRounds;
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

	bit4.yahtzee.unmarkDice = function () {
		document.getElementById("d1").className = "unfrozen";
		document.getElementById("d2").className = "unfrozen";
		document.getElementById("d3").className = "unfrozen";
		document.getElementById("d4").className = "unfrozen";
		document.getElementById("d5").className = "unfrozen";
	};

	bit4.yahtzee.updateHiScore = function () {
		var score = Number(document.getElementById("gt").innerHTML);
		if (score > bit4.yahtzee.hi) {
			bit4.yahtzee.hi = score;
			document.getElementById("hi").innerHTML = bit4.yahtzee.hi; }
	};

	bit4.yahtzee.clearForNextRoll = function () {
		bit4.yahtzee.resetRollsCounter();
		bit4.yahtzee.resetDiceContainer();
		bit4.yahtzee.clearDiceImages();
		bit4.yahtzee.unmarkDice();
		bit4.yahtzee.gameState = "roll";

		if (bit4.yahtzee.gameIsOver()) {
			bit4.yahtzee.gameOver = true;
			bit4.yahtzee.gameState = "game_over";
			bit4.yahtzee.rolls = 0; // this will lock the game down
			bit4.yahtzee.clearDiceImages();
			bit4.yahtzee.unmarkDice();
			bit4.yahtzee.updateHiScore();
		}		
	};

	bit4.yahtzee.roll = function () {
		var i, die, roll;

		if (bit4.yahtzee.rolls === 0) {
			return;	}

		// roll the dice
		for (i = 1; i < bit4.yahtzee.diceToBeRolled.length; i++) {
			if (bit4.yahtzee.diceToBeRolled[i] !== 0) {
				die = document.getElementById("d" + i);
				roll = bit4.dice.roll1(6);
				bit4.yahtzee.dieValues[i] = roll; // save die value for quick lookup later
				die.src = "images/dice" + roll + ".gif"; } }

		// adjust roll count
		bit4.yahtzee.rolls--;
		document.getElementById("rollsLeft").innerHTML = bit4.yahtzee.rolls;		

		if (bit4.yahtzee.rolls === 0) {
			bit4.yahtzee.gameState = "apply";			
		}
	};

	bit4.yahtzee.keepThisDie = function (img, num) {
		var id = +num;

		if (bit4.yahtzee.rolls === bit4.yahtzee.maxRolls) {
			return; }

		if (bit4.yahtzee.diceToBeRolled[num] === id) {
			bit4.yahtzee.diceToBeRolled[id] = 0;			
			bit4.yahtzee.removeClassName(img, "unfrozen");
			bit4.yahtzee.addClassName(img, "frozen");
			return; }

		if (bit4.yahtzee.diceToBeRolled[id] === 0) {
			bit4.yahtzee.diceToBeRolled[id] = id;			
			bit4.yahtzee.removeClassName(img, "frozen");
			bit4.yahtzee.addClassName(img, "unfrozen");	}
	};

	bit4.yahtzee.containsClassName = function (e, name) {
		var i,
				classNames;

		classNames = e.className.split(/\s/);

		for (i = 0; i < classNames.length; i++) {
			if (classNames[i] === name) {
				return true; } }

		return false; 
	};

	bit4.yahtzee.removeClassName = function (e, name) {
		var i,
				len,
				classNames;

		if (bit4.yahtzee.containsClassName(e, name) === false) {
			return; }

		classNames = e.className.split(/\s/);
		
		for (i = 0, len = classNames.length; i < len; i++) {
			if (classNames[i] === name) {
				classNames.splice(i, 1);
				e.className = classNames.join(" ");
				return; } }
	};

	bit4.yahtzee.addClassName = function (e, name) {
		if (bit4.yahtzee.containsClassName(e, name) === false) {
			if (e.className === "") {
				e.className = name; }
			else {
				e.className = e.className + " " + name; } }
	};

	bit4.yahtzee.getDiceTotal = function () {
		var container = bit4.yahtzee.dieValues;
		return container[1] + container[2] + container[3] +
					 container[4] + container[5];
	};

	bit4.yahtzee.updateGrandTotal = function () {
		var total;
		total = bit4.yahtzee.calculateUpperTotal() +
						bit4.yahtzee.calculateLowerTotal();

		document.getElementById("gt").innerHTML = total;
	};

	bit4.yahtzee.calculateUpperTotal = function () {
		var total,
				bonus,
				scores;

		bonus = 0;
		scores = bit4.yahtzee.upper.scores;

		total = scores.ones.score + scores.twos.score + scores.threes.score +
					  scores.fours.score + scores.fives.score + scores.sixes.score;

		if (total >= 63) {
			bonus = 35;
			scores.bonus = bonus;
			document.getElementById("bonus").innerHTML = bonus;
		}

		return total + bonus;
	};

	bit4.yahtzee.calculateLowerTotal = function () {
		var total,
				scores;

		scores = bit4.yahtzee.lower.scores;

		total = scores.threeOfKind.score + scores.fourOfKind.score + scores.fullHouse.score +
						scores.smStr.score + scores.lgStr.score + scores.yahtzee.score +
						scores.bonusYahtzee.score + scores.chance.score;

		return total;
	};

	bit4.yahtzee.updateGUIscore = function (name, score) {
		var element;

		element = document.getElementById(name)
		element.innerHTML = score;
	};

	bit4.yahtzee.applyLowerSectionPoints = function (name) {
		var i,
				fullhouse,
				smStraight,
				score,
				count,
				scoreElement,
				updateLowerTotal,
				hasYahtzee;

		if (bit4.yahtzee.rolls === bit4.yahtzee.maxRolls) {
			return; }

		updateLowerTotal = function () {
			var total = bit4.yahtzee.calculateLowerTotal();
			document.getElementById("lowerTotal").innerHTML = total;
		};

		hasYahtzee = function () {
			return (count[1] === 5 || count[2] === 5 ||
							count[3] === 5 || count[4] === 5 ||
							count[5] === 5 || count[6] === 5);
		};

		score = 0;
		count = [0,0,0,0,0,0,0];
		// how many of each die values do we have?
		for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
			count[bit4.yahtzee.dieValues[i]]++; }

		switch (name) {
			case "3kind":
				if (bit4.yahtzee.lower.scores.threeOfKind.scored === true) {
					return; }

				for (i = 1; i < count.length; i++) {
					if (count[i] >= 3) {
						score = bit4.yahtzee.getDiceTotal(); }
					bit4.yahtzee.lower.scores.threeOfKind.score = score;
					bit4.yahtzee.lower.scores.threeOfKind.scored = true; }
				break;

			case "4kind":
				if (bit4.yahtzee.lower.scores.fourOfKind.scored === true) {
					return; }

				for (i = 1; i < count.length; i++) {
					if (count[i] >= 4) {
						score = bit4.yahtzee.getDiceTotal(); }

					bit4.yahtzee.lower.scores.fourOfKind.score = score;
					bit4.yahtzee.lower.scores.fourOfKind.scored = true; }
				break;

			case "fh":
				if (bit4.yahtzee.lower.scores.fullHouse.scored === true) {
					return; }

				fullHouse = 0;

				for (i = 1; i < count.length; i++) {
					if (count[i] === 2) {
						fullHouse += 2; }
					if (count[i] === 3) {
						fullHouse += 3; } }

				if (fullHouse === 5) {
					score = 25; }

				bit4.yahtzee.lower.scores.fullHouse.score = score;
				bit4.yahtzee.lower.scores.fullHouse.scored = true;
				break;

			case "smst":
				if (bit4.yahtzee.lower.scores.smStr.scored === true) {
					return; }

				if (count[3] > 0 && count[4] > 0) {
					if ((count[5] > 0 && count[6] > 0) ||
							(count[1] > 0 && count[2] > 0) ||
							(count[2] > 0 && count[5] > 0)) {
								score = 30; } }

				bit4.yahtzee.lower.scores.smStr.score = score;
				bit4.yahtzee.lower.scores.smStr.scored = true;
				break;

			case "lgst":
			if (bit4.yahtzee.lower.scores.lgStr.scored === true) {
					return; }

				if (count[2] > 0 && count[3] > 0 && count[4] > 0 && count[5] > 0) {
					if (count[1] > 0 || count[6] > 0) {
							score = 40; } }

				bit4.yahtzee.lower.scores.lgStr.score = score;
				bit4.yahtzee.lower.scores.lgStr.scored = true;
				break;

			case "y":
				if (bit4.yahtzee.lower.scores.yahtzee.scored === true) {
						return; }

				if (hasYahtzee() === true) {
					score = 50;					
					bit4.yahtzee.removeClassName(document.getElementById("xydiv"), "hidden"); }

				bit4.yahtzee.lower.scores.yahtzee.score = score;
				bit4.yahtzee.lower.scores.yahtzee.scored = true;
				break;

			case "xy":
				if (hasYahtzee() === false) {
					return; }

				score = 100;
				bit4.yahtzee.lower.scores.bonusYahtzee.score += score;
				bit4.yahtzee.lower.scores.bonusYahtzee.scored = true;
				bit4.yahtzee.maxRounds++;
				break;

			case "ch":
				if (bit4.yahtzee.lower.scores.chance.scored === true) {
					return; }

				score = bit4.yahtzee.getDiceTotal();
				bit4.yahtzee.lower.scores.chance.score = score;
				bit4.yahtzee.lower.scores.chance.scored = true;
				break;
		}

		bit4.yahtzee.rounds++;
		bit4.yahtzee.updateGUIscore(name, score);
		updateLowerTotal();
		bit4.yahtzee.updateGrandTotal();
		bit4.yahtzee.clearForNextRoll();
	};

	bit4.yahtzee.applyUpperSectionPoints = function (name) {
		var i,
				score,
				updateUpperTotal,
				addScoreToTotals,
				scoreElement,
				clearForNextRoll;

		if (bit4.yahtzee.rolls === bit4.yahtzee.maxRolls) {
			return; }

		updateUpperTotal = function () {
			var total = bit4.yahtzee.calculateUpperTotal();
			document.getElementById("upperTotal").innerHTML = total;
		};

		score = 0;
		switch (name) {
			case "ones":
				if (bit4.yahtzee.upper.scores.ones.scored === true) {
					return; }

				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 1) {
						score++; }}

				bit4.yahtzee.upper.scores.ones.score = score;
				bit4.yahtzee.upper.scores.ones.scored = true;	
				break;

			case "twos":
				if (bit4.yahtzee.upper.scores.twos.scored === true) {
					return; }

				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 2) {
						score += 2; }}

				bit4.yahtzee.upper.scores.twos.score = score;
				bit4.yahtzee.upper.scores.twos.scored = true;
				break;

			case "threes":
				if (bit4.yahtzee.upper.scores.threes.scored === true) {
					return; }

				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 3) {
						score += 3; }}

				bit4.yahtzee.upper.scores.threes.score = score;
				bit4.yahtzee.upper.scores.threes.scored = true;
				break;

			case "fours":
				if (bit4.yahtzee.upper.scores.fours.scored === true) {
					return; }

				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 4) {
						score += 4; }}

				bit4.yahtzee.upper.scores.fours.score = score;
				bit4.yahtzee.upper.scores.fours.scored = true;
				break;

			case "fives":
				if (bit4.yahtzee.upper.scores.fives.scored === true) {
					return; }

				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 5) {
						score += 5; }}
				
				bit4.yahtzee.upper.scores.fives.score = score;
				bit4.yahtzee.upper.scores.fives.scored = true;
				break;

			case "sixes":
				if (bit4.yahtzee.upper.scores.sixes.scored === true) {
					return; }

				for (i = 1; i < bit4.yahtzee.dieValues.length; i++) {
					if (bit4.yahtzee.dieValues[i] === 6) {
						score += 6; }}
				
				bit4.yahtzee.upper.scores.sixes.score = score;
				bit4.yahtzee.upper.scores.sixes.scored = true;
				break;
		}

		bit4.yahtzee.rounds++;
		bit4.yahtzee.updateGUIscore(name, score);
		updateUpperTotal();
		bit4.yahtzee.updateGrandTotal();
		bit4.yahtzee.clearForNextRoll();
	};

}());