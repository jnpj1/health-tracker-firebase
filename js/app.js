$(function() {

	// Custom Backbone sync method to utilize firebase database
	Backbone.sync = function(method, model, options) {
		if (method === 'create') {
			var user = firebase.auth().currentUser;
			firebase.database().ref('users/' + user.uid + '/' + model.attributes.dateComparator).set(model.attributes);
		} else if (method === 'update') {
			var user = firebase.auth().currentUser;
			firebase.database().ref('users/' + user.uid + '/' + model.attributes.dateComparator).set(model.attributes);
		} else if (method === 'delete') {
			var user = firebase.auth().currentUser;
			firebase.database().ref('users/' + user.uid + '/' + model.attributes.dateComparator).remove();
		} else if (method === 'read') {
			var user = firebase.auth().currentUser;
			var journalData;
			firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) {
				journalData = snapshot.val();
				for (var journal in journalData) {
					app.journals.create(journalData[journal]);
				}
			});
		}
	};

	new app.AppView();
	new app.CalendarView();
});