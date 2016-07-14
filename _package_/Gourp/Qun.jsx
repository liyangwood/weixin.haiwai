import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';
import {Qun} from './schema/qun.jsx';

let Base = KG.getClass('Base');
KG.define(config.Qun, class extends Base{
	defineDBSchema(){
		return Qun;
	}
});
