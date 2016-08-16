import _ from 'underscore';
import moment from 'moment';

let All = {},
	AllClass = {};
let KG = {
	define : function(name, cls){
		if(All[name]){
			throw new Error(name + 'is exist');
		}


		AllClass[name] = cls;

		return cls;
	},

	create : function(name, opts){
		var cls = KG.getClass(name);

		All[name] = new cls(name, opts);
		console.log('['+name+'] class is create success');

		return All[name];
	},

	getAll : function(){
		return All;
	},

	get : function(name){
		return All[name] || null;
	},

	getClass : function(name){
		let rs = AllClass[name];
		if(!rs){
			throw new Error(name + 'class is not exist');
		}
		return AllClass[name];
	}
};

KG.const = {
	dateFormat : 'MM/DD/YYYY',
	timeFormat : 'HH:mm:ss',
	dateAllFormat : 'MM/DD/YYYY HH:mm:ss'
};

KG.schema = {
	default : function(opts){
		return _.extend({
			type : String,
			optional : false
		}, opts||{});
	},
	createTime : function(opts){
		return _.extend({
			type: Date,
			optional : true,
			autoValue: function(){
				if (this.isInsert){
					return new Date();
				}
			}
		}, opts||{});
	},
	updateTime : function(opts){
		return _.extend({
			type: Date,
			optional : true,
			autoValue: function(){
				if (this.isInsert){
					return new Date();
				}
				if (this.isUpdate){
					return new Date();
				}
			}
		}, opts||{});
	}
};

let Base = class{
	constructor(name, option){
		this._name = name;
		this._db = null;
		this._schema = null;

		this.option = _.extend({
			DBName : ''
		}, option||{});

		this.initVar();
		this._extendMethod();


		this.initStart();

		this._initDB();



		this._initEnd();

	}

	_extendMethod(){
		var self = this;
		var sm = this.defineServerMethod(),
			cm = this.defineClientMethod();

		if(Meteor.isServer){
			_.each(sm, function(method, key){
				self[key] = method;
			});
		}

		if(Meteor.isClient){
			_.each(cm, function(method, key){
				self[key] = method;
			});
		}


		if(Meteor.isServer){
			let mm = _.extend({}, this._defineMeteorMethod(), this.defineMeteorMethod());
			let mms = {};
			_.each(mm, (item, key)=>{
				mms[this._name+':'+key] = item.bind(this);
			});
			Meteor.methods(mms);
		}
	}

	_defineMeteorMethod(){
		return {
			removeById(id){
				try{
					this._db.remove({_id : id});

					return true;
				}
				catch(e){
					return e;
				}

			}
		};
	}

	/*
	 * define server side method
	 * @return: function map
	 * */
	defineServerMethod(){
		return {};
	}

	/*
	 * define client side method
	 * @return: function map
	 * */
	defineClientMethod(){
		return {};
	}

	defineMeteorMethod(){
		return {};
	}

	callMeteorMethod(methodName, args, opts){
		let self = this;
		opts = _.extend({
			error : function(err){
				console.error(err);
			},
			success : function(rs){
				console.log(rs);
			},
			context : self
		}, opts||{});
		console.log('['+this._name+':'+methodName+' call]');

		if(Meteor.isServer){
			//let tmpRs = Meteor.apply(this._name+':'+methodName, args);
			//console.log(tmpRs);
			return Meteor.apply(this._name+':'+methodName, args);
		}
		else{
			Meteor.apply(this._name+':'+methodName, args, function(error, rs){
				if(error){
					opts.error.call(opts.context, error);
					return;
				}

				opts.success.call(opts.context, rs);
			});
		}


	}
	//callMeteorMethodAsync(methodName, args){
	//    let fn = (param, callback)=>{
	//        Meteor.apply(this._name+'__'+methodName, param, callback);
	//    };
	//
	//    fn = Meteor.wrapAsync(fn);
	//
	//    let tmp = fn(args);
	//    console.log(tmp);
	//    return tmp;
	//}

	/*
	 * return dependent module
	 *
	 * */
	defineDepModule(){
		return {};
	}

	_initDB(){

		this.initDBSchema();
		this.initDB();
		this.initDBPermission();
		this.initDBEnd();
	}

	initDBSchema(){
		this._schema = this.defineDBSchema();
	}

	defineDBPermission(){
		return {
			insert : function(){
				return true;
			},
			update : function(){
				return true;
			},
			remove : function(){
				return true;
			}
		};
	}

	initDBPermission(){
		var perm = this.defineDBPermission();
		this._db.allow(perm);
	}

	/*
	 * define DB schema if DB exist
	 * @return: DB schema
	 *
	 * */
	defineDBSchema(){
		return {};
	}

	getDBSchema(){
		return this._db ? this._db.simpleSchema() : null;
	}

	defineSchemaValidateMessage(){
		return {};
	}

	/*
	 * define db object
	 * if you do not have a DB, you can override and return null or any object you want.
	 *
	 * */
	defineDB(){
		let db = new Mongo.Collection(this.option.DBName || this._name);
		if(this._schema){
			let schema = new SimpleSchema(this._schema);
			schema.messages(this.defineSchemaValidateMessage());
			db.attachSchema(schema);
		}

		return db;

	}

	initDB(){
		this._db = this.defineDB();
	}

	getDB(){
		return this._db;
	}

	getDBName(){
		return this._db._name;
	}

	initDBEnd(){}

	initVar(){
		this.module = this.defineDepModule();

	}


	initStart(){}

	_initEnd(){
		let self = this;

		this.initEnd();

		if(Meteor.isServer){

			Meteor.startup(function(){
				self._defineCronJob.call(self);
				self.addTestData.call(self);

				self._publishMeteorData.call(self);

			});
		}

	}
	defineCronJob(){
		return [];
	}

	_defineCronJob(){

		let list = this.defineCronJob();
		_.each(list, function(item){
			KG.SyncedCron.add(item);
		});
	}

	_publishMeteorData(){
		let self = this;
		Meteor.publish(this._name, function(opts){
			opts = _.extend({
				query : {},
				sort : {},
				pageSize : 999,
				pageNum : 1,
				field : null
			}, opts||{});
			_.mapObject(opts.query || {}, (item, key)=>{
				if(_.isObject(item)){
					if(item.type === 'RegExp'){
						opts.query[key] = new RegExp(item.value, 'i');
					}
				}
			});

			let skip = opts.pageSize * (opts.pageNum-1);
			let option = {
				sort : opts.sort,
				skip : skip,
				limit : opts.pageSize
			};
			if(opts.field){
				option.fields = opts.field;
			};

			//Counts.publish(this, self._name+'-count', self._db.find(opts.query), {
			//	nonReactive : true,
			//	noReady : true
			//});

			return self._db.find(opts.query, option);
		});

		this.publishMeteorData();

	}
	publishMeteorData(){}
	initEnd(){}
	addTestData(){}

	/*
	 * use schema validate the doc
	 * @return true/error
	 *   if pass, return true
	 *   if not, return a error include reason
	 * */
	validateWithSchema(doc){
		try{
			this.getDBSchema().validate(doc);
		}catch(e){
			return e;
		}

		return true;
	}

	//db method
	insert(data){
		try{
			let rs = this._db.insert(data, function(err){
				if(err) throw err;
			});
			return KG.result.out(true, rs);
		}catch(e){
			return KG.result.out(false, e, e.reason||e.toString());
		}
	}


};


