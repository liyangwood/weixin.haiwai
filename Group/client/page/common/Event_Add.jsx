let Form = ND.Form,
	FormItem = ND.Form.Item,
	Input = ND.Input;

let TipMessage = {
	text : '{GroupUser} 可以替换为发消息的用户',
	welcome : '{NewUser} 可以替换为新加入的用户'
};

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

			assignGroup : get('assignGroup', {
				rules: [
					{ required: true, message: '请选择要发布的群', type: 'array' }
				]
			}),
			type : get('type', {
				rules: [
					{
						//required: true,
						message: '请选择事件类型'
					}
				]
			}),




			startTime : get('startTime', {
				getValueFromEvent: (value, timeString) => timeString
			}),
			endTime : get('time', {
				getValueFromEvent: (value, timeString) => timeString
			}),



			reply : get('reply', {
				initialValue : '',
				rules : [
					{
						required: true,
						message: '请输入回复内容'
					}
				]
			}),
			content : get('content', {
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

		return (
			<ND.Form horizontal form={this.props.form}>
				<ND.Form.Item
					{...lay}
					label="要发布的群"
					>
					<ND.Select {...p.assignGroup} multiple placeholder="微信群">
						{
							_.map(this.data.qlist, (item, index)=>{
								return <ND.Select.Option key={index} value={item._id}>{item.name}</ND.Select.Option>
							})
						}
					</ND.Select>
				</ND.Form.Item>

				<FormItem
					{...lay}
					label="事件类型">

					<ND.Radio.Group {... p.type} onChange={this.changeType.bind(this)}>
						<ND.Radio.Button value="text">聊天</ND.Radio.Button>
						<ND.Radio.Button value="welcome">加群</ND.Radio.Button>

					</ND.Radio.Group>

				</FormItem>

				<FormItem
					{...lay}
					label="包换的关键字"
					>
					<ND.Input disabled={this.props.form.getFieldValue('type')!=='text'} type="text" {... p.content} />
				</FormItem>

				<FormItem
					{...lay}
					label="回复内容"
					>
					<ND.Input type="textarea" {... p.reply} />
					<p className="hw-formtip">{TipMessage[this.props.form.getFieldValue('type')]}</p>
				</FormItem>

			</ND.Form>
		);


	}

	changeType(e){
		this.props.form.setFieldsValue({type : e.target.value});
	}


};
KUI.reactMixin(ELEM.prototype, KUI.ReactMeteorData);


UI.CM.Event_Add = class extends KUI.Page{
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
				assignGroup : v.assignGroup,
				content : v.content || '',
				reply : v.reply,
				type : v.type
			};
			console.log(d);
			callback(d);
		});
	}

	setValue(d){
		console.log(d);
		this.refs.form.setFieldsValue({
			assignGroup : d.assignGroup,
			type : d.type,
			reply : d.reply
		});

		if(d.type === 'text'){
			this.refs.form.setFieldsValue({
				content : d.content || '',
			});
		}

	}

	runOnceAfterDataReady(){
		let d = this.props['init-data'];
		if(d){
			this.setValue(d);
		}
	}
};