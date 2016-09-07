UI.Qun_QunScore = class extends KUI.Page{
	getMeteorData(){
		let id = FlowRouter.getParam('id');

		let x = Meteor.subscribe(KG.config.Qun, {query : {_id : id}});

		return {
			id : id,
			ready : x.ready()
		}
	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}

		let h = '';
		let list = KG.Qun.getDB().findOne({_id : this.data.id}).score || {};

		_.each(list, (v, k)=>{
			if(k){
				h += k+' ('+v+')'+'\n';
			}

		});

		return (
			<div className="m-box">
				<h3>群积分</h3>
				<hr/>
				<div>
					{h}
				</div>
			</div>
		);
	}
};