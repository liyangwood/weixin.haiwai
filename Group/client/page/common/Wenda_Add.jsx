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
			type : get('type', {
				initialValue : '',
				rules : [
					{
						required: true,
						message: '请输入问答分类'
					}
				]
			}),
			keyword : get('keyword', {
				initialValue : '',
				rules : [
					{
						required: true,
						message: '请输入问答关键字'
					}
				]
			}),
			reply : get('reply', {
				initialValue : '',
				rules : [
					{
						required: true,
						message: '请输入问答回复'
					}
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
		const lay = {
			labelCol: { span: 4 },
			wrapperCol: { span: 16 }
		};

		return (
			<ND.Form horizontal form={this.props.form}>
				<ND.Form.Item
					label="分类"
					{... lay}>
					<ND.Input {... p.type} />
				</ND.Form.Item>

				<ND.Form.Item
					label="问题"
					{... lay}>
					<ND.Input {... p.keyword} />
				</ND.Form.Item>

				<ND.Form.Item
					label="答案"
					{... lay}>

					<ND.Input type="textarea" {... p.reply} />
					<p className="hw-formtip">{`{GroupUser}可以替换为发信息的用户`}</p>
				</ND.Form.Item>

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

			</ND.Form>
		);


	}
	changeDate(v){
		console.log(v);
	}


};
KUI.reactMixin(ELEM.prototype, KUI.ReactMeteorData);


UI.CM.Wenda_Add = class extends KUI.Page{

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
				keyword : v.keyword,
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
			keyword : d.keyword,
			reply : d.reply,
			assignGroup : d.assignGroup,
			type : d.type
		});

	}

	runOnceAfterDataReady(){
		let d = this.props['init-data'];
		if(d){
			this.setValue(d);
		}
	}

};