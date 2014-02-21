var bit4 = bit4 || {};
bit4.dice = (function () {
	var roll, rollMulti;

	roll = function (sides) {
		if (sides < 2) { return false; }
		return Math.floor(Math.random() * sides + 1);
	};

	rollMulti = function (sides, numDice) {
		var total;
		if (sides < 2 || numDice < 1) { return false; }

		total = roll(sides);		
		while (--numDice > 0) {
			total += roll(sides);
		};

		return total;
	};

// interface ----------------------------
	return {
		roll1: function (sides) {
			return roll(sides);
		},

		roll2: function (sides, getTotal) {
			if (getTotal === true) {
				return rollMulti(sides, 2);
			}

			return [roll(sides),
							roll(sides)];
		},

		roll3: function (sides, getTotal) {
			if (getTotal === true) {
				return rollMulti(sides, 3);
			}

			return [roll(sides),
							roll(sides),
							roll(sides)];
		},

		roll4: function (sides, getTotal) {
			if (getTotal === true) {
				return rollMulti(sides, 4);
			}

			return [roll(sides),
							roll(sides),
							roll(sides),
							roll(sides)];
		},

		roll5: function (sides, getTotal) {
			if (getTotal === true) {
				return rollMulti(sides, 5);
			}

			return [roll(sides),
							roll(sides),
							roll(sides),
							roll(sides),
							roll(sides)];		
		}
	};
}());