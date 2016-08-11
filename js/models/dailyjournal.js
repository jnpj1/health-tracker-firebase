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
	appendFoodEntry: function(name, calories, number) {
		var entryString = 'entry' + (number + 1);
		var currentCalories = this.get('totalCalories');
		this.set(entryString, new app.FoodEntry());
		this.get(entryString).set({foodName: name, calories: calories, entryNumber: (number + 1)});
		this.set('totalCalories', (currentCalories + calories));
		console.log(this.get('totalCalories'));
	}
});