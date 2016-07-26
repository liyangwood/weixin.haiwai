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
		//var self = this;
		//Meteor.http.get('/wx/group/getlist', function(err, res){
		//	if(res.statusCode > 199){
		//		var json = JSON.parse(res.content);
		//
		//		console.log(json.data);
		//	}
		//});

		var data = {};

		util.ajax({
			url : '/wxapi/login/qr',
			type : 'get',
			dataType : 'json',
			data : data,
			success : function(flag, rs){
				console.log(rs);

			}
		});
	}
};