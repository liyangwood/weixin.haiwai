import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';
import Event from './schema/Event.jsx';

let Base = KG.getClass('Base');
KG.define(config.Event, class extends Base{
	defineDBSchema(){
		return Event;
	}
});
