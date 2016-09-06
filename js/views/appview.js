var app = app || {};

app.vent = _.extend({}, Backbone.Events);

// Overall AppView
app.AppView = Backbone.View.extend({
	el: 'body',

	events: {
		'click .hamburger-icon' : 'toggleSidebar',
		'click .login' : 'showLogin',
		'click .register' : 'showRegistration',
		'click .logout' : 'logoutUser'
	},

	// Listens for events and calls functions for AJAX request,
	// adding daily journal list items, and adding edit journal view.
	initialize: function() {
		this.$welcomeMessage = this.$('.welcome-message');
		this.$welcomeMessage.hide();
		this.$loginPrompt = this.$('.login-prompt');
		this.$foodHeader = this.$('.food-entry-header');
		this.$foodHeader.hide();
		this.$userInfoBox = this.$('.user-info-box');
		this.$userInfoBox.hide();

		this.listenTo(app.journals, 'add', this.addDateEntry);
		this.listenTo(app.journals, 'reset', this.addAllDates);

		app.vent.on('editJournal', this.showJournal, this);
		app.vent.on('foodQuery', this.foodQuery, this);
		app.vent.on('createEntryView', this.createEntryView, this);
		app.vent.on('showWelcomeMessage', this.showWelcomeMessage, this);
		app.vent.on('toggleHeader', this.toggleFoodEntryHeader, this);
		app.vent.on('showUserInfo', this.showUserInfo, this);

		var loginPrompt = this.$loginPrompt;

		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				loginPrompt.hide();
				app.vent.trigger('removeAuthView');
				app.vent.trigger('showWelcomeMessage');
				app.vent.trigger('showUserInfo', user);
				app.journals.fetch({reset: true});
			} else {
				console.log('no user');
			}
		});

		// Initiates ajax start and stop event callbacks.
		$(document).ajaxStart(function() {
			app.vent.trigger('toggleSpinner');
		});

		$(document).ajaxStop(function() {
			app.vent.trigger('toggleSpinner');
		});

		// Calls function for reducing welcome message size for screens where
		// sliding sidebar functionality has been added
		if ($(window).width() < 950) {
			this.toggleWelcomeMessageSize();
		}

		// Calls function for toggling sidebar to closed for smaller media devices
		if($(window).width() < 500) {
			this.toggleSidebar();
		}
	},

	// Creates a new list item view and appends it to DOM based on
	// its index in collection
	addDateEntry: function(date) {
		var index = date.collection.indexOf(date);
		var currentListLength = this.$('.date-list').children().length;
		var view = new app.ListView({model: date});

		if ((currentListLength) && (currentListLength > index)) {
			this.$('.date-list li').eq(index).before(view.render().el);
		} else {
			this.$('.date-list').append(view.render().el);
		}
	},

	// Calls function to add date entry list view for all journals
	addAllDates: function() {
		app.journals.each(this.addDateEntry, this);
	},

	// Creates and renders a new journal edit view
	showJournal: function(journal) {
		this.$welcomeMessage.hide();
		var newJournal = new app.JournalView({model: journal});
		this.$('.journal-info').append(newJournal.render().el);
		this.toggleFoodEntryHeader();
	},

	// Parse AJAX results to form HTML string of list item.
	// Save results to local storage for later retrieval of details
	// of selected item(s).
	addResults: function(data) {
		var parsedResult, calories, brandName, serving;
		var results = [];

		app.vent.trigger('updateSearch');

		$.each(data.hits, function(index, item) {
			if (item.fields.brand_name === 'USDA') {
				brandName = '';
				serving = '';
			} else {
				brandName = item.fields.brand_name;
				serving = ' - ' + item.fields.nf_serving_size_qty +
				 ' ' + item.fields.nf_serving_size_unit;
			}

			parsedResult = brandName + ' ' + item.fields.item_name +
				serving;
			calories = item.fields.nf_calories;

			var result = new app.SearchView();
			$('.search-results').append(result.render(parsedResult).el);

			results.push({foodName: parsedResult, calories: calories});
		});

		if (results.length === 0) {
			app.vent.trigger('noResultsFound');
		}

		localStorage.setItem('results', JSON.stringify(results));
	},

	// AJAX function with done and fail callbacks.
	// Uses JQuery ajaxStart function to trigger event for loading spinner display
	foodQuery: function(query) {
		var triggerObject = {};
		_.extend(triggerObject, Backbone.Events);
		triggerObject.bind('addResults', this.addResults, this);

		var nutritionixURL = 'https://api.nutritionix.com/v1_1/search/' + query +
		'?fields=item_name%2Cbrand_name%2Cnf_calories&appId=6962db3c&appKey=' +
		'304283206c5423bc90fada2876453cc7';

		$.ajax({
			url: nutritionixURL
		})
		.done(function(data) {
			triggerObject.trigger('addResults', data);
		})
		.fail(function() {
			app.vent.trigger('ajaxFail');
		});
	},

	// Creates and appends view for individual food entry list items
	createEntryView: function(entry) {
		this.toggleFoodEntryHeader();
		var newEntry = new app.EntryView({model: entry});
		this.$('.food-list').prepend(newEntry.render().el);
	},

	// Shows welcome message when journal is deleted
	showWelcomeMessage: function() {
		this.$foodHeader.hide();
		this.$welcomeMessage.show();
		this.toggleWelcomeMessageSize();
	},

	// Shows food entry header if food entry list items are in DOM
	toggleFoodEntryHeader: function() {
		setTimeout(function() {
			if (this.$('.food-list').children().length) {
				this.$('.food-entry-header').show();
			} else {
				this.$('.food-entry-header').hide();
			}
		}, 20);
	},

	// Handles sliding sidebar mobile functionality
	toggleSidebar: function() {
		this.$('.sidebar').toggleClass('hidden');
		this.toggleWelcomeMessageSize();
	},

	// Reduces size of welcome message when sidebar is visible
	// on medium-sized media devices
	toggleWelcomeMessageSize: function() {
		if (this.$('.sidebar').hasClass('hidden')) {
			this.$welcomeMessage.removeClass('reduce-size');
		} else {
			if (($(window).width() < 950) && ($(window).width() > 500)) {
				this.$welcomeMessage.addClass('reduce-size');
			}
		}
	},

	// Creates and adds login view when login is clicked
	showLogin: function() {
		app.vent.trigger('removeAuthView');
		var loginView = new app.LoginView();
		this.$('.signin').html(loginView.render().el);
	},

	// Creates and adds registration view when register is clicked
	showRegistration: function() {
		app.vent.trigger('removeAuthView');
		var registrationView = new app.RegistrationView();
		this.$('.signin').html(registrationView.render().el);
	},

	// Displays user email and logout button
	showUserInfo: function(user) {
		console.log(user.email);
		this.$('.user-info').html(user.email);
		this.$userInfoBox.show();
	},

	// Logs user out when logout is clicked
	logoutUser: function() {
		firebase.auth().signOut();
		this.$loginPrompt.show();
		app.vent.trigger('removeJournal', 'hide');
		app.vent.trigger('logout');
		this.$userInfoBox.hide();
		this.$welcomeMessage.hide();
	}
});