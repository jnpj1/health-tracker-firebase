var app = app || {};

// Individual food entry list item view
app.EntryView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($('#entry-template').html()),

	events: {
		'click .entry-remove' : 'deleteEntry'
	},

	initialize: function() {
		this.listenTo(this.model, 'destroy', this.deleteView);
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},

	deleteEntry: function() {
		app.vent.trigger('deleteEntry', this.model.get('calories'));
		this.model.destroy();
	},

	deleteView: function() {
		this.remove();
	}
});