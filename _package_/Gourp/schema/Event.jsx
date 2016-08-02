import {KG} from 'meteor/kg:base';
export const Event = {

	/*
	* text
	* welcome - 新加入群
	* image
	*
	* */
	type : KG.schema.default(),

	content : KG.schema.default({
		optional : true
	}),

	reply : KG.schema.default({}),

	assignGroup : KG.schema.default({
		type : [String],
		defaultValue : [],
		optional : true
	}),

	status : KG.schema.default({
		optional : true,
		allowedValues : ['acitve', 'inactive'],
		defaultValue : ['active']
	}),

	startTime : {
		type : Date,
		optional : true
	},
	endTime : {
		type : Date,
		optional : true
	},



	createTime : KG.schema.createTime(),
	updateTime : KG.schema.updateTime()
};