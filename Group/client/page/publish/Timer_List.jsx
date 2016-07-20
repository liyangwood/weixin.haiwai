
UI.Publish_Timer_List = class extends KUI.Page{

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
		if(!this.data.ready){
			return util.renderLoading();
		}

		let list = KG.Content.getDB().find({
			time : {
				'$gt' : new Date()
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
		let titleArray = [
			{
				title : 'ID',
				render(t, doc){
					return <a href={``}>{doc._id}</a>;
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
			}
		];

		return <ND.Table columns={titleArray} size="middle" dataSource={list} pagination={false} />
	}

};