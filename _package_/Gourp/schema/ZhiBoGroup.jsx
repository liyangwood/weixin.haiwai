import {KG} from 'meteor/kg:base';
export const ZhiBoGroup = {
	name : KG.schema.default({
		optional : true
	}),
	qunID : KG.schema.default(),
	startTime : {
		type : Date
	},
	endTime : {
		type : Date
	},
	description : KG.schema.default({
		optional : true,
		defaultValue : ''
	}),

	info : {
		type : Object,
		blackbox : true,
		optional : true,
		defaultValue : {}
	},

	password : KG.schema.default({
		optional : true,
		defaultValue : ''
	}),

	isRemoved : {
		type : Boolean,
		optional : true,
		defaultValue : false
	},

	createTime : KG.schema.createTime(),
	updateTime : KG.schema.updateTime()
};