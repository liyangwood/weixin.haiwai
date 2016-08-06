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
				dataIndex : 'rebot',
				render(t, doc){
					return <a href={`/qun/tmp/list?name=${t}`}>{t}</a>;
				}
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

UI.Qun_Tmp_List = class extends KUI.Page{
	getMeteorData(){
		let rbName = FlowRouter.getQueryParam('name');

		let x = Meteor.subscribe(KG.config.TmpQun, {query : {
			rebot : rbName
		}});

		return {
			name : rbName,
			ready : x.ready()
		};
	}
	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}

		let list = KG.TmpQun.getDB().find({
			rebot : this.data.name
		}, {
			sort : {
				createTime : -1
			}
		}).fetch();

		console.log(list);

		return (
			<div className="m-box">
				<h3>{this.data.name} 还没有添加的微信群列表</h3>
				<p>可以直接操作添加，就可以进行维护和管理</p>
				<div className="line"></div>
				{this.renderTable(list)}
			</div>
		);

	}

	renderTable(list){
		let self = this;
		let titleArray = [
			{
				title : '群名称',
				dataIndex : 'name'
			},
			{
				title : '群人数',
				dataIndex : 'info.number',
				render(t, doc){
					return t || '';
				}
			},
			{
				title : '操作',
				className : 'flex-center',
				render(t, doc){
					let add = ()=>{
						swal({
							title: "确认添加",
							text: "",
							type: "info",
							showCancelButton: true,
							confirmButtonText: "确认",
							cancelButtonText: "取消",
							closeOnConfirm: true,
							closeOnCancel: true
						}, function(isConfirm){
							if(isConfirm){
								self.insertToQunDB(doc);
							}

						});

					};

					return (
						<div>
							<ND.Tooltip title="添加到群列表"><a onClick={add}><ND.Icon type="plus" /></a></ND.Tooltip>

						</div>
					);
				}
			}
		];

		return <ND.Table columns={titleArray} size="middle" dataSource={list} pagination={false} />
	}

	insertToQunDB(data){
		console.log(data);

		KG.Qun.getDB().insert(data, function(err, nd){
			if(err){

				util.alert.error(err);
				return false;
			}
			if(nd){
				KG.TmpQun.getDB().remove({_id : data._id});
				util.alert.ok('Insert Success');
				util.goPath('/qun/list');
			}
		});
	}
};