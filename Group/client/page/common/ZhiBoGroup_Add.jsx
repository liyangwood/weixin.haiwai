let Form = ND.Form,
	FormItem = ND.Form.Item,
	Input = ND.Input;


let ELEM = class extends KUI.React.Component{
	constructor(p){
		super(p);

	}

	getMeteorData(){
		let x = Meteor.subscribe(KG.config.Qun);

		return {
			ready : x.ready(),
			qlist : KG.Qun.getDB().find().fetch()
		};
	}

	defineProps(get){
		return {

			qunID : get('qunID', {
				rules: [
					{ required: true, message: '请选择要直播的群' }
				]
			}),


			start_date : get('start_date', {
				rules: [
					{
						required: true,
						type: 'date',
						message: '请选择日期'
					}
				]
			}),
			end_date : get('end_date', {
				rules: [
					{
						required: true,
						type: 'date',
						message: '请选择日期'
					}
				]
			}),




			password : get('password', {
				initialValue : ''
			}),
			description : get('description', {
				initialValue : ''
			})
		};
	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}


		const { getFieldProps } = this.props.form;
		let p = this.defineProps(getFieldProps);
		const lay = {
			labelCol: { span: 4 },
			wrapperCol: { span: 16 }
		};

		let local = {
			timezoneOffset : moment(new Date()).utcOffset()
		};

		return (
			<ND.Form horizontal form={this.props.form}>
				<ND.Form.Item
					{...lay}
					label="要直播的群"
					>
					<ND.Select {...p.qunID} placeholder="微信群">
						{
							_.map(this.data.qlist, (item, index)=>{
								return <ND.Select.Option key={index} value={item._id}>{item.name}</ND.Select.Option>
							})
						}
					</ND.Select>
				</ND.Form.Item>
				<FormItem
					{...lay}
					label="开始时间"
					>
					<ND.DatePicker locale={{...local}} format="MM/dd/yyyy HH:mm:ss" showTime={true} {...p.start_date} />

				</FormItem>

				<FormItem
					{...lay}
					label="结束时间"
					>
					<ND.DatePicker locale={{...local}} format="MM/dd/yyyy HH:mm:ss" showTime={true} {...p.end_date} />

				</FormItem>



				<FormItem
					{...lay}
					label="描述"
					>
					<ND.Input style={{height:'80px'}} type="textarea" {... p.description} />
				</FormItem>

				<FormItem
					{...lay}
					wrapperCol={{span:8}}
					label="直播密码"
					>
					<ND.Input type="text" {... p.password} />
				</FormItem>

			</ND.Form>
		);


	}



};
KUI.reactMixin(ELEM.prototype, KUI.ReactMeteorData);


UI.CM.ZhiBoGroup_Add = class extends KUI.Page{
	constructor(p){
		super(p);
	}
	getMeteorData(){
		return {ready : true};
	}
	render(){
		let Elem= ND.Form.create()(ELEM);
		return <div><Elem ref="form" /></div>
	}

	getValue(callback){
		let form = this.refs.form;

		this.refs.form.validateFieldsAndScroll((errors, v) => {
			if (!!errors) {
				console.log('Errors in form!!!');
				callback(false);
				return;
			}
			let d = {
				qunID : v.qunID,
				description : v.description || '',
				password : v.password
			};

			d.startTime = moment(v.start_date, KG.const.dateAllFormat).toDate();
			d.endTime = moment(v.end_date, KG.const.dateAllFormat).toDate();

			console.log(d);
			callback(d);
		});
	}

	setValue(d){
		console.log(d);
		//this.refs.form.setFieldsValue({
		//	assignGroup : d.assignGroup,
		//	type : d.type,
		//	reply : d.reply
		//});
		//
		//if(d.type === 'text'){
		//	this.refs.form.setFieldsValue({
		//		content : d.content || '',
		//	});
		//}

	}

	runOnceAfterDataReady(){
		let d = this.props['init-data'];
		if(d){
			this.setValue(d);
		}
	}
};