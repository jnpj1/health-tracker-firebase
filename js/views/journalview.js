var app = app || {};

app.JournalView = Backbone.View.extend({

	template: _.template($('#journal-template').html()),

	events: {
		'input #food-input' : 'foodQuery'
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'remove', this.clearJournal);

		app.vent.on('addFood', this.addFood, this);
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	clearJournal: function() {
		this.$el.remove();
		$('.journal').html('<h3 class="welcome-message">Select an existing ' +
			'daily journal or start a new daily journal!</h3>');
	},

	foodQuery: function() {
		app.vent.trigger('foodQuery', ($('#food-input').val()));
	},

	addFood: function(food) {
		console.log("correctly triggered addfood");
		console.log(food);
	}
});