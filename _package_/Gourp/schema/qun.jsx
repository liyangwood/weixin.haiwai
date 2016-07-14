import {KG} from 'meteor/kg:base';
export const Qun = {
	name : KG.schema.default(),
	image : KG.schema.default({
		optional : true
	}),
	rebot : KG.schema.default({
		optional : true
	}),
	createTime : KG.schema.createTime()
};