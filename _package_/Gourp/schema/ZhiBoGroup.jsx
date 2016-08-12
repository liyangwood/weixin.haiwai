import {KG} from 'meteor/kg:base';
export const ZhiBoGroup = {
	qunID : KG.schema.default(),
	startTime : {
		type : Date
	},
	endTime : {
		type : Date
	},
	description : KG.schema.default({
		optional : true
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

	createTime : KG.schema.createTime(),
	updateTime : KG.schema.updateTime()
};