var app = app || {};

// View of search result list item
app.SearchView = Backbone.View.extend({
	tagName: 'li',

	className: 'result',

	events: {
		'click' : 'addFoodEntry'
	},

	// Listens for changes in search term(s) then call function to remove view(s)
	initialize: function() {
		app.vent.on('updateSearch', this.removeListing, this);
	},

	// Renders list item html
	render: function(itemString) {
		this.$el.html(itemString);
		return this;
	},

	// Triggers event to add food entry when list item is clicked
	addFoodEntry: function() {
		var index = this.$el.index();
		app.vent.trigger('addFoodEntry', index);
	},

	// Removes view
	removeListing: function() {
		app.vent.off('updateSearch');
		this.remove();
	}
});