import {KG} from 'meteor/kg:base';

export default Content = {
	createTime : KG.schema.createTime(),
	updateTime : KG.schema.updateTime(),
	type : KG.schema.default({
		allowedValues : ['text', 'image', 'link', 'media']
	}),
	content : KG.schema.default({
		optional : true
	}),

	assignGroup : KG.schema.default({
		type : [String],
		optional : true,
		defaultValue : []
	}),
	publishType : KG.schema.default({
		//timer:定时发布，common:普通发布
		allowedValues : ['timer', 'common'],
		defaultValue : 'common',
		optional : true
	}),

	//如果是定时发布，这里记录定时发布的时间
	time : {
		type : Date,
		optional : true
	},




	//可能的媒体文件
	attachFile : {
		optional : true,
		type : String
	}
};