import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';
import Content from './schema/Content.jsx';

let Base = KG.getClass('Base');
KG.define(config.Content, class extends Base{
	//defineDBSchema(){
	//	return Content;
	//}
	defineDBSchema(){
		return Content;
	}
});