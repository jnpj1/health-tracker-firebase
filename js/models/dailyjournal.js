var app = app || {};

app.FoodEntry = Backbone.Model.extend({
	defaults: {
		foodName: '',
		calories: 0,
		entryNumber: 0
	}
});

app.DailyJournal = Backbone.Model.extend({
	defaults: {
		dateComparator: 0,
		dateName: '',
		totalCalories: 0
	},

	determineEntryNumber: function() {
		var i = 1;
		var entryString = 'entry' + i.toString();

		while(this.has(entryString)) {
			i++;
			entryString = 'entry' + i.toString();
		}

		return i;
	},

	appendFoodEntry: function(name, calories) {
		var number = this.determineEntryNumber();
		var entryString = 'entry' + (number);
		var roundedCalories = Math.round(calories);
		var currentCalories = this.get('totalCalories');
		this.set(entryString, new app.FoodEntry());
		this.get(entryString).set({foodName: name, calories: roundedCalories, entryNumber: number});
		this.set('totalCalories', (currentCalories + roundedCalories));
	}
});