var app = app || {};

// Individual food entry list item view
app.EntryView = Backbone.View.extend({
	tagName: 'li',

	className: 'food-entry',

	template: _.template($('#entry-template').html()),

	events: {
		'click .entry-remove' : 'deleteEntry'
	},

	// Initializes with listener for model destruction
	initialize: function() {
		app.vent.on('removeJournalEntries', this.deleteView, this);
	},

	// Renders template with model attributes
	render: function() {
		this.$el.html(this.template(this.model));
		return this;
	},

	// Destroys model and triggers delete entry event
	deleteEntry: function() {
		app.vent.trigger('deleteEntry', this.model);
		app.vent.trigger('toggleHeader');
		this.deleteView();
	},

	// Removes view item
	deleteView: function() {
		app.vent.off('removeJournalEntries', this.deleteView, this);
		this.remove();
	}
});