import {KG, moment} from 'meteor/kg:base';

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
		//timer:定时发布，common:立即发布, loop:每天循环
		allowedValues : ['timer', 'common', 'loop'],
		defaultValue : 'common',
		optional : true
	}),

	//如果是定时发布，这里记录定时发布的时间
	time : {
		type : Date,
		optional : true
	},

	loopDayStamp : {
		type : Number,
		optional : true,
		autoValue: function(doc){

			if(this.field('publishType').value === 'loop'){
				if(this.isInsert || this.isUpdate || this.isUpsert){
					return KG.util.getDayStampByDate(this.field('time').value);
				}
			}

		}
	},


	//指定状态，如果是立即发布的，标示是否发布过
	flag : KG.schema.default({
		type : Boolean,
		defaultValue : false,
		optional : true
	}),


	//指定发布插件
	plugin : KG.schema.default({
		optional : true
	}),

	status : KG.schema.default({
		optional : true,
		defaultValue : 'active'
	}),

	isRemoved : {
		type : Boolean,
		optional : true,
		defaultValue : false
	}
};