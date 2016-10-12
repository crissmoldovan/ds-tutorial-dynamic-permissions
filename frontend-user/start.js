var koTools = new KoTools( ko );

class ViewModel{
	constructor() {
		this.ds = deepstream( 'localhost:6020' );
		this.role = ko.observable( null );
		this.content = null;
		// this.username = ko.observable( 'admin');
		// this.password = ko.observable( 'admin-pass' );
		this.username = ko.observable( 'userA');
		this.password = ko.observable( 'usera-pass' );
		this.showLogin = ko.observable( true );
		this.showInvalidCredentials = ko.observable( false );
		window.xxx = this;
	}

	login() {
		this.ds.login({
			username: this.username(),
			password: this.password()
		}, this._onLoginResponse.bind( this ) );
	}

	_onLoginResponse( success, data ) {
		if( success ) {
			this.globalColorRecord = this.ds.record.getRecord( 'global-color' );
			this.globalColor = koTools.getObservable( this.globalColorRecord, 'color' );
			this._initContent( data );
		} else {
			this.showInvalidCredentials( true );
		}
	}

	_initContent( data ) {
		if( data.role === 'user' ) {
			this.content = new UserViewModel( data.permissionRecord, this.username(), this );
		} else {
			this.content = new AdminViewModel( this );
		}
		this.role( data.role );
	}
}

class UserViewModel{
	constructor( permissionRecordName, username, parent ) {
		this._parent = parent;
		this._permissionRecord = this._parent.ds.record.getRecord( permissionRecordName );
		this.username = ko.observable( username );
		this.greenAllowed = koTools.getObservable( this._permissionRecord, 'green' );
		this.redAllowed = koTools.getObservable( this._permissionRecord, 'red' );
		this.blueAllowed = koTools.getObservable( this._permissionRecord, 'blue' );
	}

	setColor( color ) {
		this._parent.globalColorRecord.set( 'color', color );
	}
}

class AdminViewModel{
	constructor( parent ) {
		this.users = ko.observableArray([
			new UserViewModel( 'permissions/usera', 'userA', parent ),
			new UserViewModel( 'permissions/userb', 'userB', parent ),
			new UserViewModel( 'permissions/userc', 'userC', parent )
		]);
	}
}

ko.applyBindings( new ViewModel() );

