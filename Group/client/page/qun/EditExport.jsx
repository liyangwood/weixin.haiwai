
UI.Qun_EditExport = class extends KUI.Page{
	constructor(p){
		super(p);
	}

	getMeteorData(){

		this.D = this.getHtmlContent();

		return {
			ready : this.D.type==='edit'?this.D.sub.ready():true
		};
	}

	getHtmlContent(){
		let id = FlowRouter.getParam('id');

		if(id){
			//edit
			let x = Meteor.subscribe(KG.config.Article, {query : {_id : id}});
			let data = {};
			if(x.ready()){
				data = KG.Article.getDB().findOne({_id : id});
			}
			return {
				type : 'edit',
				data : data,
				html : data.content,
				sub : x
			};
		}
		else{
			let htmlData = Session.get('Qun-TempData');
			let html = _.map(htmlData, (m)=>{
				if(m.MsgType === 3){
					return '<img style="max-width:100%;" src="http://'+location.host+'/res/chat/image?id='+m.MsgId+'" />';
				}

				return m.Content;
			});

			return {
				type : 'add',
				html : html.join('<br/>')
			};
		}


	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}
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

		if(!data.title){
			ND.message.error('没有标题');
			return false;
		}

		if(this.D.type === 'add'){
			KG.Article.getDB().insert(data, function(err, uid){
				if(!err){
					swal('Insert Success', '', 'success');
					util.goPath('/qun/article/list');
				}
			});
		}
		else{
			KG.Article.getDB().update({_id : this.D.data._id}, {$set : data}, function(err, nd){
				if(!err){
					swal('Update Success', '', 'success');
					util.goPath('/qun/article/list');
				}
			});
		}


	}

	runOnceAfterDataReady(){
		if(this.D.type === 'add'){
			util.getReactJQueryObject(this.refs.editor).summernote('code', this.D.html);
		}
		else{
			util.ND.setInputValue(this.refs.title, this.D.data.title);
			util.getReactJQueryObject(this.refs.editor).summernote('code', this.D.html);
		}

	}


};