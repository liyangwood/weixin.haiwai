
UI.Publish_Timer_List = class extends KUI.Page{
	constructor(p){
		super(p);
		this.state = {
			loading : false
		};
	}

	getMeteorData(){
		let x1 = Meteor.subscribe(KG.config.Qun),
			x2 = Meteor.subscribe(KG.config.Content, {
				query : {
					publishType : 'timer'
				}
			});
		return {
			ready : x1.ready() && x2.ready()
		};
	}

	render(){
		if(!this.data.ready || this.state.loading){
			return util.renderLoading();
		}

		let list = KG.Content.getDB().find({
			time : {
				'$gt' : new Date()
			}
		}, {
			sort : {
				time : 1
			}
		}).fetch();

		return (
			<div className="m-box">
				<h3>定时发布列表</h3>
				<div className="line"></div>
				{this.renderTable(list)}
				<div className="line"></div>
				<div style={util.style.RD}>
					<ND.Button type="primary" onClick={()=>{util.goPath('/publish/timer/add')}}>添加</ND.Button>
				</div>
			</div>
		);
	}

	renderTable(list){
		let self = this;
		let titleArray = [
			{
				title : 'ID',
				render(t, doc){
					return <a href={`/publish/timer/edit/${doc._id}`}>{doc._id}</a>
				}
			},
			{
				title : '类型',
				dataIndex : 'type'
			},
			{
				title : '内容',
				dataIndex : 'content'
			},
			{
				title : '发布时间',
				render(t, doc){
					return moment(doc.time).format(KG.const.dateAllFormat);
				}
			},
			{
				title : '发布到的群',
				render(t, doc){
					let h = _.map(doc.assignGroup, (id)=>{
						return KG.Qun.getDB().findOne({_id : id}).name;
					});

					return h.join(',');
				}
			},
			{
				title : '操作',
				className : 'hw-center',
				render(t, doc){
					let del = ()=>{
						self.delete(doc._id);
					};

					return <ND.Button onClick={del}><ND.Icon type="cross" /></ND.Button>;
				}
			}
		];

		return <ND.Table columns={titleArray} bordered size="middle" dataSource={list} pagination={false} />
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
				KG.Content.getDB().remove({_id : id});
				self.setState({loading : false});
			}

		});
	}

};