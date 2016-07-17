import {KG} from 'meteor/kg:base';

export default Wenda = {
	type : KG.schema.default({
		optional : true
	}),
	keyword : KG.schema.default(),
	reply : KG.schema.default(),
	qunID : KG.schema.default({
		optional : true
	}),

	createTime : KG.schema.createTime(),
	updateTime : KG.schema.updateTime()
};