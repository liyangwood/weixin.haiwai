UI.Wenda_Index = class extends UI.StatePage{

	defineState(){
		return {
			list : null
		};
	}

	renderPage(){

		return (
			<div className="m-box">
				<h3>问答设置列表</h3>
				<div className="line"></div>
				{this.renderTable(this.state.list)}
				<div className="line"></div>
				<div style={util.style.RD}>
					<ND.Button type="primary" onClick={()=>{util.goPath('/autoreply/wendaku/add')}}>新增</ND.Button>
				</div>
			</div>
		);

	}

	renderTable(list){
		let titleArray = [
			{
				title : 'ID',
				render(t, doc){
					return <a href={`/autoreply/wendaku/edit/${doc._id}`}>{doc._id}</a>;
				}
			},
			{
				title : '群名称',
				dataIndex : 'qun.name'
			},
			{
				title : '关键字',
				dataIndex : 'keyword'
			},
			{
				title : '回复',
				dataIndex : 'reply'
			},
			{
				title : '类型',
				dataIndex : 'type'
			}
		];

		return <ND.Table columns={titleArray} size="middle" dataSource={list} pagination={false} />
	}

	getPageData(callback){
		let self = this;
		KG.Wenda.callMeteorMethod('getAllByQuery', [{}], {
			success : function(rs){
				console.log(rs);
				callback();
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