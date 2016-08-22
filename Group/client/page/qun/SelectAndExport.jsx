UI.Qun_SelectAndExport = class extends KUI.Page{

	constructor(p){
		super(p);

		this.state = {
			result : []
		};
	}

	getMeteorData(){
		let qunID = FlowRouter.getQueryParam('qunID');

		let x = Meteor.subscribe(KG.config.Qun, {query : {
			_id : qunID
		}});
		let x1 = util.data.subscribe(KG.config.GroupMessage, {query : {
			qunID : qunID
		}});

		//let xx = Meteor.subscribe('images');

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
				CreateTime : 1
			}
		}).fetch();

		return(
			<div className="m-box">
				<h3>请选择要编辑的内容
					<ND.Button style={{float:'right'}} onClick={this.goToEditor.bind(this)} type="primary">进入编辑</ND.Button>
				</h3>
				<div className="line"></div>
				{this.renderTable(list)}
			</div>
		);
	}

	defineTableRowSelection(){
		let self = this;
		let p = {
			onChange(key, row){
				//console.log(key, row);
				self.state.result = row;
			},
			onSelect(doc, selected, row){
				//console.log(doc, selected, row);
			},
			onSelectAll(selected, row, changeRow){
				//console.log(selected, row, changeRow);
			}
		};

		return p;
	}

	renderTable(list){
		console.log(list);
		let titleArray = [
			{
				title : 'User',
				dataIndex : 'UserObject.NickName'
			},
			{
				title : 'Display Name',
				dataIndex : 'UserObject.DisplayName'
			},
			{
				title : 'Content',
				dataIndex : 'Content',
				render(t, doc){
					return <div className="max-500">{util.weixin.replaceMessageByType(doc)}</div>;
				}
			},
			{
				title : 'Time',
				render(t, doc){
					return moment.unix(doc.CreateTime).format(KG.const.dateAllFormat);
				}
			}
		];

		let pageination = {
			pageSize : 50,
			total : list.length
		};
		if(list.length < 51){
			pageination = false;
		}

		return <ND.Table columns={titleArray}
		                 rowSelection={this.defineTableRowSelection()}
		                 size="middle" dataSource={list} pagination={pageination} />
	}

	goToEditor(){
		console.log(this.state.result);

		//set to session
		Session.set('Qun-TempData', this.state.result);

		//go to editor page
		util.goPath('/qun/message/export/edit');
	}
};