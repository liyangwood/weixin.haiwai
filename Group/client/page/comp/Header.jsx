
let RB = KUI.RB;
UI.Header = class extends KUI.RC.CSS{


	getBeforeLogin(){
		let sy = {
			marginTop : '8px',
			marginLeft : '15px'
		};

		return <RB.Nav pullRight>
			<UI.NoButton style={sy} onClick={function(){}} label="Login"></UI.NoButton>
		</RB.Nav>;
	}
	getAfterLogin(user){
		var style = {
			marginLeft : '10px'
		};
		let sy = {
			marginTop : '8px',
			marginLeft : '15px'
		};

		return <RB.Nav pullRight>
			<RB.Navbar.Text eventKey={1}>Welcome <b style={style}>{user.username}</b></RB.Navbar.Text>
			<UI.NoButton onClick={this.toSetting} style={sy} label="Settings"></UI.NoButton>
			<UI.NoButton style={sy} onClick={this.logout} label="Logout"></UI.NoButton>
		</RB.Nav>;
	}

	logout(){

		let user = Meteor.user();



	}

	toSetting(){
		util.goPath('/setting');
	}

	render(){

		let sy = {
			logo : {
				width : '100px',
				height : '28px'
			}
		};

		var user = false;//KG.Account.checkIsLogin();
console.log(RB);
		return (
			<RB.Navbar>
				<RB.Navbar.Header>
					<RB.Navbar.Brand>

						<a onClick={this.props.toggleLeftNav}>
							<img style={sy.logo} src="http://www.haiwai.com/pc/image/newlogo2x.png" />
						</a>
					</RB.Navbar.Brand>
					<RB.Navbar.Toggle />

				</RB.Navbar.Header>
				<RB.Navbar.Collapse>
					{user?this.getAfterLogin(user):this.getBeforeLogin()}
				</RB.Navbar.Collapse>
			</RB.Navbar>
		);
	}
};