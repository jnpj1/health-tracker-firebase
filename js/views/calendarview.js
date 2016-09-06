var app = app || {};

// Calendar View
app.CalendarView = Backbone.View.extend({
	// Bind to div containing datepicker input
	el: '.new-date',

	// Delegated event for opening datepicker
	events: {
		'click .calendar-button' : 'showDatepicker'
	},

	// Initialize variables for use in triggering a custom event.
	// Initialize JQuery UI datepicker and define date select function.
	initialize: function() {
		var date;
		var object = {};

		_.extend(object, Backbone.Events);
		object.bind('createDailyJournal', this.createDailyJournal, this);

		this.$('#datepicker').datepicker({
			maxDate: 0,
			minDate: '-1y',
			onSelect: function() {
				date = ($(this).datepicker('getDate'));
				object.trigger('createDailyJournal', date);
			}
		});
	},

	// Opens datepicker when click event triggered on '+' when user is logged in
	showDatepicker: function() {
		if (firebase.auth().currentUser) {
			this.$('#datepicker').datepicker('show');
		} else {
			alert('Please login or register');
		}
	},

	// Produces object with attributes based on date information
	newAttributes: function(date) {
		var dateComparator = app.journals.createDateComparator(date);
		return {
			dateComparator: dateComparator,
			dateName: app.journals.createDateString(date),
			id: dateComparator
		}
	},

	// Creates a new DailyJournal when date is selected via datepicker.
	// Checks to see if date already exists and alerts if so.
	createDailyJournal: function(date) {
		var attributes = this.newAttributes(date);
		var newDate = attributes.dateComparator;
		var checkDate = app.journals.where({dateComparator: newDate});

		if (checkDate.length) {
			alert('A journal for this date already exists');
		} else {
			app.journals.create(attributes);
		}
	}
});