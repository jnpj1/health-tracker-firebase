var app = app || {};

// View for daily journal list items
app.ListView = Backbone.View.extend({
	tagName: 'li',

	className: 'journal-list-item',

	// Template for rendering list of daily journals
	template: _.template($('#list-template').html()),

	events: {
		'click .delete-box' : 'removeDailyEntry',
		'click .journal-stats' : 'triggerJournalEdit'
	},

	// At initialization, listen for change and remove events and
	// call functions for removing model and corresponding DOM element
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.removeListItem);
	},

	// Renders the list item html with model attributes
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	// Removes the model from Journals collection when 'X' is clicked
	// Triggers event to remove open journalview
	removeDailyEntry: function() {
		this.model.destroy();
		app.vent.trigger('checkJournalDisplay', this.model);
	},

	// Removes the list item DOM element when model is removed
	removeListItem: function() {
		this.remove();
	},

	// Trigger events to remove current journal view and to create
	// view for selected date
	triggerJournalEdit: function() {
		app.vent.trigger('removeJournal', this.model);
		app.vent.trigger('editJournal', this.model);
	}
});