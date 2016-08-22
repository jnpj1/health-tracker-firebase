var app = app || {};

// Individual food entry list item view
app.EntryView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($('#entry-template').html()),

	events: {
		'click .entry-remove' : 'deleteEntry'
	},

	// Initializes with listener for model destruction
	initialize: function() {
		app.vent.on('removeJournal', this.deleteView, this);
	},

	// Renders template with model attributes
	render: function() {
		console.log(this.model);
		this.$el.html(this.template(this.model));
		return this;
	},

	// Destroys model and triggers delete entry event
	deleteEntry: function() {
		app.vent.trigger('deleteEntry', this.model);
		this.deleteView();
	},

	// Removes view item
	deleteView: function() {
		this.remove();
	}
});