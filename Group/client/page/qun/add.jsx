
UI.Comp_Qun_Add = class extends KUI.RC.CSS{
	constructor(p){
		super(p);

	}
	render(){
		let p = {
			name : {
				placeholder : '群名称',
				ref : 'name'
			},
			rebot : {
				placeholder : '机器人名称',
				ref : 'rebot'
			}
		};

		//let p = {
		//	name : getFieldProps('name', {
		//		placeholder : 'Name'
		//	}),
		//	rebot : getFieldProps('rebot', {
		//		placeholder : 'Rebot'
		//	})
		//};

		let lay = {
			wrapperCol : {span : 24},
			labelCol : {span : 0}
		};

		return (
			<ND.Form horizontal>
				<ND.Form.Item {... lay}>
					<ND.Input {... p.name} />
				</ND.Form.Item>

				<ND.Form.Item {... lay}>
					<ND.Input {... p.rebot} />
				</ND.Form.Item>

			</ND.Form>
		);
	}
	getValue(){
		console.log(this.refs.name);
		let rs = {
			name : util.ND.getInputValue(this.refs.name),
			rebot : util.ND.getInputValue(this.refs.rebot)
		}
		return rs;
	}

	setValue(data){
		util.ND.setInputValue(this.refs.name, data.name);
		util.ND.setInputValue(this.refs.rebot, data.rebot);
	}
};

UI.Qun_Add = class extends KUI.RC.CSS{

	render(){
		//let Form = ND.Form.create()(UI.Comp_Qun_Add);

		return (
			<div className="m-box">
				<h3>添加群</h3>
				<hr/>
				<UI.Comp_Qun_Add ref="form" />
				<div>
					<ND.Button type="primary" onClick={this.save.bind(this)}>添加</ND.Button>
				</div>
			</div>
		);
	}

	save(){

		let data = this.refs.form.getValue()
		console.log(data);

		KG.Qun.getDB().insert(data, function(err, nd){
			if(err){

				util.alert.error(err);
				return false;
			}
			if(nd){
				util.alert.ok('Insert Success');
				util.goPath('/qun/list');
			}
		});

	}
};

UI.Qun_Edit = class extends KUI.Page{
	getMeteorData(){
		let id = FlowRouter.getParam('id');
		let x = Meteor.subscribe(KG.config.Qun, {
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

		return (
			<div className="m-box">
				<h3>编辑群</h3>
				<hr/>
				<UI.Comp_Qun_Add ref="form" />
				<div>
					<ND.Button type="primary" onClick={this.save.bind(this)}>保存</ND.Button>
					<ND.Button style={util.style.ML_20} type="primary"
					           onClick={()=>{util.goPath(`/qun/message/list?qunID=${this.data.id}`)}}>消息记录</ND.Button>
					{<ND.Button style={util.style.ML_20} type="primary"
					           onClick={()=>{util.goPath(`/qun/message/selectandexport?qunID=${this.data.id}`)}}>导出</ND.Button>}
				</div>
			</div>
		);
	}

	runOnceAfterDataReady(){
		let d = KG.Qun.getDB().findOne({_id : this.data.id});
		this.refs.form.setValue(d);
	}

	save(){
		let data = this.refs.form.getValue()
		console.log(data);

		KG.Qun.getDB().update({_id : this.data.id}, {$set : data}, function(err, nd){
			if(err){

				util.alert.error(err);
				return false;
			}
			if(nd){
				util.alert.ok('Insert Success');
				util.goPath('/qun/list');
			}
		});
	}
};