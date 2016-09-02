let {Form, Row, Col, Input, Button} = ND;
let FormItem = Form.Item;

let FilterConfig = {
	qun : {
		label : '微信群'
	},
	text1 : {
		label : '类型'
	}
};

let C_Table = class extends UI.StatePage{
	defineState(){
		return {
			list : null
		};
	}
	renderPage(){
		let list = this.state.list;
		let titleArray = [
			{
				title : '分类',
				dataIndex : 'type'
			},
			{
				title : '群名称',
				render : (t, doc)=>{
					let h = _.map(doc.assignGroup, (item)=>{
						return item.name;
					});

					return h.join(',');
				}
			},
			{
				title : '关键字',
				dataIndex : 'keyword'
			},
			{
				title : '回复',
				dataIndex : 'reply',
				render(t, doc){
					return <p className="max-500">{t}</p>;
				}
			},

			{
				title : '操作',
				className : 'flex-center',
				render(t, doc){
					let del = ()=>{
						alert(1)
					};
					return (
						<div>
							<ND.Tooltip title="编辑"><a href={`/autoreply/wendaku/edit/${doc._id}`}><ND.Icon type="edit" /></a></ND.Tooltip>
							{/* <ND.Tooltip title="删除"><a style={util.style.ML_12} onClick={del}><ND.Icon type="cross" /></a></ND.Tooltip> */}
						</div>
					);
				}
			}
		];

		return <ND.Table columns={titleArray} size="middle" dataSource={list} pagination={false} />
	}

	getPageData(query={}){
		let self = this;
		KG.Wenda.callMeteorMethod('getAllByQuery', [query], {
			success : function(rs){
				console.log(rs);
				self.loading(false);
				if(rs.count){
					self.setState({
						list : rs.list
					});
				}
				else{
					self.setState({
						list : []
					});
				}
			}
		});
	}
};

UI.Wenda_Index = class extends KUI.RC.CSS{
	render(){

		return (
			<div className="m-box">
				<h3>问答设置列表</h3>
				<div className="line"></div>
				<UI.CM.Filter ref="filter" config={FilterConfig} callback={this.search.bind(this)} />
				<hr/>
				<C_Table ref="table" />
				<div className="line"></div>
				<div style={util.style.RD}>
					<ND.Button type="primary" onClick={()=>{util.goPath('/autoreply/wendaku/add')}}>新增</ND.Button>
				</div>
			</div>
		);

	}

	search(data){
		console.log(data);
		let query = {};
		if(data.qun){
			query.assignGroup = data.qun;
		}
		if(data.text1){
			query.type = {
				type : 'RegExp',
				value : data.text1
			};
		}
		this.refs.table.getPageData(query);
	}

};