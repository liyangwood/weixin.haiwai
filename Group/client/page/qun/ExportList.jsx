UI.Qun_ExportList = class extends KUI.Page{
	constructor(p){
		super(p);

		this.state = {
			loading : false
		};
	}

	getMeteorData(){
		let x = Meteor.subscribe(KG.config.Article);

		return {
			ready : x.ready()
		};
	}

	render(){
		if(!this.data.ready || this.state.loading){
			return util.renderLoading();
		}

		let list = KG.Article.getDB().find({}, {
			sort : {
				createTime : -1
			}
		}).fetch();

		console.log(list);

		return (
			<div className="m-box">
				<h3>导出内容列表</h3>
				<div className="line"></div>

				{this.renderTable(list)}
			</div>
		);

	}

	renderTable(list){
		let self = this;
		let titleArray = [
			{
				title : 'Name',
				dataIndex : 'title'
			},

			{
				title : '创建时间',
				render(t, doc){
					return moment(doc.createTime).format(KG.const.dateAllFormat);
				}
			},
			{
				title: '操作',
				className: 'hw-center',
				render(t, doc){
					let del = ()=> {
						self.delete(doc._id);
					};

					return (
						<div style={util.style.TD}>
							<ND.Tooltip title="编辑"><a href={`/qun/article/edit/${doc._id}`}><ND.Icon type="edit" /></a></ND.Tooltip>
							<ND.Tooltip title="删除"><a style={util.style.ML_12} onClick={del}><ND.Icon type="cross" /></a></ND.Tooltip>
						</div>
					);
				}
			}
		];

		return <ND.Table columns={titleArray} size="middle" dataSource={list} pagination={false} />
	}

	delete(id){
		let self = this;

		swal({
			title: "确认删除？",
			text: "",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			closeOnConfirm: true,
			closeOnCancel: true
		}, function(isConfirm){
			if(isConfirm){
				self.setState({loading : true});
				KG.Article.getDB().remove({_id : id});
				self.setState({loading : false});
			}

		});
	}

};