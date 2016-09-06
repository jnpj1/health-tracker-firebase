var app = app || {};

// Registration form view
app.RegistrationView = Backbone.View.extend({
	className: 'registration-box',

	events: {
		'submit .registration-form' : 'registerUserFirebase'
	},

	template: _.template($('#registration-template').html()),

	initialize: function() {
		app.vent.on('removeAuthView', this.remove, this);
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},

	// Registers user with firebase
	registerUserFirebase: function(event) {
		event.preventDefault();

		var email = this.$('#registration-username').val();
		var password = this.$('#registration-password').val();
		var passwordConfirm = this.$('#password-confirm').val();
		var $this = this.$el;
		var registrationError = '<p class="registration-error">%error%</p>';
		var $registrationError = this.$('.registration-error');

		if ($registrationError.length) {
			$registrationError.remove();
		}

		if (!email) {
			registrationError = registrationError.replace('%error%', 'Please enter an email address.');
			$this.append(registrationError);
		} else if (!password) {
			registrationError = registrationError.replace('%error%', 'Please enter a password.');
			$this.append(registrationError);
		} else if (!passwordConfirm) {
			registrationError = registrationError.replace('%error%', 'Please confirm password.');
			$this.append(registrationError);
		} else if (password !== passwordConfirm) {
			registrationError = registrationError.replace('%error%', 'Passwords must match. Please try again.');
			$this.append(registrationError);
		} else {
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
				var errorCode = error.code;

				if (errorCode === 'auth/invalid-email') {
					registrationError = registrationError.replace('%error%', 'Please enter a valid email address.');
					$this.append(registrationError);
				} else if (errorCode === 'auth/email-already-in-use') {
					registrationError = registrationError.replace('%error%', 'Account already exists for this email address.');
					$this.append(registrationError);
				} else if (errorCode === 'auth/weak-password') {
					registrationError = registrationError.replace('%error%', 'Please choose a stronger password.');
					$this.append(registrationError);
				}
			});
		}
	}
});