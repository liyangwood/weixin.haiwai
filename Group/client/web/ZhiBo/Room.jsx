let ZHIBOSTATE = {
	'ready' : '未开始',
	'ongoing' : '进行中',
	'finish' : '已结束'
};
UI.Web_ZhiBo_Room = class extends KUI.Page{
	constructor(p){
		super(p);

		this.state = {
			loading : false,
			step : 1
		};
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

		if(!zhibo.password){
			this.state.step = 2;
		}

		let x2 = Meteor.subscribe(KG.config.Qun, {
			query : {_id : zhibo.qunID}
		});

		return {
			ready : x1.ready() && x2.ready(),
			zhibo : zhibo
		}
	}

	render() {
		if (!this.data.ready || this.state.loading) {
			return util.renderLoading();
		}

		return (
			<div className="m-box">
				{this.state.step===1 && this.renderStep1()}
				{this.state.step===2 && this.renderStep2()}
			</div>
		);
	}

	getZhiBoState(){

		let rs,
			zhibo = this.data.zhibo;
		let now = moment(new Date());
		if(now.isBefore(moment(zhibo.startTime))){
			rs = 'ready';
		}
		else if(now.isAfter(moment(zhibo.endTime))){
			rs = 'finish';
		}
		else{
			rs = 'ongoing';
		}

		return rs;
	}

	renderStep1(){

		let checkRoomPassword = ()=>{
			let v = util.ND.getInputValue(this.refs.pwd);
			console.log(v);

			//TODO server check

			if(this.data.zhibo.password === v){
				this.setState({
					step : 2
				});
			}
			else{
				swal('密码错误', '', 'error');
			}
		};

		return (
			<div style={util.style.TD}>
				<h3>请输入直播间密码</h3>
				<div className="line" />
				<ND.Input.Group size="large">
					<ND.Col span={8} offset={7}>
						<ND.Input size="large" ref="pwd" />
					</ND.Col>
					<ND.Col span={2}>
						<ND.Button onClick={checkRoomPassword.bind(this)} type="primary">确认</ND.Button>
					</ND.Col>
				</ND.Input.Group>


			</div>
		);
	}

	renderStep2(){
		let zhibo = this.data.zhibo;
		let sort = {
			CreateTime : this.getZhiBoState()==='ongoing'?-1:1
		};
		let list = KG.GroupMessage.getDB().find({
			nickname : {
				$nin : ['', null],
				$exists : true
			}
		}, {
			sort : sort
		}).fetch();
		let qun = KG.Qun.getDB().findOne({_id : zhibo.qunID});

		return (
			<div>

				<h3>
					{qun.name}的直播间
					<ND.Button style={{float:'right'}} onClick={this.refresh.bind(this)} type="primary">刷新</ND.Button>
				</h3>

				<hr/>
				<p>状态 ： {ZHIBOSTATE[this.getZhiBoState()]}</p>
				<p>简介 : {zhibo.description}</p>
				<hr/>
				{this.renderMessageList(list)}
			</div>
		);
	}
	refresh(){
		this.setState({loading : true});
		_.delay(()=>{
			this.setState({loading : false});
		}, 200);
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