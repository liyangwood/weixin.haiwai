
let sy = {
	row : {
		width : util.style.MAIN_WIDTH
	}
};

UI.Header = class extends KUI.RC.CSS{


	getBeforeLogin(){
		let sy = {
			marginTop : '8px',
			marginLeft : '15px'
		};

		return <div>
			<UI.NoButton style={sy} onClick={function(){}} label="Login"></UI.NoButton>
		</div>;
	}
	getAfterLogin(user){
		var style = {
			marginLeft : '10px'
		};
		let sy = {
			marginTop : '8px',
			marginLeft : '15px'
		};

		return <div>
			<p eventKey={1}>Welcome <b style={style}>{user.username}</b></p>
			<UI.NoButton onClick={this.toSetting} style={sy} label="Settings"></UI.NoButton>
			<UI.NoButton style={sy} onClick={this.logout} label="Logout"></UI.NoButton>
		</div>;
	}

	logout(){

		let user = Meteor.user();



	}

	toSetting(){
		util.goPath('/setting');
	}

	render(){


		var user = false;//KG.Account.checkIsLogin();
		return (
			<header className="main-header">
				<ND.Row className="main-box" style={sy.row}>
					<ND.Col span={6}>
						<a className="logo" href="/">
							<img src="http://www.haiwai.com/pc/image/newlogo2x.png" />
						</a>
					</ND.Col>
					<ND.Col span={6}></ND.Col>
					<ND.Col span={12}>

					</ND.Col>
				</ND.Row>

			</header>
		);
	}
};