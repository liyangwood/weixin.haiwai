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

export default KG;
//module.exports = KG;
