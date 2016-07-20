UI.Publish_Timer_Edit = class extends KUI.Page{

	getMeteorData(){
		let id = FlowRouter.getParam('id');
		let x = Meteor.subscribe(KG.config.Content, {
			query : {_id : id}
		});

		return {
			id : id,
			ready : x.ready()
		};
	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}

		let data = KG.Content.getDB().findOne({_id : this.data.id});

		return (
			<div className="m-box">
				<h3 style={util.style.TD}>定时发布</h3>
				<div className="line"></div>
				<UI.CM.Publish_Content init-data={data} ref="form" />
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
			console.log(d);

			d.publishType = 'timer';

			KG.Content.getDB().update({_id : self.data.id}, {
				$set : d
			}, function(err, nid){
				if(err){
					util.alert.error(err);
					return false;
				}

				util.alert.ok('Update Success');
				util.goPath('/publish/timer');
			});
		});

	}
};