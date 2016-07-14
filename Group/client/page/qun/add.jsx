
UI.Comp_Qun_Add = class extends KUI.RC.CSS{
	constructor(p){
		super(p);

	}
	render(){
		let p = {
			name : {
				placeholder : 'Name',
				ref : 'name'
			},
			rebot : {
				placeholder : 'Rebot',
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
			name : this.refs.name.refs.input.value,
			rebot : this.refs.rebot.refs.input.value
		}
		return rs;
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
		console.log(this.refs.form)
		let data = this.refs.form.getValue()
		console.log(data);
	}
};