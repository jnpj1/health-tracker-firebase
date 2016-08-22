var app = app || {};

// Daily journal model
app.DailyJournal = Backbone.Model.extend({
	defaults: {
		dateComparator: 0,
		dateName: '',
		totalCalories: 0,
		entryNumber: 0
	},

	// Recalculates total calorie count
	recalculateCalories: function(calories) {
		var previousCount = this.get('totalCalories');
		this.save('totalCalories', (previousCount - calories));
	},

	// Adds a new food entry for a specific food item by
	// nesting a FoodEntry model within the DailyJournal model.
	// Updates total calories count.
	appendFoodEntry: function(name, calories) {
		var number = (this.get('entryNumber') + 1);
		var entryString = 'entry' + number;
		var roundedCalories = Math.round(calories);
		var currentCalories = this.get('totalCalories');
		this.set(entryString, {foodName: name, calories: roundedCalories, entryNumber: number});
		this.set('totalCalories', (currentCalories + roundedCalories));
		this.set('entryNumber', number);
		this.save();
	},

	// Deletes food entry from model
	deleteFoodEntry: function(number) {
		this.unset(('entry' + number.toString()));
		this.save();
	}
});