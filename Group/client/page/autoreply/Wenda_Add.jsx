
UI.Comp_Wenda_Add = class extends KUI.Page{
	getMeteorData(){
		let x = Meteor.subscribe(KG.config.Qun);

		return {
			ready : x.ready()
		};
	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}

		let lay = {
			wrapperCol : {span : 24},
			labelCol : {span : 0}
		};

		let p = {
			type : {
				placeholder : '分类',
				ref : 'type'
			},
			keyword : {
				placeholder : '问题',
				ref : 'keyword'
			},
			reply : {
				placeholder : '答案',
				ref : 'reply'
			},
			qun : {
				ref : 'qun'
			}
		};

		let option = {
			qun : KG.Qun.getDB().find().fetch()
		};
		option.qun = _.map(option.qun, (item)=>{
			return {
				key : item.name,
				value : item._id
			}
		});
		option.qun.unshift({
			key : '请选择要指定的群',
			value : '-1'
		});

		return (
			<ND.Form horizontal>
				<ND.Form.Item {... lay}>
					<ND.Input {... p.type} />
				</ND.Form.Item>

				<ND.Form.Item {... lay}>
					<ND.Input {... p.keyword} />
				</ND.Form.Item>

				<ND.Form.Item {... lay}>
					<ND.Input {... p.reply} />
				</ND.Form.Item>

				<ND.Form.Item {... lay} wrapperCol={{'span':12}}>
					<UI.Comp_Select defaultValue="-1" option={option.qun} {... p.qun}></UI.Comp_Select>
				</ND.Form.Item>

			</ND.Form>
		);
	}

	getValue(){
		return {
			type : util.ND.getInputValue(this.refs.type),
			keyword : util.ND.getInputValue(this.refs.keyword),
			reply : util.ND.getInputValue(this.refs.reply),
			qunID : this.refs.qun.getValue()
		};
	}
	setValue(d){

	}
};

UI.Wenda_Add = class extends KUI.Page{
	getMeteorData(){
		return {ready: true};
	}
	render(){

		return (
			<div className="m-box">
				<h3>添加问答</h3>
				<hr/>
				<UI.Comp_Wenda_Add ref="form" />
				<div>
					<ND.Button type="primary" onClick={this.save.bind(this)}>添加</ND.Button>
				</div>
			</div>
		);
	}
	save(){
		let data = this.refs.form.getValue();
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
	}
};