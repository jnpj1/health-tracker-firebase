var app = app || {};

app.SearchView = Backbone.View.extend({
	tagName: 'li',

	className: 'result',

	events: {
		'click' : 'addFoodEntry'
	},

	initialize: function() {
		app.vent.on('updateSearch', this.removeListing, this);
	},

	render: function(itemString) {
		this.$el.html(itemString);
		return this;
	},

	addFoodEntry: function() {
		var index = this.$el.index();
		app.vent.trigger('addFoodEntry', index);
	},

	removeListing: function() {
		this.remove();
	}
});