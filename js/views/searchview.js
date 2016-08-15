var app = app || {};

// View of search result list item
app.SearchView = Backbone.View.extend({
	tagName: 'li',

	className: 'result',

	events: {
		'click' : 'addFoodEntry'
	},

	// On initialization, listen for changes in search term(s)
	// and call function to remove view(s)
	initialize: function() {
		app.vent.on('updateSearch', this.removeListing, this);
	},

	// Render list item html
	render: function(itemString) {
		this.$el.html(itemString);
		return this;
	},

	// Trigger event to add food entry when list item is clicked
	addFoodEntry: function() {
		var index = this.$el.index();
		app.vent.trigger('addFoodEntry', index);
	},

	// View removal function
	removeListing: function() {
		this.remove();
	}
});