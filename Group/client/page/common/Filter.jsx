let Form = ND.Form,
	FormItem = ND.Form.Item,
	Input = ND.Input;
let ELEM = class extends KUI.React.Component{
	constructor(p){
		super(p);

		this.config = this.props.config;
	}
	getMeteorData(){
		let r = true,
			rs = { ready : r };

		if(this.config.qun){
			let x = Meteor.subscribe(KG.config.Qun);
			r = r&&x.ready();

			rs.ready = r;
			rs.qlist = KG.Qun.getDB().find().fetch();
		}


		return rs;
	}

	defineProps(get){
		let rs = {
			text1 : get('text1', {
				initialValue : ''
			}),
			text2 : get('text2', {
				initialValue : ''
			}),
			qun : get('qun', {

			})
		};

		return rs;
	}
	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}


		const { getFieldProps } = this.props.form;
		let p = this.defineProps(getFieldProps);
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 }
		};

		let t1 = t2 = qun = null;
		if(this.config.text1){
			t1 = (
				<FormItem
					{...formItemLayout}
					label={this.config.text1.label}
					>
					<ND.Input type="text" {... p.text1} />
				</FormItem>
			);
		}
		if(this.config.qun) {
			qun = (
				<FormItem
					{...formItemLayout}
					label={this.config.qun.label}
					>
					<ND.Select {...p.qun} placeholder={this.config.qun.placeholder}>
						{
							_.map(this.data.qlist, (item, index)=> {
								return <ND.Select.Option key={index} value={item._id}>{item.name}</ND.Select.Option>
							})
						}
					</ND.Select>
				</FormItem>
			);
		}

		return (
			<Form horizontal form={this.props.form}>
				<ND.Row>
					<ND.Col span={12}>
						{t1}
						{qun}
					</ND.Col>
					<ND.Col span={12}></ND.Col>
				</ND.Row>

			</Form>
		);
	}
};

KUI.reactMixin(ELEM.prototype, KUI.ReactMeteorData);

UI.CM.Filter = class extends KUI.RC.CSS{


	render(){
		let Elem= ND.Form.create()(ELEM);

		return (
			<div className="hw-filter-box">
				<Elem ref="form" config={this.props.config} />

				<ND.Row>
					<ND.Col span={16} offset={2}>
						<ND.Button onClick={this._search.bind(this)} type="primary">搜索</ND.Button>
						<ND.Button onClick={this._clear.bind(this)} style={{marginLeft:'20px'}} type="default">清除条件</ND.Button>
					</ND.Col>
				</ND.Row>

			</div>
		);

	}

	getValue(){
		let d = this.refs.form.getFieldsValue();
		console.log(d);
		return d;
	}

	_search(){
		let d = this.getValue();
		this.props.callback && this.props.callback(d);
	}

	_clear(){
		this.refs.form.resetFields();

		this._search();
	}

	componentDidUpdate(){
		let d = this.props.data;

		this.refs.form.setFieldsValue({
			qun : d.qun || '',
			text1 : d.text1 || '',
			text2 : d.text2 || ''
		});
	}
};