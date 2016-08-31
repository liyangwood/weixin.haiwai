/*
 * 微信机器人的微信接口部分
 *
 * @namespace : WECHAT
 * @where : server
 * */


import {KG, _, moment} from 'meteor/kg:base';

let WECHAT = {};

if(Meteor.isServer){
	//if(Meteor.isClient) return;
	let requestSelf = require('./request.jsx').requestSelf;
	var request = require('request');
	var fs = require('fs');
	var parseXml = require('xml2js').parseString;

	var npmR = request;
	var npmRequest = Meteor.wrapAsync(function(opts, callback){
		npmR(opts, Meteor.bindEnvironment(callback));
	});


	var FormData = require('form-data');

	Meteor.startup(function(){
		//console.log(request.post)

	});


	(function(request){

		//在长链接请求的时候同时启动timer，检查一定时间内请求是否返回
		let tm = null;


		var config = {
			root : 'https://wx.qq.com',
			host : 'https://wx.qq.com/cgi-bin',
			pushRoot : 'https://webpush.weixin.qq.com',
			loginState : {},

			isCheck : false,
			isConnect : false
		};

		//缓存好友部分中的群列表
		var groupList = {};

		//缓存好友列表
		var friendList = {};

		//缓存当前用户的信息
		var curentUser = {};

		var F = {
			reset : function(){
				wx.config.isCheck = false;
				wx.config.isConnect = false;
				wx.config.loginState = {};
				wx.config.uuid = null;

				groupList = {};
				friendList = {};
				curentUser = {};
			},

			getRequestHeader : function(){
				return {
					'Content-Type':'application/json;charset=UTF-8',
					'Cookie' : wx.config.cookie,
					'Host': 'wx.qq.com',
					'Origin' : 'https://wx.qq.com',
					'Referer' : 'https://wx.qq.com/?&lang=zh_CN',
					'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
				};
			},

			setCookie : function(cookie){
				var rs = '';
				var obj = {};
				_.each(cookie, function(item){
					var tmp = item.substring(0, item.indexOf(';'));
					rs += tmp + ';';
					var s = tmp.split('=');
					obj[s[0]] = s[1];

					if(s[0]==='wxuin'||s[0]==='wxsid'){
						wx.config[s[0]] = s[1];
					}
				});



				//console.log(rs, obj);

				wx.config.cookieObj = obj;
				wx.config.cookie = rs;
			},

			setSyncKey : function(key){

				var list = key.List;
				var rs = '';
				_.each(list, function(item){
					rs += item.Key+'_'+item.Val + '|';
				});

				rs = rs.slice(0, -1);
				//console.log(rs);
				wx.config.sync = key;
				wx.config.synckey = rs;
			},

			setOption : function(opts){

				opts = _.extend({
					url : '',
					method : 'GET'

				}, opts||{});

				return opts;

			},

			getBaseRequest : function(){
				return {
					DeviceID: wx.getDevice(),
					Sid: wx.config.wxsid,
					Skey: wx.config.skey,
					Uin: wx.config.wxuin
				};
			},


			checkWeixinLogin : function(callback){

				//step 1 判断用户是否已经扫码成功
				var url = 'https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login?loginicon=true&uuid='+wx.config.uuid+'&tip=0&r=&_='+Date.now();

				request(F.setOption({
					url : url,
					headers : F.getRequestHeader()
				}), function(err, res, body){
					//console.log(body);

					var window = {};
					eval(body);
					_.extend(wx.config.loginState, window);

					callback(body);

				});


			},

			getWeixinConfigAfterLogin : function(){
				//step 2 如果用户扫码成功，开始获得微信的初始化信息

				var url = wx.config.redirect_uri+'&fun=new&version=v2';
				//console.log(url);
				console.log('------ 开始初始化微信信息 -------');

				let rp = function(x){
					//console.log(x);
					return x[0];
				};

				request(F.setOption({
					url : url,
					headers : F.getRequestHeader()
				}), function(err, res, body){

					F.setCookie(res.headers['set-cookie']);

					parseXml(body, function (err, result) {
						var json = result;
						console.log(json)

						if(rp(json.error.skey)){
							wx.config.skey = rp(json.error.skey);
							wx.config.wxsid = rp(json.error.wxsid);
							wx.config.wxuin = rp(json.error.wxuin);
							wx.config.pass_ticket = rp(json.error.pass_ticket);
							wx.config.isgrayscale = rp(json.error.isgrayscale);

							F.getWeixinInitData();
						}

						wx.config.startTime = Date.now();
					});


				});

			},

			getWeixinInitData : function(){
				// step 3 通过2获得的信息获取初始化的聊天信息
				//var url = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxinit?r=296514303&pass_ticket=FnVkCuGvemRMbBmYN7tkD%252Bm%252FUqwh6%252Bbz3ULOFvxjM09ZplOM6ML1EwzLPK3166qS';

				var url = [
					wx.config.host,
					'/mmwebwx-bin/webwxinit?',
					'r='+wx.config.wxuin
					//'&pass_ticket='+wx.pass_ticket
				].join('');

				//ContactList
				//User

				request(F.setOption({
					url : url,
					headers : F.getRequestHeader(),
					method : 'POST',
					json : true,
					data : {
						BaseRequest : F.getBaseRequest()
					}
				}), function(err, res, body){
					//console.log(body);


					wx.config.skey = body['SKey'];
					F.setSyncKey(body.SyncKey);

					//set User into Session
					curentUser = body.User;

					//clean tmp-qun db
					KG.TmpQun.getDB().remove({
						rebot : curentUser.NickName
					});

					//处理微信的好友list,这里只是部分
					var list = body.ContactList;

					_.each(list, function(item){
						F.doContracListItem(item);

					});


					F.beforeLoopCheck();
					//F.loopCheckNewChats();


				});


			},

			doFriendList : function(item){

				var flag = item.VerifyFlag;
				//0 user  8 订阅号  24服务号 暂时的判断，不一定对
				if(flag < 25){
					friendList[item.UserName] = item;


				}
			},

			doGroupUser : function(item){
				var f = true;
				if(groupList[item.UserName]){
					f = false;
				}

				//如果群成员为0,说明是无效群，放弃
				if(item.MemberCount < 1){
					return;
				}
				if(!item.NickName) return;

				var mlist = item.MemberList;
				item.Member = {};
				_.each(mlist, function(one){
					item.Member[one.UserName] = one;

					wx.saveHeadImage(item, one);

				});

				groupList[item.UserName] = item;




				//update qun info
				let c = KG.Qun.getDB().find({
					name : item.NickName,
					rebot : curentUser.NickName
				}).count();
				if(c>0){
					KG.Qun.getDB().update({
						name : item.NickName,
						rebot : curentUser.NickName
					}, {$set : {
						info : {
							number : item.MemberCount
						}
					}});
				}
				else{
					//console.log(item.NickName, curentUser.NickName);
					KG.TmpQun.getDB().update({
						name : item.NickName,
						rebot : curentUser.NickName
					}, {$set : {
						name : item.NickName,
						rebot : curentUser.NickName,
						info : {
							number : item.MemberCount
						}
					}}, {upsert : true});
				}
			},

			beforeLoopCheck : function(){
				//开始loop前同步需要的数据

				var url = wx.config.host+'/mmwebwx-bin/webwxsync?sid='+wx.config.wxsid+'&r='+Date.now()+'&skey='+wx.config.skey;

				request(F.setOption({
					url:url,
					method : 'POST',
					json : true,
					headers : F.getRequestHeader(),
					data : {
						BaseRequest : F.getBaseRequest(),
						SyncKey : wx.config.sync,
						rr : Date.now()
					}
				}), function(err, res, body){
					//console.log(body);

					F.setSyncKey(body.SyncKey);

					//这里处理变化的信息
					F.doAllContactList(body);

					F.getAllFriendsList();

					wx.config.isConnect = true;
					console.log('----- 开始微信长链接请求 -----');
					F.loopCheckNewChats();

				});
			},

			checkLoopTime : function(){

				if(!wx.config.isConnect){
					return false;
				}


				return true;
			},

			loopCheckNewChats : function(){
				var url = [
					'r='+Date.now(),
					'&skey='+wx.config.skey,
					'&sid='+wx.config.wxsid,
					'&uin='+wx.config.wxuin,
					'&deviceid='+wx.getDevice(),
					'&f=json',
					'&synckey='+wx.config.synckey,
					'&_='+Date.now()
				].join('');
				url = wx.config.pushRoot+'/cgi-bin/mmwebwx-bin/synccheck?'+url;

				var cookie = wx.config.cookie;

				tm = Meteor.setTimeout(function(){
					F.reset();
					F.getWeixinConfigAfterLogin();
				}, 1000*60*5);

				request({
					url : url,
					method : 'GET',
					headers : {
						'Host' : 'webpush.weixin.qq.com',
						'Referer' : 'https://wx.qq.com/',
						'Cookie' : cookie,
						'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
					}
				}, function(err, res, body){
					console.log(err, body);

					if(tm){
						Meteor.clearTimeout(tm);
					}

					//window.synccheck={retcode:"0",selector:"2"}
					var json = JSON.parse(body);
					if(json.retcode > 0){
						//出现心跳错误
						F.reset();
						F.getWeixinConfigAfterLogin();
					}
					else{
						if(json.selector > 0){
							F.getNewMessage(function(){
								if(F.checkLoopTime()){
									F.loopCheckNewChats();
								}
							});
						}
						else{
							if(F.checkLoopTime()){
								F.loopCheckNewChats();
							}
						}


					}



				});
			},
			getNewMessage : function( callback ){

				var url = wx.config.host+'/mmwebwx-bin/webwxsync?sid='+wx.config.wxsid+'&skey='+wx.config.skey+'';
				var formData = {
					BaseRequest : F.getBaseRequest(),
					SyncKey : wx.config.sync
				};
				request(F.setOption({
					url : url,
					method : 'POST',
					headers : F.getRequestHeader(),
					data : formData,
					json : true
				}), function(err, res, body){
console.log(body);
					F.setSyncKey(body.SyncKey);
					F.setCookie(res.headers['set-cookie']);



					F.doAllContactList(body);
					F.process(body);

					if(callback){
						callback();
					}

				});
			},

			doAllContactList : function(json){
				//处理所有关于联系人的修改和变化
				if(json.ModContactCount > 0){
					_.each(json.ModContactList, function(item){
						F.doContracListItem(item);
					});
				}
			},

			process : function(json){
				if(json.AddMsgCount > 0){
					wx.dealChatMessage(json.AddMsgList);
				}
			},

			//获得所有的好友列表
			getAllFriendsList : function(){

				var url = wx.config.host+'/mmwebwx-bin/webwxgetcontact?lang=zh_CN&pass_ticket='+wx.config.pass_ticket+'&r='+Date.now()+'&skey='+wx.config.skey;

				request(F.setOption({
					url : url,
					method : 'Get',
					headers : F.getRequestHeader(),
					json : true
				}), function(err, res, body){
					//console.log('----friendlist--->', body);

					_.each(body.MemberList, function(item){
						F.doContracListItem(item);
					});

					F.getAllGroupList();

				});
			},

			/*
			 * 处理返回的联系人条目，可能是群，人，或服务号
			 * */
			doContracListItem : function(item){

				if(item.MemberCount > 0){
					//群
					F.doGroupUser(item);
				}
				else{
					F.doFriendList(item);
				}
			},

			// 获得所有的微信群列表
			getAllGroupList : function(glist){
				var url = wx.config.host+'/mmwebwx-bin/webwxbatchgetcontact?type=ex&r='+Date.now()+'&lang=zh_CN&pass_ticket='+wx.config.pass_ticket;

				var list = glist || _.map(groupList, function(item, key){
						return{
							UserName : item.UserName,
							ChatRoomId : ''
						}
					});

				request(F.setOption({
					url : url,
					method : 'POST',
					headers : F.getRequestHeader(),
					json : true,
					data : {
						BaseRequest : F.getBaseRequest(),
						Count : list.length,
						List : list
					}
				}), function(err, res, body){
					console.log('----grouplist---->', body);



					_.each(body.ContactList, function(item){

						F.doContracListItem(item);

					});

				});
			}


		};

		var wx = {
			config : config,
			getDevice : function(){
				return 'e'+_.random(10000000000, 99999999999);
			},

			getGroupList : function(){
				return groupList;
			},

			getCurrentUser : function(){
				return curentUser;
			},

			getFriendList : function(){
				return friendList;
			},

			getCurrentStatus : function(){
				return {
					user : wx.getCurrentUser(),
					connect : wx.config.isConnect,
					groupList : wx.getGroupList(),
					loginState : wx.config.loginState
				};
			},

			setting : function(setting){

				wx.role = _.extend({
					//function 返回经过处理的逻辑
					processMessage : setting.processMessage,

					// 处理好友部分
					processFriend : setting.processFriend,
					initCronJob : setting.initCronJob
				}, setting||{});


				wx.role.initCronJob(wx);

			},



			getLoginQrCode : function(callback){

				var tmp = Meteor.uuid();
				var tm = tmp;
				wx.config.isCheck = tmp;

				var url = 'https://login.weixin.qq.com/jslogin?appid=wx782c26e4c19acffb&redirect_uri=https%3A%2F%2Fwx.qq.com%2Fcgi-bin%2Fmmwebwx-bin%2Fwebwxnewloginpage&fun=new&f=json&lang=zh_CN&_='+Date.now();

				request(F.setOption({
					url : url
				}), function(err, res, body){
					//console.log(body);
					//window.QRLogin.code = 200; window.QRLogin.uuid = "oeb5B863ng=="
					var window = {};
					window.QRLogin = {};
					eval(body);
					if(window.QRLogin.uuid){
						wx.config.uuid = window.QRLogin.uuid;

						callback(true, 'https://login.weixin.qq.com/qrcode/'+wx.config.uuid+'?t=webwx');


						//开始检测用户是否扫码登录
						var okFn = function(rs){
							if(rs.indexOf('window.redirect_uri=') > -1){


								var window = {};
								eval(rs);
								wx.config.redirect_uri = window.redirect_uri;

								//根据这里设置host
								if(wx.config.redirect_uri.indexOf('wx2.qq.com') > 0){
									wx.config.root = 'https://wx2.qq.com';
									wx.config.host = 'https://wx2.qq.com/cgi-bin';
									wx.config.pushRoot = 'https://webpush2.weixin.qq.com';

								}


								F.getWeixinConfigAfterLogin();

							}
							else if(wx.config.isCheck && wx.config.isCheck === tm){
								console.log('---check id---> ', tm);
								F.checkWeixinLogin(okFn);
							}
						};

						F.checkWeixinLogin(okFn);
					}
					else{
						//TODO
					}

				});
			},

			dealChatMessage : function(msgList){
				_.each(msgList, function(item){
					wx.dealOneMessage(item);
				});
			},

			dealOneMessage : function(msg){

				//如果type＝51 表示需要更新列表，目前只处理群的部分
				if(msg.MsgType === 51){
					var tl = msg.StatusNotifyUserName.split(',');

					var pl = _.map(tl, function(item){
						if(/^@@/.test(item)){
							//说明是个群
							if(!groupList[item]){
								//说明还没有获取相信信息
								return {
									UserName : item,
									ChatRoomId : ''
								};
							}
						}
					});
					console.log('new group list --> ', pl);
					//重新获取信息
					F.getAllGroupList(pl);


					return;
				}

				wx.role.processMessage(msg, wx);

			},

			sendImageMessage : function(opts, callback){
				var url = '/mmwebwx-bin/webwxsendmsgimg?fun=async&f=json&pass_ticket='+wx.config.pass_ticket;
				var localId = _.random(100000000000, 999999999999);

				wx.uploadImageToWeixin(opts.imageUrl||'', Meteor.bindEnvironment(function(err, json){
					if(err){
						console.log(err);
						return false;
					}
					if(json.MediaId){
						//send image
						var data = {
							BaseRequest : F.getBaseRequest(),
							Msg : {
								ClientMsgId : localId,
								MediaId: json.MediaId,
								FromUserName: opts.FromUserName,
								LocalID: localId,
								ToUserName: opts.ToUserName,
								Type: 3
							},
							Scene : 0
						};
						console.log(data);

						request(F.setOption({
							url : wx.config.host+url,
							method : 'POST',
							headers : F.getRequestHeader(),
							json : true,
							data : data
						}), function(err, res, body){
							//console.log(body);
							callback(err, body);

						});
					}
				}));


			},

			sendMessage : function(opts, callback){

				var url = '/mmwebwx-bin/webwxsendmsg?lang=zh_CN&pass_ticket='+wx.config.pass_ticket;


				var localId = _.random(100000000000, 999999999999);


				var data = {
					BaseRequest : F.getBaseRequest(),
					Msg : {
						ClientMsgId : localId,
						Content: opts.Content,
						FromUserName: opts.FromUserName,
						LocalID: localId,
						ToUserName: opts.ToUserName,
						Type: opts.type
					}
				};

				request(F.setOption({
					url : wx.config.host+url,
					method : 'POST',
					headers : F.getRequestHeader(),
					json : true,
					data : data
				}), function(err, res, body){
					//console.log(body);
					callback(err, body);

				});
			},

			//上传图片到微信，返回 mediaID
			uploadImageToWeixin : function(imgPath, callback){
				imgPath = imgPath || 'http://www.haiwai.com/pc/image/newlogo2x.png';
				let u = 'https://file.wx.qq.com',
					p = '/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json';
				var url = u+p;

				var file = new KG.FS.File();

				npmRequest({
					url : imgPath,
					method : 'Get',
					encoding : null
				}, function(e, res, buffer){

					if(!e){
						file.attachData(buffer, {type: 'image/png'}, (function(error){
							if(error) throw error;
							let size = file.size(),
								stype = file.type();

							let uploadMediaRequest = JSON.stringify({
								//UploadType : 2,
								ClientMediaId: _.random(100000000000, 999999999999),
								TotalLen: size,
								StartPos: 0,
								DataLen: size,
								MediaType: 4,
								BaseRequest : F.getBaseRequest()
							});



							//注意这里的图片提交方式用的是request.post
							let R = npmR.post(({
								url : url,
								headers : {
									"Accept": "*/*",
									"Accept-Encoding": "gzip, deflate",
									//'Content-Type':'multipart/form-data; boundary='+form.getBoundary(),
									'Host':'file.wx.qq.com',
									'Origin':'https://wx.qq.com',
									'Referer':'https://wx.qq.com/'
								},
								json : true
							}), function(err, res, body){
								//console.log(err, res, body);
								console.log(body.MediaId);
								callback(err, body);

							});
							let form = R.form();
							form.append('id', 'WU_FILE_0');
							form.append('name', 'filename');
							form.append('type', stype);
							form.append('lastModifieDate', new Date().toGMTString());
							form.append('size', size);
							form.append('mediatype', 'pic');
							form.append('uploadmediarequest', uploadMediaRequest);
							form.append('webwx_data_ticket', wx.config.cookieObj['webwx_data_ticket']);
							form.append('pass_ticket', (wx.config.pass_ticket));
							form.append('filename', new Buffer(buffer), {
								filename: 'filename',
								contentType: stype,
								knownLength: size
							});


						}));
					}
				});





			},




			getMessageImage : function(id, callback, big){
				big = big || false;

				var url = '/mmwebwx-bin/webwxgetmsgimg?&MsgID='+id+'&skey='+(wx.config.skey);
				url = wx.config.host + url;

				if(true || !big){
					url += '&type=big';
				}
console.log(url);
				//注意这里使用npmRequest是因为Meteor.http没有提供encoding参数的实现
				npmRequest(F.setOption({
					url : url,
					method : 'Get',
					encoding : null,
					headers : {
						'Cookie' : wx.config.cookie,
						'Upgrade-Insecure-Requests' : 1,
						'Accept-Encoding' : 'gzip, deflate, sdch, br',
						'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
					}
				}), function(err, res, body){
					err && console.log(err);
					body && callback(body);
				});
			},


			//根据user的id返回头像的路径名称
			getHeadImagePathNameById : function(id){
				var list = wx.getFriendList(),
					x = list[id];
				if(!x) return id;

				return x.NickName;
			},

			getHeadImage : function(id, callback){
				var url = wx.config.host+'/mmwebwx-bin/webwxgeticon?username='+id+'&skey='+wx.config.skey;

				npmRequest(F.setOption({
					url : url,
					method : 'Get',
					encoding : null,
					headers : {
						'Cookie' : wx.config.cookie,
						'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
					}
				}), function(err, res, body){
					body && callback(body);

				});
			},


			getMessageVoice : function(id, callback){
				var url = wx.config.host+'/mmwebwx-bin/webwxgetvoice?msgid='+id+'&skey='+wx.config.skey;

				console.log(url);

				npmRequest(F.setOption({
					url : url,
					method : 'Get',
					encoding : null,
					headers : {
						'Cookie' : wx.config.cookie,
						'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
					}
				}), function(err, res, body){
					console.log(body);
					body && callback(body);
				});
			},

			getMessageVideo : function(id, callback){
				if(!wx.config.skey) return;
				var url = wx.config.host + '/mmwebwx-bin/webwxgetvideo?msgid='+id+'&skey='+wx.config.skey;

				//console.log(url);
				//TODO 有问题，原因未知 需要和微信对照

				npmRequest(F.setOption({
					url : url,
					method : 'Get',
					encoding : null,
					headers : {
						'Cookie' : wx.config.cookie,
						'Range' : 'bytes=0-'
					}
				}), function(err, res, body){
					//console.log(res.statusCode, res.headers, body);

					body && body.length>100 && callback(body);
				});
			},





			saveHeadImage : function(qun, user){
				//get qun id
				let qunObj = KG.Qun.getDB().findOne({
					name : qun.NickName,
					rebot : curentUser.NickName
				});
				if(!qunObj) return false;

				let fileName = qunObj._id+'/'+user.NickName;

				KG.FS.Image.checkHeadImage(fileName, function(b){
					if(!b){
						wx.getHeadImage(user.UserName, function(buffer){
							KG.FS.Image.saveHeadImage(fileName, buffer, function(err, obj){

							});
						});
					}
				});
			},










			stop : function(){
				F.reset();
			}

		};









		WECHAT = wx;

	})(requestSelf);
}

export default WECHAT;