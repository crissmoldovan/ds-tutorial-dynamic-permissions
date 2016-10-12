class ViewModel{
	constructor() {
		this.username = ko.observable( 'userA');
		this.password = ko.observable( 'usera-pass' );
		this._ds = deepstream( 'localhost:6020' );
	}

	login() {
		console.log({
			username: this.username(),
			password: this.password()
		})
		this._ds.login({
			username: this.username(),
			password: this.password()
		}, this._onLogin.bind( this ) );
	}

	_onLogin( success, data ) {
		console.log( success, data );
	}
}


ko.applyBindings( new ViewModel() );