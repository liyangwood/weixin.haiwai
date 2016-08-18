
import config from './lib/config.jsx';
import {KG, _} from 'meteor/kg:base';

let PLUGIN_LIST = {
	wxc_news : {
		name : '文学城新闻',
		getValue(success, error){
			let api = 'http://api.wenxuecity.com/service/api/?act=index&channel=news&pagesize=5&version=2&format=json';

			KG.util.request({
				url : api,
				json : true
			}, function(err, res, body){
				if(err){
					error && error('api request error', err);
				}
				else{
					var data = body.list;

					if(data.length > 5){
						data = data.slice(0, 5);
					}

					var rs = '';
					_.each(data, (item)=>{
						//var d = item.dateline.substring(0, 10).replace(/\-/g, '/');
						var url = 'http://m.wenxuecity.com/#/news/detail/news/'+item.postid;

						rs += item.title+'\n'+url+'\n';
					});

					success(rs);
				}
			});
		}
	},

	wxc_bbs : {
		name : '文学城论坛',
		getValue(success, error){
			let api = 'http://api.wenxuecity.com/service/api/?func=bbs&act=index&version=2&format=json';

			KG.util.request({
				url : api,
				json : true
			}, function(err, res, body){
				if(err){
					error && error('api request error', err);
				}
				else{
					var data = body.daylist;

					if(data.length > 5){
						data = data.slice(0, 5);
					}

					var rs = '';
					_.each(data, (item)=>{
						var url = 'http://m.wenxuecity.com/bbs.html#/bbs/detail/'+item.subid+'/'+item.postid;

						rs += item.title+'\n'+url+'\n';
					});

					success(rs);
				}
			});
		}
	},

	wxc_bbs_cooking : {
		name : '文学城私房小菜论坛',
		getValue(success, error){
			let api = 'http://api.wenxuecity.com/service/api/?act=list&format=json&func=bbs&subid=cooking&type=sticky&version=2';

			KG.util.request({
				url : api,
				json : true
			}, function(err, res, body){
				if(err){
					error && error('api request error', err);
				}
				else{
					var data = body.data;

					if(data.length > 5){
						data = data.slice(0, 5);
					}

					var rs = '';
					_.each(data, (item)=>{
						var url = 'http://m.wenxuecity.com/bbs.html#/bbs/detail/'+item.subid+'/'+item.postid;

						rs += item.title+'\n'+url+'\n';
					});

					success(rs);
				}
			});
		}
	}
};

let Base = KG.getClass('Base');
KG.define(config.Plugin, class extends Base{
	_initDB(){
		//override base _initDB
		return null;
	}
	addTestData(){
		//this.getPluginValue('wxc_news', function(flag, data){
		//	if(flag){
		//		console.log(data);
		//	}
		//});
	}

	getPluginNameList(){
		let rs = [];

		_.each(PLUGIN_LIST, (v, k)=>{
			rs.push({
				value : v.name,
				key : k
			});
		});

		return rs;
	}

	getPluginValue(key, callback){
		if(!PLUGIN_LIST[key]){
			callback(false, key+' is not valid');
			return false;
		}

		var v = PLUGIN_LIST[key].getValue(function(h){
			callback(true, h);
		}, function(e, e1){
			callback(false, e, e1);
		});
	}
});