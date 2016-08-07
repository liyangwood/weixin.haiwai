/*
 * 处理机器人的主要数据逻辑
 *
 * namespace Message
 * */

import {KG, _} from 'meteor/kg:base';

//文字逻辑规则定义
var TextRuleJson = [
	{
		key : '群规',
		result : '这是测试的群规内容'
	},
	{
		key : '靠',
		result : '@{GroupUser}, 群内禁止粗口，警告一次'
	},
	{
		key : '我要直播',
		result : '地址：http://b094c2cb.ngrok.io/qun/add'
	}
];

var CommonRule = [
	{
		key : '今日新闻',
		result : function(callback){
			callback(1234);
		}
	}

];


var F = {
	isFromGroup : function(msg){
		var from = msg.FromUserName;
		return /^@@/.test(from);
	},

	getContent : function(msg){
		var type = msg.MsgType;
		var content = msg.Content;

		var rs = {};


		//text
		var tmp = content.split('<br/>');
		if(!F.isFromGroup(msg)){
			//好友信息
			rs = {
				content : content
			};
		}
		else if(tmp.length > 1){
			var x = tmp.slice(1, tmp.length);
			//群信息
			rs = {
				content : x.join('<br/>'),
				groupUser : tmp[0].slice(0, -1)
			};
		}
		else if(msg.MsgType === 10000){
			// 邀请加入群聊

			var x = content.slice(0, -5).replace('邀请', ';').split(';');

			rs = {
				content : content,
				groupUser : x[0],
				newUser : x[1]
			};
		}



		console.log(rs);
		return rs;
	},

	saveToDB : function(type, data){
		if(!type) return;

		var db;
		if(type === 'Group'){
			db = GroupMessage;
		}

		var insert = (function(data){
			db.insert(data);
		});

		insert(data);
	},

	/*
	 * 存数据到群直播的db中
	 * 根据群的NickName判断
	 * */
	saveToQunDB : function(msg, wx){
		var nick = wx.getGroupList()[msg.FromUserName].NickName;
		var currentUser = wx.getCurrentUser();
		console.log(nick, currentUser);

		msg.GroupName = nick;
		let qun = KG.Qun.getDB().findOne({
			name : nick,
			rebot : currentUser.NickName
		});
		if(qun){
			msg.qunID = qun._id;
			msg.rebot = qun.rebot;
			msg.qunName = qun.name;

			KG.GroupMessage.getDB().insert(msg);
		}

		return msg;

	},

	doMessage : function(text, msg, wx, filter, callback){

		if(filter.type === 'Group'){
			//save to GroupMessage db
			msg.MessageType = 'Group';
			msg.nickname = filter.GroupUser;
			msg.OriContent = msg.Content;
			msg.Content = text;
			msg.UserObject = filter.GroupUserObject;

			//F.saveToDB(msg, wx);

			msg = F.saveToQunDB(msg, wx);

		}
		else{
			//F.saveToDB(msg, wx);
		}


		console.log(msg);

		//统一采用异步方式
		switch(msg.MsgType){
			case 1 :
				F.doMessageByText(msg, filter, callback);

				break;
			case 3 :
				F.doMessageByImage(msg, wx, callback);

				break;

			case 34:
				//语音
				break;

			case 43:
				//视频
				break;

			case 10000:
				F.doMessageByWelcome(msg, filter, wx, callback);
				break;

		}

	},

	doMessageByWelcome : function(msg, filter, wx, callback){
		let el = KG.Event.getDB().find({
			assignGroup : msg.qunID,
			type : 'welcome'
		}).fetch();
		_.each(el, (item)=>{

			callback(F.replaceFilter(item.reply, filter));

		});


	},

	doMessageByImage : function(msg, wx, callback){

	},

	doMessageByText : function(msg, filter, callback){
		var text = msg.Content;
		//query from KG.Wenda DB
		let one = KG.Wenda.getDB().findOne({
			keyword : text,
			assignGroup : msg.qunID
		});
		console.log(filter);
		if(one){
			let rs = F.replaceFilter(one.reply, filter);


			callback(rs);
		}

		let el = KG.Event.getDB().find({
			assignGroup : msg.qunID,
			type : 'text'
		}).fetch();
		_.each(el, (item)=>{
			let reg = new RegExp(item.content, 'g');
			if(reg.test(text)){
				callback(F.replaceFilter(item.reply, filter));
			}
		});

		//统计信息
		if('积分'===text){
			callback(this.getJiFenResult(msg.qunID));
		}

	},

	getJiFenResult : function(qunID){
		let pipe = [
			{
				'$match' : {
					qunID : qunID
				}
			},
			{
				'$group' : {
					_id : '$UserObject.NickName',
					count: { $sum: 1 }
				}
			},
			{
				'$sort' : {
					count : -1
				}
			}
		];
		let rs = KG.GroupMessage.getDB().aggregate(pipe);
		console.log(rs);
		let h = '';
		_.each(rs, (item)=>{
			h += item._id+' ('+item.count+')\n';
		});

		return h;

	},

	replaceFilter : function(str, filter){
		return str.replace(/\{([^\}]*)\}/g, function(match, key, index){
			if(filter[key]){
				return filter[key];
			}
			else{
				return match;
			}
		});
	},


	processMessage : function(msg, wx){
		//console.log(msg);
		var cont = F.getContent(msg);
		var groupList = wx.getGroupList();

		var from = msg.FromUserName;


		var groupUser;
		if(groupList[from]){
			//群消息
			if(cont.groupUser){
				var gu = groupList[from]['Member'][cont.groupUser];

				//群成员发的信息
				if(gu) groupUser = gu.DisplayName || gu.NickName;

				F.doMessage(cont.content, msg, wx, {
					type : 'Group',
					'GroupUser' : groupUser,
					'NewUser' : cont.newUser,
					GroupUserObject : gu || {}
				}, function(rs){
					console.log(rs);


					if(!rs) return;

					wx.sendMessage({
						type : 1,
						FromUserName : msg.ToUserName,
						ToUserName : msg.FromUserName,
						Content : rs
					}, function(err, rs){
						console.log(rs);
					});
				});

			}
			else{
				//其他群消息
			}
		}
		else{
			//TODO
		}


	},

	processFriend : function(list, wx){
		//放到session
		_.each(list, function(item){

		});
	},

	initCronJob(wx){
		console.log('----- init cron job -----');
		//cron job
		let job = {
			name : 'Make timer publish',
			schedule: function (parser) {
				return parser.text('every 1 min');
			},
			job : function(){

				if(!wx.config.isConnect) return false;

				let now = new Date();
				let after = moment(now).add(1, 'minutes').toDate();
				let pubList = KG.Content.getDB().find({
					publishType : 'timer',
					time : {
						'$lt' : now,
						'$gt' : after
					}
				});

				if(pubList.count() > 0){
					_.each(pubList.fetch(), (item)=>{

						_.each(item.assignGroup, (l)=>{
							F.sendPublishTimerContent(l, item, wx);
						});



					});
				}

			}
		};

		KG.SyncedCron.add(job);

		job = {
			name : 'keep connect',
			schedule: function (parser) {
				return parser.text('every 10 min');
			},
			job : function(){

				if(!wx.config.isConnect) return false;

				let cu = wx.getCurrentUser();

				//只是针对李杰克的小号测试
				if(cu.NickName !== '李杰克') return false;

				let qun = KG.Qun.getDB().findOne({name : '测试机器人群1'});
				if(!qun) return false;

				let groupList = wx.getGroupList();

				let one = _.find(groupList, function(d){
					return d.NickName === qun.name;
				});

				if(one){
					//console.log('[send Timer Content]', item.content, one.UserName, cu.UserName);
					wx.sendMessage({
						type : 1,
						FromUserName : cu.UserName,
						ToUserName : one.UserName,
						Content : moment(new Date()).format(KG.const.dateAllFormat)
					}, function(err, rs){
						console.log(err, rs);
					});
				}

			}
		};
		KG.SyncedCron.add(job);
	},

	sendPublishTimerContent(qunID, item, wx){
		let cu = wx.getCurrentUser();
		let qun = KG.Qun.getDB().findOne({_id : qunID});
		if(qun.rebot !== cu.NickName) return false;

		let groupList = wx.getGroupList();

		let one = _.find(groupList, function(d){
			return d.NickName === qun.name;
		});

		if(one && item.content){
			//console.log('[send Timer Content]', item.content, one.UserName, cu.UserName);
			wx.sendMessage({
				type : 1,
				FromUserName : cu.UserName,
				ToUserName : one.UserName,
				Content : item.content
			}, function(err, rs){
				console.log(err, rs);
			});
		}
	}


};


let Message = F;
export default Message;