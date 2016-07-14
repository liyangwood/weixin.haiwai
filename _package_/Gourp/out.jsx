import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';
import './Qun.jsx';

KG.config = config;

Meteor.startup(()=>{
	KG.Qun = KG.create(config.Qun);
});