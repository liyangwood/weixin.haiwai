
UI.Qun_EditExport = class extends KUI.Page{
	constructor(p){
		super(p);

		let htmlData = Session.get('Qun-TempData');
		this.html = _.map(htmlData, (m)=>{
			return m.Content;
		});

		this.state = {
			editorState : KUI.EditorState.createFromText({
				text : this.html
			})
		};
	}

	getMeteorData(){
		return {
			ready : true
		};
	}

	render(){
		console.log(this.data.list);
		return (
			<div className="m-box">
				<h3>编辑内容</h3>
				<div className="line" />

				<KUI.Editor onChange={this.change.bind(this)} editorState={this.state.editorState} />

			</div>
		);


	}

	change(editorState){
		console.log(editorState)
		this.setState({editorState});
	}


};