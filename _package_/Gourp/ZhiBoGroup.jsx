import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';
import ZhiBoGroup from './schema/ZhiBoGroup.jsx';

let Base = KG.getClass('Base');
KG.define(config.ZhiBoGroup, class extends Base{
	defineDBSchema(){
		return ZhiBoGroup;
	}
});

