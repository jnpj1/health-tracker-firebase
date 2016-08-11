var app = app || {};

// View for daily journal list items
app.ListView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($('#list-template').html()),

	events: {
		'click .date-remove' : 'removeDailyEntry',
		'click .journal-index' : 'triggerJournalEdit'
	},

	// At initialization, listen for change and remove events and
	// call functions for removing model and corresponding DOM element
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'remove', this.removeListItem);
	},

	// Renders the list item html with model attributes
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	// Removes the model from Journals collection when 'X' is clicked
	removeDailyEntry: function() {
		this.model.destroy();
	},

	// Removes the list item DOM element when model is removed
	removeListItem: function() {
		this.$el.remove();
	},

	triggerJournalEdit: function() {
		app.vent.trigger('editJournal', this.model);
	}
});