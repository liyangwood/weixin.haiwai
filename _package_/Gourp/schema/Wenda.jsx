import {KG} from 'meteor/kg:base';

export default Wenda = {
	type : KG.schema.default({
		optional : true
	}),
	keyword : KG.schema.default(),
	content : KG.schema.default(),
	qunID : KG.schema.default(),

	createTime : KG.schema.createTime(),
	updateTime : KG.schema.updateTime()
};