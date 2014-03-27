var bit4 = bit4 || {};
bit4.yahtzee = bit4.yahtzee || {};

(function () {
	var y = bit4.yahtzee;

	y.hi = 0;
	y.intervalID = null;
	y.gameOver = false;
	y.gameState = "roll";
	y.rounds = 0;
	y.maxRounds = 13;
	y.maxRolls = 3;
	y.rolls = y.maxRolls;
	y.grandTotal = 0;
	y.diceToBeRolled = [0,1,2,3,4,5];
	y.dieValues = [0,0,0,0,0,0];
	y.upper = {};
	y.lower = {};
	y.upper.scores = {
		ones:   {score: 0, scored: false},
		twos:   {score: 0, scored: false},
		threes: {score: 0, scored: false},
		fours:  {score: 0, scored: false},
		fives:  {score: 0, scored: false},
		sixes:  {score: 0, scored: false},
		bonus:  0,
		total:  0 };	
	y.lower.scores = {
		threeOfKind:  {score: 0, scored: false},
		fourOfKind:   {score: 0, scored: false},
		fullHouse:    {score: 0, scored: false},
		smStr:        {score: 0, scored: false},
		lgStr:        {score: 0, scored: false},
		yahtzee:      {score: 0, scored: false},
		bonusYahtzee: {score: 0, scored: false},
		chance:       {score: 0, scored: false},
		total:        0 };

	y.startMsgSystem = function () {
		y.msgPointer = document.getElementById("msgBox");
		y.intervalID = setInterval(function () {
			var state = y.gameState;
			if (state === "roll") { 
				y.msgPointer.innerHTML = "Roll the dice!";	}
			else if (state === "apply") {
				y.msgPointer.innerHTML = "Apply the score!"; }
			else if (state === "game_over") {
				y.msgPointer.innerHTML = "GAME OVER";
				clearInterval(y.intervalID); }
		}, 1000);
	};
		
	y.saveHighScore = function (score) {
		if (localStorage) {
			localStorage.setItem("bit4_yahtzee_hs", score); };
	};

	y.fetchHighScore = function () {
		if (localStorage) {
			return localStorage.getItem("bit4_yahtzee_hs"); }
		else {
			return null; }
	};

	y.loadHighScore = function () {
		var score;
		score = y.fetchHighScore();
		if (score === null) {
			return; }
		else {
			y.hi = score;
			document.getElementById("hi").innerHTML = y.hi; }
	};
	
	y.resetRollsCounter = function () {
		y.rolls = y.maxRolls;
		document.getElementById("rollsLeft").innerHTML = y.rolls;
	};

	y.gameIsOver = function () {
		return (y.rounds) === y.maxRounds;
	};

	y.resetDiceContainer = function () {
		y.diceToBeRolled = [0,1,2,3,4,5];
	};

	y.resetDiceValueContainer = function () {
		var namespace = y;

		namespace.dieValues[0] = 0;
		namespace.dieValues[1] = 0;
		namespace.dieValues[2] = 0;
		namespace.dieValues[3] = 0;
		namespace.dieValues[4] = 0;
		namespace.dieValues[5] = 0;
	};

	y.clearDiceImages = function () {
		document.getElementById("d1").src = "images/diceBlank.gif";
		document.getElementById("d2").src = "images/diceBlank.gif";
		document.getElementById("d3").src = "images/diceBlank.gif";
		document.getElementById("d4").src = "images/diceBlank.gif";
		document.getElementById("d5").src = "images/diceBlank.gif";
	};

	y.unmarkDice = function () {
		document.getElementById("d1").className = "unfrozen";
		document.getElementById("d2").className = "unfrozen";
		document.getElementById("d3").className = "unfrozen";
		document.getElementById("d4").className = "unfrozen";
		document.getElementById("d5").className = "unfrozen";
	};

	y.clearForNewGame = function () {
		var upper = y.upper.scores,
				lower = y.lower.scores;

		upper.ones.score = 0;
		upper.ones.scored = false;
		upper.twos.score = 0;
		upper.twos.scored = false;
		upper.threes.score = 0;
		upper.threes.scored = false;
		upper.fours.score = 0;
		upper.fours.scored = false;
		upper.fives.score = 0;
		upper.fives.scored = false;
		upper.sixes.score = 0;
		upper.sixes.scored = false;
		upper.bonus = 0;
		upper.total = 0;

		lower.threeOfKind.score = 0;
		lower.threeOfKind.scored = false;
		lower.fourOfKind.score = 0;
		lower.fourOfKind.scored = false;
		lower.fullHouse.score = 0;
		lower.fullHouse.scored = false;
		lower.smStr.score = 0;
		lower.smStr.scored = false;
		lower.lgStr.score = 0;
		lower.lgStr.scored = false;
		lower.yahtzee.score = 0;
		lower.yahtzee.scored = false;
		lower.bonusYahtzee.score = 0;
		lower.bonusYahtzee.scored = false;
		lower.chance.score = 0;
		lower.chance.scored = false;
		lower.total = 0;

		y.resetRollsCounter();
		y.resetDiceContainer();
		y.clearDiceImages();
		y.unmarkDice();
		y.gameState = "roll";
		y.gameOver = false;
		y.rounds = 0;
		y.maxRounds = 13;
		y.grandTotal = 0;
		y.resetDiceValueContainer();

		document.getElementById("gt").innerHTML = "000";
		document.getElementById("ones").innerHTML = "-";
		document.getElementById("twos").innerHTML = "-";
		document.getElementById("threes").innerHTML = "-";
		document.getElementById("fours").innerHTML = "-";
		document.getElementById("fives").innerHTML = "-";
		document.getElementById("sixes").innerHTML = "-";
		document.getElementById("bonus").innerHTML = "0";
		document.getElementById("upperTotal").innerHTML = "0";

		document.getElementById("3kind").innerHTML = "-";
		document.getElementById("4kind").innerHTML = "-";
		document.getElementById("fh").innerHTML = "-";
		document.getElementById("smst").innerHTML = "-";
		document.getElementById("lgst").innerHTML = "-";
		document.getElementById("y").innerHTML = "-";
		document.getElementById("xy").innerHTML = "-";
		y.addClassName(document.getElementById("xydiv"), "hidden");
		document.getElementById("ch").innerHTML = "-";
		document.getElementById("lowerTotal").innerHTML = "0";

		y.addClassName(document.getElementById("playAgain"), "hidden");

		y.startMsgSystem();
	};

	y.updateHiScore = function () {
		var score = Number(document.getElementById("gt").innerHTML);
		if (score > y.hi) {
			y.hi = score;
			document.getElementById("hi").innerHTML = y.hi;
			y.saveHighScore(y.hi); }
	};

	y.clearForNextRoll = function () {
		y.resetRollsCounter();
		y.resetDiceContainer();
		y.resetDiceValueContainer();
		y.clearDiceImages();
		y.unmarkDice();
		y.gameState = "roll";

		if (y.gameIsOver()) {
			y.gameOver = true;
			y.gameState = "game_over";
			y.rolls = 0; // this will lock the game down
			y.updateHiScore();
			y.removeClassName(document.getElementById("playAgain"), "hidden"); }		
	};

	y.roll = function () {
		var i, die, roll;

		if (y.rolls === 0) {
			return;	}

		// roll the dice
		for (i = 1; i < y.diceToBeRolled.length; i++) {
			if (y.diceToBeRolled[i] !== 0) {
				die = document.getElementById("d" + i);
				roll = bit4.dice.roll1(6);
				y.dieValues[i] = roll; // save die value for quick lookup later
				die.src = "images/dice" + roll + ".gif"; } }

		// adjust roll count
		y.rolls--;
		document.getElementById("rollsLeft").innerHTML = y.rolls;		

		if (y.rolls === 0) {
			y.gameState = "apply";			
		}
	};

	y.keepThisDie = function (img, num) {
		var id = +num;

		if (y.rolls === y.maxRolls) {
			return; }

		if (y.diceToBeRolled[num] === id) {
			y.diceToBeRolled[id] = 0;			
			y.removeClassName(img, "unfrozen");
			y.addClassName(img, "frozen");
			return; }

		if (y.diceToBeRolled[id] === 0) {
			y.diceToBeRolled[id] = id;			
			y.removeClassName(img, "frozen");
			y.addClassName(img, "unfrozen");	}
	};

	y.containsClassName = function (e, name) {
		var i,
				classNames;

		classNames = e.className.split(/\s/);

		for (i = 0; i < classNames.length; i++) {
			if (classNames[i] === name) {
				return true; } }

		return false; 
	};

	y.removeClassName = function (e, name) {
		var i,
				len,
				classNames;

		if (y.containsClassName(e, name) === false) {
			return; }

		classNames = e.className.split(/\s/);
		
		for (i = 0, len = classNames.length; i < len; i++) {
			if (classNames[i] === name) {
				classNames.splice(i, 1);
				e.className = classNames.join(" ");
				return; } }
	};

	y.addClassName = function (e, name) {
		if (y.containsClassName(e, name) === false) {
			if (e.className === "") {
				e.className = name; }
			else {
				e.className = e.className + " " + name; } }
	};

	y.getDiceTotal = function () {
		var container = y.dieValues;
		return container[1] + container[2] + container[3] +
					 container[4] + container[5];
	};

	y.updateGrandTotal = function () {
		var total;
		total = y.calculateUpperTotal() +
						y.calculateLowerTotal();

		document.getElementById("gt").innerHTML = total;
	};

	y.calculateUpperTotal = function () {
		var total,
				bonus,
				scores;

		bonus = 0;
		scores = y.upper.scores;

		total = scores.ones.score + scores.twos.score + scores.threes.score +
					  scores.fours.score + scores.fives.score + scores.sixes.score;

		if (total >= 63) {
			bonus = 35;
			scores.bonus = bonus;
			document.getElementById("bonus").innerHTML = bonus;
		}

		return total + bonus;
	};

	y.calculateLowerTotal = function () {
		var total,
				scores;

		scores = y.lower.scores;

		total = scores.threeOfKind.score + scores.fourOfKind.score + scores.fullHouse.score +
						scores.smStr.score + scores.lgStr.score + scores.yahtzee.score +
						scores.bonusYahtzee.score + scores.chance.score;

		return total;
	};

	y.updateGUIscore = function (name, score) {
		var element;

		element = document.getElementById(name)
		element.innerHTML = score;
	};

	y.applyLowerSectionPoints = function (name) {
		var i,
				fullhouse,
				smStraight,
				score,
				count,
				scoreElement,
				updateLowerTotal,
				hasYahtzee;

		if (y.rolls === y.maxRolls) {
			return; }

		updateLowerTotal = function () {
			var total = y.calculateLowerTotal();
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
		for (i = 1; i < y.dieValues.length; i++) {
			count[y.dieValues[i]]++; }

		switch (name) {
			case "3kind":
				if (y.lower.scores.threeOfKind.scored === true) {
					return; }

				for (i = 1; i < count.length; i++) {
					if (count[i] >= 3) {
						score = y.getDiceTotal(); }
					y.lower.scores.threeOfKind.score = score;
					y.lower.scores.threeOfKind.scored = true; }
				break;

			case "4kind":
				if (y.lower.scores.fourOfKind.scored === true) {
					return; }

				for (i = 1; i < count.length; i++) {
					if (count[i] >= 4) {
						score = y.getDiceTotal(); }

					y.lower.scores.fourOfKind.score = score;
					y.lower.scores.fourOfKind.scored = true; }
				break;

			case "fh":
				if (y.lower.scores.fullHouse.scored === true) {
					return; }

				fullhouse = 0;

				for (i = 1; i < count.length; i++) {
					if (count[i] === 2) {
						fullhouse += 2; }
					if (count[i] === 3) {
						fullhouse += 3; } }

				if (fullhouse === 5) {
					score = 25; }

				y.lower.scores.fullHouse.score = score;
				y.lower.scores.fullHouse.scored = true;
				break;

			case "smst":
				if (y.lower.scores.smStr.scored === true) {
					return; }

				if (count[3] > 0 && count[4] > 0) {
					if ((count[5] > 0 && count[6] > 0) ||
							(count[1] > 0 && count[2] > 0) ||
							(count[2] > 0 && count[5] > 0)) {
								score = 30; } }

				y.lower.scores.smStr.score = score;
				y.lower.scores.smStr.scored = true;
				break;

			case "lgst":
			if (y.lower.scores.lgStr.scored === true) {
					return; }

				if (count[2] > 0 && count[3] > 0 && count[4] > 0 && count[5] > 0) {
					if (count[1] > 0 || count[6] > 0) {
							score = 40; } }

				y.lower.scores.lgStr.score = score;
				y.lower.scores.lgStr.scored = true;
				break;

			case "y":
				if (y.lower.scores.yahtzee.scored === true) {
						return; }

				if (hasYahtzee() === true) {
					score = 50;					
					y.removeClassName(document.getElementById("xydiv"), "hidden"); }

				y.lower.scores.yahtzee.score = score;
				y.lower.scores.yahtzee.scored = true;
				break;

			case "xy":
				if (hasYahtzee() === false) {
					return; }

				score = 100;
				y.lower.scores.bonusYahtzee.score += score;
				y.lower.scores.bonusYahtzee.scored = true;
				y.maxRounds++;
				break;

			case "ch":
				if (y.lower.scores.chance.scored === true) {
					return; }

				score = y.getDiceTotal();
				y.lower.scores.chance.score = score;
				y.lower.scores.chance.scored = true;
				break;
		}

		y.rounds++;
		y.updateGUIscore(name, score);
		updateLowerTotal();
		y.updateGrandTotal();
		y.clearForNextRoll();
	};

	y.applyUpperSectionPoints = function (name) {
		var i,
				score,
				updateUpperTotal,
				addScoreToTotals,
				scoreElement;

		if (y.rolls === y.maxRolls) {
			return; }

		updateUpperTotal = function () {
			var total = y.calculateUpperTotal();
			document.getElementById("upperTotal").innerHTML = total;
		};

		score = 0;
		switch (name) {
			case "ones":
				if (y.upper.scores.ones.scored === true) {
					return; }

				for (i = 1; i < y.dieValues.length; i++) {
					if (y.dieValues[i] === 1) {
						score++; }}

				y.upper.scores.ones.score = score;
				y.upper.scores.ones.scored = true;	
				break;

			case "twos":
				if (y.upper.scores.twos.scored === true) {
					return; }

				for (i = 1; i < y.dieValues.length; i++) {
					if (y.dieValues[i] === 2) {
						score += 2; }}

				y.upper.scores.twos.score = score;
				y.upper.scores.twos.scored = true;
				break;

			case "threes":
				if (y.upper.scores.threes.scored === true) {
					return; }

				for (i = 1; i < y.dieValues.length; i++) {
					if (y.dieValues[i] === 3) {
						score += 3; }}

				y.upper.scores.threes.score = score;
				y.upper.scores.threes.scored = true;
				break;

			case "fours":
				if (y.upper.scores.fours.scored === true) {
					return; }

				for (i = 1; i < y.dieValues.length; i++) {
					if (y.dieValues[i] === 4) {
						score += 4; }}

				y.upper.scores.fours.score = score;
				y.upper.scores.fours.scored = true;
				break;

			case "fives":
				if (y.upper.scores.fives.scored === true) {
					return; }

				for (i = 1; i < y.dieValues.length; i++) {
					if (y.dieValues[i] === 5) {
						score += 5; }}
				
				y.upper.scores.fives.score = score;
				y.upper.scores.fives.scored = true;
				break;

			case "sixes":
				if (y.upper.scores.sixes.scored === true) {
					return; }

				for (i = 1; i < y.dieValues.length; i++) {
					if (y.dieValues[i] === 6) {
						score += 6; }}
				
				y.upper.scores.sixes.score = score;
				y.upper.scores.sixes.scored = true;
				break;
		}

		y.rounds++;
		y.updateGUIscore(name, score);
		updateUpperTotal();
		y.updateGrandTotal();
		y.clearForNextRoll();
	};

	y.startMsgSystem();
	y.loadHighScore();
}());