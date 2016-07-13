import {KG, _} from 'meteor/kg:base';
import {KUI} from 'meteor/kg:kui';

App = {};
if(Meteor.isClient){

	UI = {};
	window.KUI = KUI;
	window.React = KUI.React;
	//window.ANTD = KUI.ANTD;
	window.ND = KUI.ANTD;
	//window.RB = ReactBootstrap;
	//KUI.RB = ReactBootstrap;
}


