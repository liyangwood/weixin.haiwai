
UI.ZhiBo_Room = class extends KUI.Page{
	constructor(p){
		super(p);
	}

	getMeteorData(){
		let zbID = FlowRouter.getParam('id');

		let x = Meteor.subscribe(KG.config.ZhiBoGroup, {
			query : { _id : zbID }
		});

		if(!x.ready()){
			return {ready : false};
		}
		let zhibo = KG.ZhiBoGroup.getDB().findOne({_id : zbID});
		let x1 = Meteor.subscribe(KG.config.GroupMessage, {
			query : {
				qunID : zhibo.qunID,
				CreateTime : {
					$gte : moment(zhibo.startTime).unix(),
					$lte : moment(zhibo.endTime).unix()
				}
			}
		});

		let x2 = Meteor.subscribe(KG.config.Qun, {
			query : {_id : zhibo.qunID}
		});

		return {
			ready : x1.ready() && x2.ready(),
			zhibo : zhibo
		}
	}

	render(){
		if(!this.data.ready){
			return util.renderLoading();
		}

		let zhibo = this.data.zhibo;
		let list = KG.GroupMessage.getDB().find({
			nickname : {
				$nin : ['', null],
				$exists : true
			}
		}, {
			sort : {
				CreateTime : -1
			}
		}).fetch();
		let qun = KG.Qun.getDB().findOne({_id : zhibo.qunID});

		return (
			<div className="m-box">
				<h3>{qun.name}的直播间</h3>
				<hr/>
				<p>{zhibo.description}</p>
				<hr/>
				{this.renderMessageList(list)}
			</div>
		);
	}

	replaceMessageContent(item){
		var html = _.unescape(item.Content);
		if(item.MsgType === 49){
			return <a target="_blank" href={_.unescape(item.Url)}>{item.FileName}</a>
		}

		return html
	}

	renderMessageList(list){
		console.log(list);

		return (
			<div>
				<ND.Timeline>
					{
						_.map(list, (item, index)=>{

							return (
								<ND.Timeline.Item key={index}>
									{item.UserObject.NickName}
									<p>{this.replaceMessageContent(item)}</p>
									<p style={util.style.RD}>{moment.unix(item.CreateTime).format(KG.const.dateAllFormat)}</p>
								</ND.Timeline.Item>
							)
						})
					}
				</ND.Timeline>
			</div>
		);
	}
};