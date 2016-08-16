var app = app || {};

// View for detailed Journal information display
app.JournalView = Backbone.View.extend({
	template: _.template($('#journal-template').html()),

	// Calls foodQuery function when input changes
	events: {
		'input #food-input' : 'foodQuery',
		'click .add-custom-entry' : 'toggleCustomForm',
		'submit .custom-entry-form' : 'addCustomEntry',
		'blur .custom-entry-form' : 'checkFocus'
	},

	// Listens to changes in model and updates view.
	// Triggers function callbacks on custom events to update
	// model and remove views as appropriate.
	// Hides custom entry inputs.
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'remove', this.clearJournal);

		app.vent.on('addFoodEntry', this.addFoodEntry, this);
		app.vent.on('removeJournal', this.removeJournal, this);
		app.vent.on('deleteEntry', this.deleteFoodEntry, this);
		app.vent.on('toggleForm', this.toggleCustomForm, this);
	},

	// Renders template with model attributes
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		this.$('.custom-entry-form').hide();
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
		var entryNumber = this.model.determineEntryNumber();
		this.createEntryView(entryNumber - 1);
	},

	// Creates food entry view and adds to DOM
	createEntryView: function(entry) {
		var entryModel = 'entry' + entry.toString();
		var newEntry = new app.EntryView({model: this.model.get(entryModel)});

		this.$('.food-list').prepend(newEntry.render().el);
	},

	// Calls model function to recalculate total calorie count
	deleteFoodEntry: function(calories) {
		this.model.recalculateCalories(calories);
	},

	// Removes custom event listeners and views when no longer required to display
	removeJournal: function() {
		app.vent.off('addFoodEntry', this.addFoodEntry);
		app.vent.off('removeJournal', this.removeJournal);
		this.remove();
	},

	// Toggles display of custom entry form
	toggleCustomForm: function() {
		this.$('.custom-entry-form').toggle();
	},

	// Adds entry for customized input after validation of description and calories.
	// Calls functions for appending entry to DOM and hiding custom form.
	addCustomEntry: function() {
		var customName = this.$('#description-input').val();
		var customCalories = this.$('#calorie-input').val();

		if (!customName && !customCalories) {
			alert('Please enter the name and calorie count of the food item');
		} else if (!customName) {
			alert('Please enter the name of the food item');
		} else if (!customCalories) {
			alert('Please enter the calorie count of the food item');
		} else {
			this.model.appendFoodEntry(customName, customCalories);
			var entryNumber = this.model.determineEntryNumber();
			this.createEntryView(entryNumber - 1);
			app.vent.trigger('toggleForm');
		}
	},

	// When focus on an input is lost, checks if focus is on another form element.
	// If focus is no longer on any form elements, triggers an event to hide form.
	checkFocus: function(event) {
		setTimeout(function() {
			if (!event.delegateTarget.contains(document.activeElement)) {
            	app.vent.trigger('toggleForm');
        	}
		}, 0);
	}
});