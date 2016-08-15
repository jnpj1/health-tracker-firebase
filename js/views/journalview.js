var app = app || {};

app.JournalView = Backbone.View.extend({
	template: _.template($('#journal-template').html()),

	events: {
		'input #food-input' : 'foodQuery'
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'remove', this.clearJournal);

		app.vent.on('addFoodEntry', this.addFoodEntry, this);
		app.vent.on('removeJournal', this.removeJournal, this);
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	clearJournal: function() {
		this.$el.html('<h3 class="welcome-message">Select an existing ' +
			'daily journal or start a new daily journal!</h3>');
	},

	foodQuery: function() {
		app.vent.trigger('foodQuery', ($('#food-input').val()));
	},

	addFoodEntry: function(index) {
		var selectedResult = JSON.parse(localStorage.getItem('results'));
		var foodName = selectedResult[index].foodName;
		var calories = selectedResult[index].calories;
		this.model.appendFoodEntry(foodName, calories);
	},

	removeJournal: function() {
		app.vent.off('addFoodEntry', this.addFoodEntry);
		app.vent.off('removeJournal', this.removeJournal);
		this.remove();
	}
});