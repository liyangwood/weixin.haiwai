let FilterConfig = {
	qun : {
		label : '微信群'
	},
	text1 : {
		label : '机器人'
	}
};

UI.Qun_List = class extends KUI.Page{
	constructor(p){
		super(p);
		this.state = {
			query : {}
		};
	}

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

		let list = KG.Qun.getDB().find(this.state.query, {
			sort : {
				createTime : -1
			}
		}).fetch();

		console.log(list);

		return (
			<div className="m-box">
				<h3>微信群列表</h3>
				<div className="line"></div>
				<UI.CM.Filter ref="filter" config={FilterConfig} callback={this.search.bind(this)} />
				<hr/>
				{this.renderTable(list)}
			</div>
		);

	}
	search(data){
		let query = {};
		if(data.qun){
			query._id = data.qun;
		}
		if(data.text1){
			query.rebot = new RegExp(data.text1, 'g');
		}

		this.setState({query, query});
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
				title : '群人数',
				dataIndex : 'info.number',
				render(t, doc){
					return t || '';
				}
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