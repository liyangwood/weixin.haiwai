
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
				CreateTime : 1
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
		return util.weixin.replaceMessageByType(item, {
			maxImageWidth : '500px'
		});
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
									{this.renderEachMessage(item)}
								</ND.Timeline.Item>
							)
						})
					}
				</ND.Timeline>
			</div>
		);
	}

	renderEachMessage(item){
		let sy = {
			dt : {
				height : '32px'
			},
			a1 : {
				width : '32px',
				height : '32px'
			},
			a2 : {
				display : 'inline-block',
				height : '32px',
				'verticalAlign' : 'top',
				fontSize : '15px',
				color : '#787878',
				marginLeft : '12px'
			},
			a3 : {
				float : 'right'
			},
			dd : {
				padding : '8px 12px',
				marginTop : '2px',
				background : '#eeeeee',
				borderRadius : '5px'
			}
		};

		return (
			<div>
				<dt style={sy.dt}>
					<img style={sy.a1} src={`/res/head/image/${this.data.zhibo.qunID}/${item.UserObject.NickName}`} />
					<span style={sy.a2} className="flex-center">{item.UserObject.NickName}</span>
					<span style={sy.a3}>{moment.unix(item.CreateTime).format(KG.const.dateAllFormat)}</span>
				</dt>
				<dd style={sy.dd}>
					{this.replaceMessageContent(item)}
				</dd>
			</div>
		)
	}
};