
UI.Wenda_Add = class extends KUI.Page{
	getMeteorData(){
		return {ready: true};
	}
	render(){

		return (
			<div className="m-box">
				<h3 style={util.style.TD}>添加问答</h3>
				<hr/>
				<UI.CM.Wenda_Add ref="form" />
				<ND.Col span={16} offset={4}>
					<ND.Button type="primary" onClick={this.save.bind(this)}>添加</ND.Button>
				</ND.Col>
			</div>
		);
	}
	save(){
		this.refs.form.getValue(function(data){
			if(!data) return false;
			console.log(data);

			KG.Wenda.getDB().insert(data, (err, uid)=>{
				if(err){
					util.alert.error(err);
				}
				else{
					util.alert.ok('Insert Success');
					util.goPath('/autoreply/wendaku');
				}
			});
		});

	}
};
