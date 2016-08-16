UI.Publish_Timer_Add = class extends KUI.RC.CSS{

	getMeteorData(){
		return {ready : true};
	}

	render(){

		return (
			<div className="m-box">
				<h3 style={util.style.TD}>定时发布</h3>
				<div className="line"></div>
				<UI.CM.Publish_Content ref="form" />
				<ND.Col span={16} offset={4}>
					<ND.Button onClick={this.save.bind(this)} type="primary">添加</ND.Button>
				</ND.Col>
			</div>
		);
	}

	save(e){
		let self = this;

		this.refs.form.getValue(function(d){
			if(!d) return false;
			console.log(d);


			KG.Content.getDB().insert(d, function(err, nid){
				if(err){
					util.alert.error(err);
					return false;
				}

				util.alert.ok('Insert Success');
				util.goPath('/publish/timer');
			});
		});

	}
};