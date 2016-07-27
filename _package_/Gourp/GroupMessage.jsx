import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';

let Base = KG.getClass('Base');
KG.define(config.GroupMessage, class extends Base{
	defineDBSchema(){
		return false;
	}
});