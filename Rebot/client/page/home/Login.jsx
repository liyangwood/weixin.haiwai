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
			qr : null
		};
	}

	render(){
		return (
			<div>
				<h3>请使用微信登录</h3>
				<hr/>
				<div>
					<ND.Button onClick={this.getQRCode.bind(this)}>获取二维码</ND.Button>
				</div>
				<img src={this.state.qr} />
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
				self.setState({qr : rs.url});
			}
		});
	}
};