import {KG, _, moment} from 'meteor/kg:base';
import {KUI} from 'meteor/kg:kui';
import {WECHAT, Message} from 'meteor/kg:rebot';
import 'meteor/kg:group';
import { HTTP } from 'meteor/http';

App = {};
this.KG = KG;
this._ = _;
this.moment = moment;
this.WECHAT = WECHAT;
this.Message = Message;

Meteor.http = HTTP;
if(Meteor.isClient){

	window.KUI = KUI;
	window.React = KUI.React;
	window.ND = KUI.ANTD;
}


