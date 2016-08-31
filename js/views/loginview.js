var app = app || {};

app.LoginView = Backbone.View.extend({
	className: 'login-box',

	events: {
		'submit .login-form' : 'loginFirebase',
		'click .reset-password' : 'resetPassword'
	},

	template: _.template($('#login-template').html()),

	render: function() {
		this.$el.html(this.template());
		return this;
	},

	loginFirebase: function(event) {
		event.preventDefault();

		var email = this.$('#login-username').val();
		var password = this.$('#login-password').val();
		var $this = this.$el;
		var loginError = '<p class="login-error">%error%</p>';
		var $loginError = this.$('.login-error');
		var $passwordReset = this.$('.reset-password');

		if ($loginError.length) {
			$loginError.remove();
		}

		if ($passwordReset.length) {
			$passwordReset.remove();
		}

		if (!email) {
			loginError = loginError.replace('%error%', 'Please enter your email address.');
			$this.append(loginError);
		} else if (!password) {
			loginError = loginError.replace('%error%', 'Please enter your password.');
			$this.append(loginError);
		} else {
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				var errorCode = error.code;

				if (errorCode === 'auth/invalid-email') {
					loginError = loginError.replace('%error%', 'Please enter a valid email address.');
					$this.append(loginError);
				} else if (errorCode === 'auth/user-not-found') {
					loginError = loginError.replace('%error%', 'No account exists for this email address.  Please register.');
					$this.append(loginError);
				} else if (errorCode === 'auth/wrong-password') {
					loginError = loginError.replace('%error%', 'Incorrect password. Please try again.');
					$this.append(loginError);
					$this.append('<p class="reset-password">Reset password.</p>');
				}
			});
		}
	},

	resetPassword: function() {

	}
});