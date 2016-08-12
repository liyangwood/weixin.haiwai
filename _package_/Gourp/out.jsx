import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';

import './Qun.jsx';
import './Wenda.jsx';
import './Content.jsx';
import './Event.jsx';

import './GroupMessage.jsx';
import './ZhiBoGroup.jsx';

KG.config = config;

Meteor.startup(()=>{
	KG.Qun = KG.create(config.Qun);
	KG.TmpQun = KG.create(config.TmpQun);
	KG.Wenda = KG.create(config.Wenda);
	KG.Content = KG.create(config.Content);
	KG.Event = KG.create(config.Event);

	KG.GroupMessage = KG.create(config.GroupMessage);
	KG.ZhiBoGroup = KG.create(config.ZhiBoGroup);
});