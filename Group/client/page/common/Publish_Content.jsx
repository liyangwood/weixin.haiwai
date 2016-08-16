let Form = ND.Form,
	FormItem = ND.Form.Item,
	Input = ND.Input;


let ELEM = class extends KUI.React.Component{
	getMeteorData(){
		let x = Meteor.subscribe(KG.config.Qun);

		return {
			ready : x.ready(),
			qlist : KG.Qun.getDB().find().fetch()
		};
	}

	defineProps(get){
		return {
			content : get('content', {
				initialValue : '',
				rules : [
					{
						required: true,
						message: '请输入发布内容'
					}
				]
			}),
			date : get('date', {
				rules: [
					{
						required: true,
						type: 'date',
						message: '请选择发布时间'
					}
				]
			}),

			type : get('type', {
				rules: [
					{ required: true, message: '请选择消息类型' }
				]
			}),
			assignGroup : get('assignGroup', {
				rules: [
					{ required: true, message: '请选择要发布的群', type: 'array' }
				]
			})
		};
	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}


		const { getFieldProps } = this.props.form;
		let p = this.defineProps(getFieldProps);
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 16 }
		};

		let local = {
			timezoneOffset : moment(new Date()).utcOffset()
		};

		return (
			<Form horizontal form={this.props.form}>
				<FormItem
					{...formItemLayout}
					label="发布内容"
					>
					<ND.Input style={{height:'80px'}} type="textarea" {... p.content} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="发布时间"
					>
					<ND.DatePicker locale={{...local}} format="MM/dd/yyyy HH:mm:ss" showTime={true} {...p.date} />
				</FormItem>

				<FormItem
					{...formItemLayout}
					label="消息类型"
					>


					<ND.Radio.Group {... p.type}>
						<ND.Radio value="text">文字</ND.Radio>
						<ND.Radio disabled={true} value="image">图片</ND.Radio>
						<ND.Radio disabled={true} value="link">图文</ND.Radio>
					</ND.Radio.Group>

				</FormItem>

				<FormItem
					{...formItemLayout}
					label="要发布的群"
					>
					<ND.Select {...p.assignGroup} multiple placeholder="请选择要发布的群">
						{
							_.map(this.data.qlist, (item, index)=>{
								return <ND.Select.Option key={index} value={item._id}>{item.name}</ND.Select.Option>
							})
						}
					</ND.Select>
				</FormItem>

			</Form>
		);


	}
	changeDate(v){
		console.log(v);
	}


};
KUI.reactMixin(ELEM.prototype, KUI.ReactMeteorData);


UI.CM.Publish_Content = class extends KUI.Page{
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

		this.refs.form.validateFieldsAndScroll((errors, v) => {
			if (!!errors) {
				console.log('Errors in form!!!');
				callback(false);
				return;
			}

			let d = {
				assignGroup : v.assignGroup,
				content : v.content,
				type : v.type
			};

			d.time = moment(v.date, KG.const.dateAllFormat).toDate();
	console.log(d);
			callback(d);
		});
	}

	setValue(d){
		console.log(d);
		this.refs.form.setFieldsValue({
			content : d.content,
			assignGroup : d.assignGroup,
			type : d.type
		});

		this.refs.form.setFieldsValue({
			date : d.time
		});

	}

	runOnceAfterDataReady(){
		let d = this.props['init-data'];
		if(d){
			this.setValue(d);
		}
	}
};