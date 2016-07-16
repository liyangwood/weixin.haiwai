
UI.Qun_List = class extends KUI.Page{

	getMeteorData(){
		let x = Meteor.subscribe(KG.config.Qun);
		console.log(x.ready());
		return {
			ready : x.ready()
		};
	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}

		let list = KG.Qun.getDB().find({}, {
			sort : {
				createTime : -1
			}
		}).fetch();

		console.log(list);

		return (
			<div className="m-box">
				<h3>微信群列表</h3>
				<div className="line"></div>
				{this.renderTable(list)}
			</div>
		);

	}

	renderTable(list){
		let titleArray = [
			{
				title : '群名称',
				dataIndex : 'name',
				render(text, doc){
					return <a href={`/qun/edit/${doc._id}`}>{text}</a>;
				}
			},
			{
				title : '机器人',
				dataIndex : 'rebot'
			},
			{
				title : '创建时间',
				render(txt, doc){
					return moment(doc.createTime).format(KG.const.dateAllFormat);
				}
			}
		];

		return <ND.Table columns={titleArray} size="middle" dataSource={list} pagination={false} />
	}
};