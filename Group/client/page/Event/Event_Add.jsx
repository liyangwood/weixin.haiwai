UI.Event_Add = class extends KUI.RC.CSS{

	getMeteorData(){
		return {ready : true};
	}

	render(){

		return (
			<div className="m-box">
				<h3 style={util.style.TD}>增加群事件</h3>
				<div className="line"></div>
				<UI.CM.Event_Add ref="form" />
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

			KG.Event.getDB().insert(d, function(err, nid){
				if(err){
					util.alert.error(err);
					return false;
				}

				util.alert.ok('Insert Success');
				util.goPath('/event/list');
			});

		});

	}
};

UI.Event_Edit = class extends KUI.Page{
	getMeteorData(){
		let id = FlowRouter.getParam('id');
		let x = Meteor.subscribe(KG.config.Event, {
			query : {
				_id : id
			}
		});

		return {
			id : id,
			ready : x.ready()
		};
	}
	render(){
		if(!this.data.ready) return util.renderLoading();
		let d = KG.Event.getDB().findOne({_id : this.data.id});
		return (
			<div className="m-box">
				<h3 style={util.style.TD}>编辑群事件</h3>
				<div className="line"></div>
				<UI.CM.Event_Add ref="form" init-data={d} />
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

			KG.Event.getDB().update({_id : self.data.id}, {$set : d}, function(err, nid){
				if(err){
					util.alert.error(err);
					return false;
				}

				util.alert.ok('Update Success');
				util.goPath('/event/list');
			});

		});

	}
};