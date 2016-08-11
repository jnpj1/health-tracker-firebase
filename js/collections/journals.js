var app = app || {};

app.JournalList = Backbone.Collection.extend({
	model: app.DailyJournal,

	localStorage: new Backbone.LocalStorage('journals-backbone'),

	// Creates a date string for display in list item
	createDateString: function(date) {
		var dateString;

		var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
			"Friday", "Saturday"];
		var months = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];

		var dayOfWeek = date.getDay();
		var dayOfMonth = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();

		dateString = weekdays[dayOfWeek] + ", " + months[month] + " " +
			dayOfMonth + " " + year;

		return dateString;

	},

	createDateComparator: function(date) {
		return Date.parse(date);
	},

	comparator: function(journal) {
		return -journal.get('dateComparator');
	}
});

app.Journals = new app.JournalList();