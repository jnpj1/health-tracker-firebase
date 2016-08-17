var app = app || {};

// Food Entry model for individual entries
app.FoodEntry = Backbone.Model.extend({
	defaults: {
		foodName: '',
		calories: 0,
		entryNumber: 0
	}
});

// Complete daily journal model
app.DailyJournal = Backbone.Model.extend({
	defaults: {
		dateComparator: 0,
		dateName: '',
		totalCalories: 0
	},

	// Returns the number that should be used as next entry
	// based on the number of food entries currently in model
	determineEntryNumber: function() {
		var i = 1;
		var entryString = 'entry' + i.toString();

		while(this.has(entryString)) {
			i++;
			entryString = 'entry' + i.toString();
		}

		return i;
	},

	// Recalculates total calorie count
	recalculateCalories: function(calories) {
		var previousCount = this.get('totalCalories');
		this.set('totalCalories', (previousCount - calories));
	},

	// Adds a new food entry for a specific food item by
	// nesting a FoodEntry model within the DailyJournal model.
	// Updates total calories count.
	appendFoodEntry: function(name, calories) {
		var number = this.determineEntryNumber().toString();
		var entryString = 'entry' + number;
		var roundedCalories = Math.round(calories);
		var currentCalories = this.get('totalCalories');
		this.set(entryString, new app.FoodEntry());
		this.get(entryString).set({foodName: name, calories: roundedCalories, entryNumber: number});
		this.set('totalCalories', (currentCalories + roundedCalories));
	}
});