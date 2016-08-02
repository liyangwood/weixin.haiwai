
UI.Event_List = class extends KUI.Page{
	constructor(p){
		super(p);
		this.state = {
			loading : false
		};
	}

	getMeteorData(){
		let x1 = Meteor.subscribe(KG.config.Qun),
			x2 = Meteor.subscribe(KG.config.Event, {});
		return {
			ready : x1.ready() && x2.ready()
		};
	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}

		let list = KG.Event.getDB().find({}, {sort : {createTime:-1}}).fetch();

		return (
			<div className="m-box">
				<h3>事件列表</h3>
				<div className="line"></div>
				{this.renderTable(list)}
				<div className="line"></div>

			</div>
		);

	}

	renderTable(list) {
		let self = this;
		let titleArray = [
			{
				title: 'ID',
				render(t, doc){
					return <a href={`/publish/timer/edit/${doc._id}`}>{doc._id}</a>
				}
			},
			{
				title: '类型',
				dataIndex: 'type'
			},
			{
				title: '内容',
				dataIndex: 'content'
			},
			{
				title : '回复',
				dataIndex : 'reply'
			},
			{
				title: '发布到的群',
				render(t, doc){
					let h = _.map(doc.assignGroup, (id)=> {
						return KG.Qun.getDB().findOne({_id: id}).name;
					});

					return h.join(',');
				}
			},
			{
				title: '操作',
				className: 'hw-center',
				render(t, doc){
					let del = ()=> {
						//self.delete(doc._id);
					};

					return <ND.Button onClick={del}><ND.Icon type="cross"/></ND.Button>;
				}
			}
		];

		return <ND.Table columns={titleArray} bordered size="middle" dataSource={list} pagination={false}/>
	}
};