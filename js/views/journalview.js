var app = app || {};

// View for detailed Journal information display
app.JournalView = Backbone.View.extend({
	template: _.template($('#journal-template').html()),

	// Calls foodQuery function when input changes
	events: {
		'input #food-input' : 'foodQuery'
	},

	// Listens to changes in model and updates view
	// Triggers function callbacks on custom events to update
	// model and remove views as appropriate
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'remove', this.clearJournal);

		app.vent.on('addFoodEntry', this.addFoodEntry, this);
		app.vent.on('removeJournal', this.removeJournal, this);
	},

	// Renders template with model attributes
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	// Resets journal html when currently selected journal is removed from model
	clearJournal: function() {
		this.$el.html('<h3 class="welcome-message">Select an existing ' +
			'daily journal or start a new daily journal!</h3>');
	},

	// Triggers custom event when input changes and passes current input value
	foodQuery: function() {
		app.vent.trigger('foodQuery', ($('#food-input').val()));
	},

	// Updates model with information from selected food item
	addFoodEntry: function(index) {
		var selectedResult = JSON.parse(localStorage.getItem('results'));
		var foodName = selectedResult[index].foodName;
		var calories = selectedResult[index].calories;
		this.model.appendFoodEntry(foodName, calories);
	},

	// Removes custom event listeners and views when no longer required to display
	removeJournal: function() {
		app.vent.off('addFoodEntry', this.addFoodEntry);
		app.vent.off('removeJournal', this.removeJournal);
		this.remove();
	}
});