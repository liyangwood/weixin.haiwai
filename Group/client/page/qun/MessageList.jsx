
UI.Qun_MessageList = class extends KUI.Page{

	constructor(p){
		super(p);
	}

	getMeteorData(){
		let qunID = FlowRouter.getQueryParam('qunID');

		let x = Meteor.subscribe(KG.config.Qun, {query : {
			_id : qunID
		}});
		let x1 = Meteor.subscribe(KG.config.GroupMessage, {query : {
			qunID : qunID
		}});

		return {
			ready : x.ready() && x1.ready(),
			qunID : qunID
		};
	}

	render(){
		if(!this.data.ready) return util.renderLoading();

		let o = KG.Qun.getDB().findOne({_id : this.data.qunID});

		let list = KG.GroupMessage.getDB().find({
			qunID : this.data.qunID
		}, {
			sort : {
				CreateTime : -1
			}
		}).fetch();

		return(
			<div className="m-box">
				<h3>{o.name} 消息记录</h3>
				<div className="line"></div>
				{this.renderTable(list)}
			</div>
		);
	}

	renderTable(list){
		console.log(list);
		let titleArray = [
			{
				title : 'User',
				dataIndex : 'UserObject.NickName'
			},
			{
				title : 'Content',
				dataIndex : 'Content'
			},
			{
				title : 'Time',
				render(t, doc){
					return moment.unix(doc.CreateTime).format(KG.const.dateAllFormat);
				}
			}
		];

		return <ND.Table columns={titleArray} size="middle" dataSource={list} pagination={false} />
	}
};