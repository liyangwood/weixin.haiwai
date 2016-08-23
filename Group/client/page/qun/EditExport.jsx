
UI.Qun_EditExport = class extends KUI.Page{
	constructor(p){
		super(p);

		let htmlData = Session.get('Qun-TempData');
		this.html = _.map(htmlData, (m)=>{
			if(m.MsgType === 3){
				return '<img src="http://'+location.host+'/res/chat/image?id='+m.MsgId+'" />';
			}

			return m.Content;
		});

	}

	getMeteorData(){
		return {
			ready : true
		};
	}

	render(){
		console.log(this.html);

		let p = {
			title : {
				placeholder : '标题',
				ref : 'title'
			}
		};

		let lay = {
			wrapperCol : {span : 24},
			labelCol : {span : 0}
		};

		return (
			<div className="m-box">
				<h3>编辑内容</h3>
				<div className="line" />
				<ND.Form horizontal>
					<ND.Form.Item {... lay}>
						<ND.Input {... p.title} />
					</ND.Form.Item>
				</ND.Form>
				<div ref="editor" />

				<div>
					<ND.Button type="primary" onClick={this.save.bind(this)}>保存</ND.Button>
				</div>
			</div>
		);


	}

	save(){
		let code = util.getReactJQueryObject(this.refs.editor).summernote('code');
		console.log(code);

		//save to db
		let data = {
			title : util.ND.getInputValue(this.refs.title),
			content : code
		};

		KG.Article.getDB().insert(data, function(err, uid){
			if(!err){
				swal('Insert Success', '', 'success');
			}
		});
	}

	runOnceAfterDataReady(){
		util.getReactJQueryObject(this.refs.editor).summernote('code', this.html.join('<br/>'));
	}


};