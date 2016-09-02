import {KG} from 'meteor/kg:base';
export const Qun = {
	name : KG.schema.default(),
	image : KG.schema.default({
		optional : true
	}),
	rebot : KG.schema.default({
		optional : true
	}),
	owner : KG.schema.default({
		optional : true
	}),

	info : {
		type : Object,
		blackbox : true,
		optional : true,
		defaultValue : {
			//number
			//secondOwner

		}
	},

	isRemoved : {
		type : Boolean,
		optional : true,
		defaultValue : false
	},

	createTime : KG.schema.createTime(),
	updateTime : KG.schema.updateTime()
};