import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';

let Base = KG.getClass('Base');
KG.define(config.Article, class extends Base{
	defineDBSchema(){

		return {
			title : KG.schema.default(),
			description : KG.schema.default({
				optional : true
			}),
			image : KG.schema.default({
				optional : true
			}),
			content : KG.schema.default(),

			createTime : KG.schema.createTime(),
			updateTime : KG.schema.updateTime()
		};
	}

});