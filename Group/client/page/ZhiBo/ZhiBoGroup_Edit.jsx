
UI.ZhiBoGroup_Edit = class extends KUI.Page{
	getMeteorData(){
		let id = FlowRouter.getParam('id');
		let x = Meteor.subscribe(KG.config.ZhiBoGroup, {
			query : {_id : id}
		});
		return {
			ready : x.ready(),
			id : id
		};
	}

	render(){
		if(!this.data.ready) return util.renderLoading();
		let d = KG.ZhiBoGroup.getDB().findOne({_id : this.data.id});
		return (
			<div className="m-box">
				<h3 style={util.style.TD}>编辑群直播</h3>
				<div className="line"></div>
				<UI.CM.ZhiBoGroup_Add init-data={d} ref="form" />
				<ND.Col span={16} offset={4}>
					<ND.Button onClick={this.save.bind(this)} type="primary">保存</ND.Button>
				</ND.Col>
			</div>
		);
	}

	save(e){
		let self = this;

		this.refs.form.getValue(function(d){
			if(!d) return false;


			KG.ZhiBoGroup.getDB().update({_id : self.data.id}, {$set : d}, function(err, nid){
				if(err){
					util.alert.error(err);
					return false;
				}

				util.alert.ok('Update Success');
				util.goPath('/zhibo/list');
			});
		});

	}
};