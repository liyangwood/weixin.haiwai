let sy = {
	img : {
		width : '150px',
		height : '150px',
		margin : '20px auto'
	}
};

UI.Home_Login = class extends KUI.RC.CSS{

	constructor(p){
		super(p);

		this.state = {
			loading : true,
			step : 0,
			stepStatus : 'process',



			qr : null
		};

		this.C = {
			json : {}
		};
	}

	clickRefreshBtn(){
		this.setState({
			loading : true
		});
		this.componentDidMount();
	}

	clickStopBtn(){
		let self = this;
		util.ajax({
			url : '/wxapi/login/stop',
			type : 'get',
			dataType : 'json',
			data : {},
			success : function(flag, rs){
				if(!rs.connect){
					self.clickRefreshBtn();
				}
				else{
					swal('stop Error', '', 'error');
				}
			}
		});
	}

	render(){
		if(this.state.loading){
			return util.renderLoading();
		}
		return (
			<div>
				<div>
					<ND.Button type="primary" onClick={this.clickRefreshBtn.bind(this)}>刷新</ND.Button>
					<ND.Button style={util.style.ML_20} type="default" onClick={this.clickStopBtn.bind(this)}>停止</ND.Button>
				</div>
				<hr/>
				{this.renderStepTab()}
				<div className="line" />
				{this.state.step===0 && this.renderStep0()}
				{this.state.step>0 && this.renderStep1()}

			</div>
		);
	}

	renderStepTab(){
		return (
			<ND.Steps current={this.state.step} status={this.state.stepStatus}>
				<ND.Steps.Step title="登录微信" />
				<ND.Steps.Step title="初始化信息" />
				<ND.Steps.Step title="机器人运行中" />
			</ND.Steps>
		);
	}

	renderStep0(){
		return (
			<div style={util.style.TD}>
				{
					!this.state.qr ?
						<ND.Button onClick={this.getQRCode.bind(this)}>获取二维码</ND.Button>
						:
						<img src={this.state.qr} />
				}

			</div>

		);
	}


	getQRCode(){
		let self = this;

		var data = {};

		util.ajax({
			url : '/wxapi/login/qr',
			type : 'get',
			dataType : 'json',
			data : data,
			success : function(flag, rs){
				console.log(rs);
				self.setState({
					qr : rs.url
				});

				_.delay(self.checkLoginState.bind(self), 2000);
			}
		});
	}

	checkLoginState(callback){
		let self = this;
		util.ajax({
			url : '/wxapi/login/state',
			type : 'get',
			dataType : 'json',
			data : {},
			success : function(flag, rs){

				if(callback){
					callback(rs);
					return false;
				}

				//if(rs.userAvatar){
				//	$('#js_img').attr('src', rs.userAvatar);
				//}
				//
				let tmp = rs.loginState;
				console.log(tmp);

				if(tmp.code && tmp.code === 200){
					self.C.json = rs;
					self.setState({
						step : 1
					});
				}
				else{
					_.delay(function(){

						self.checkLoginState();
					}, 2000);
				}
			}
		});
	}

	renderStep1(){
		let self = this;

		let user = this.C.json.user;

		let loop = function(){
			if(self.state.step > 1) return false;
			self.checkLoginState(function(json){
				if(json.connect){
					self.C.json = json;
					self.setState({
						step : 2
					});
				}
				else{
					_.delay(loop.bind(self), 2000);
				}


			});
		};

		_.delay(function(){
			loop();
		}, 2000);


		return (
			<div>
				<p>机器人 : {user.NickName}</p>
				<p>状态  : {this.C.json.connect ? '连接中' : '已断开'}</p>
			</div>
		);
	}

	componentDidMount(){
		let self = this;
		this.checkLoginState(function(json){
			self.C.json = json;
			if(json.connect){
				self.setState({
					loading : false,
					step : 2
				});
			}
			else if(!json.loginState.code){
				self.setState({
					loading : false,
					qr : null,
					step : 0
				});
			}
			else{
				self.setState({
					loading : false,
					step : 1
				});
			}

		});
	}
};