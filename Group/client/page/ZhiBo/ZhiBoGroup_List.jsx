
UI.ZhiBoGroup_List = class extends KUI.Page{
	constructor(p){
		super(p);

		this.state = {
			loading : false
		};
	}

	getMeteorData(){
		let x1 = Meteor.subscribe(KG.config.Qun),
			x2 = Meteor.subscribe(KG.config.ZhiBoGroup, {});
		return {
			ready : x1.ready() && x2.ready()
		};
	}

	render(){
		if(!this.data.ready || this.state.loading){
			return util.renderLoading();
		}

		let list = KG.ZhiBoGroup.getDB().find({}, {sort : {createTime:-1}}).fetch();

		return (
			<div className="m-box">
				<h3>直播列表</h3>
				<div className="line"></div>
				{this.renderTable(list)}
				<div className="line"></div>
				<div style={util.style.RD}>
					<ND.Button type="primary"
					           onClick={()=>{util.goPath(`/zhibo/add`)}}>添加</ND.Button>
				</div>
			</div>
		);

	}

	renderTable(list) {
		let self = this;
		let titleArray = [
			{
				title: '直播群',
				render(t, doc){
					let h = KG.Qun.getDB().findOne({_id: doc.qunID}).name;

					return h;
				}
			},
			{
				title : '开始时间',
				render(t, doc){
					return moment(doc.startTime).format(KG.const.dateAllFormat);
				}
			},
			{
				title : '结束时间',
				render(t, doc){
					return moment(doc.endTime).format(KG.const.dateAllFormat);
				}
			},
			{
				title : '密码',
				dataIndex : 'password'
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
							<ND.Tooltip title="编辑"><a href={`/zhibo/edit/${doc._id}`}><ND.Icon type="edit" /></a></ND.Tooltip>
							{<ND.Tooltip title="删除"><a style={util.style.ML_12} onClick={del}><ND.Icon type="cross" /></a></ND.Tooltip>}
							{<ND.Tooltip title="进入直播间"><a href={`/web/zhibo/${doc._id}`} style={util.style.ML_12}><ND.Icon type="forward" /></a></ND.Tooltip>}
						</div>
					);
				}
			}
		];

		return <ND.Table columns={titleArray} bordered size="middle" dataSource={list} pagination={false}/>
	}

	delete(id){
		let self = this;

		swal({
			title: "确认删除这个群直播？",
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
				KG.ZhiBoGroup.getDB().remove({_id : id});
				self.setState({loading : false});
			}

		});
	}
};