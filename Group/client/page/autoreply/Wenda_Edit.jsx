
UI.Wenda_Edit = class extends KUI.Page{
	getMeteorData(){
		let id = FlowRouter.getParam('id');

		let x = Meteor.subscribe(KG.config.Wenda, {
			query : {_id : id}
		});

		return {
			id : id,
			ready : x.ready()
		}
	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}

		let d = KG.Wenda.getDB().findOne({_id : this.data.id});

		return (
			<div className="m-box">
				<h3 style={util.style.TD}>编辑问答</h3>
				<hr/>
				<UI.CM.Wenda_Add init-data={d} ref="form" />
				<ND.Col span={16} offset={4}>
					<ND.Button type="primary" onClick={this.save.bind(this)}>保存</ND.Button>

					<ND.Button style={{marginLeft:'30px'}} type="default" onClick={this.delete.bind(this)}>删除</ND.Button>
				</ND.Col>
			</div>
		);
	}

	save(){
		let self = this;
		this.refs.form.getValue(function(data){
			if(!data) return false;
			console.log(data);

			let nd = KG.Wenda.getDB().update({_id : self.data.id}, {
				$set : data
			});
			if(nd){
				util.alert.ok('Update Success');
				util.goPath('/autoreply/wendaku');
			}
		});

	}
	delete(){
		let self = this;
		swal({
			title: "确认删除这个问答？",
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
				KG.Wenda.getDB().remove({_id : self.data.id});
				util.goPath('/autoreply/wendaku');
			}

		});
	}
};