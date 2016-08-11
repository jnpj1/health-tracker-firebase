var app = app || {};

app.SearchView = Backbone.View.extend({
	tagName: 'li',

	className: 'result',

	events: {
		'click' : 'addFoodEntry'
	},

	initialize: function() {

	},

	render: function(itemString) {
		this.$el.html(itemString);
		return this;
	},

	addFoodEntry: function() {
		console.log('addfoodentry triggered');
		console.log(this);
	}
});