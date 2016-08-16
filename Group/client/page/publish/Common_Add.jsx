UI.Publish_Common_Add = class extends KUI.RC.CSS{
	constructor(p){
		super(p);

		this.state = {
			loading : false
		};
	}

	getMeteorData(){
		return {ready : true};
	}

	render(){

		if(this.state.loading){
			return util.renderLoading();
		}

		return (
			<div className="m-box">
				<h3 style={util.style.TD}>立即发布</h3>
				<div className="line"></div>
				<UI.CM.Publish_Common_Content ref="form" />
				<ND.Col span={16} offset={4}>
					<ND.Button onClick={this.save.bind(this)} type="primary">发布</ND.Button>
					<ND.Button style={util.style.ML_20} onClick={this.reset.bind(this)} type="primary">重置</ND.Button>
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
				self.reset();
			});
		});

	}
	reset(){
		this.setState({loading : true});
		_.delay(()=>{
			this.setState({loading : false});
		}, 200);
	}
};