import {KG, _, moment} from 'meteor/kg:base';
import {KUI} from 'meteor/kg:kui';
import 'meteor/kg:group';

App = {};
this.KG = KG;
this._ = _;
this.moment = moment;
if(Meteor.isClient){

	UI = {};
	window.KUI = KUI;
	window.React = KUI.React;
	window.ND = KUI.ANTD;
}