KG.define('Base', Base);

KG.util = {
	setDBOption : function(opts){
		opts = _.extend({
			sort : {},
			pageSize : 10,
			pageNum : 1,
			field : null
		}, opts||{});

		let skip = opts.pageSize * (opts.pageNum-1);
		let option = {
			sort : opts.sort,
			skip : skip,
			limit : opts.pageSize
		};
		if(opts.field){
			option.fields = opts.field;
		};

		return option;
	},
	setDBQuery : function(query){
		_.mapObject(query || {}, (item, key)=>{
			if(_.isObject(item)){
				if(item.type === 'RegExp'){
					query[key] = new RegExp(item.value, 'i');
				}
			}
		});

		return query;
	},

	/*
	 * @param str -> 05/29/2016
	 * @param zone -> 8 [must be hours]
	 * @return (moment)"2016-05-29T00:00:00+08:00"
	 * */
	getZoneDateByString : function(str, zone){
		var d = moment.utc(str, KG.const.dateFormat).utcOffset(zone);
		if(zone > 0){
			d = d.subtract(zone, 'hours');
		}
		else{
			d = d.add(Math.abs(zone), 'hours');
		}

		return d;
	},

	//计算一个时间是当天的第多少秒
	getDayStampByDate : function(date){
		date = date || new Date();
		if(!moment.isMoment(date)){
			date = moment(date);
		}

		let ts = date.format('hh:mm:ss').split(':');
		return parseInt(ts[2], 10) + parseInt(ts[1], 10)*60 + parseInt(ts[0], 10)*60*60;

	}
};

KG.util.email = {
	getDomain : function(address){
		let reg = /@([^\.]*)/;
		let rs = address.match(reg);

		return rs[1] || null;
	}
};


export default KG;
//module.exports = KG;
