
UI.Home_Index = class extends KUI.Page{
	getMeteorData(){
		return {
			ready : true
		};
	}

	render(){
		let sy = {
			h3 : {
				margin : '40px auto',
				textAlign : 'center'
			},
			small : {
				marginLeft : '12px'
			}
		};


		return (
			<div class="m-box">
				<h3 style={sy.h3}>
					欢迎使用微信机器人后台管理系统
					<small style={sy.small}>({Meteor.settings.public.version})</small>
				</h3>
			</div>
		);
	}
};