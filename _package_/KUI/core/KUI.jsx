
import {KG, _} from 'meteor/kg:base';
import React from 'react';
import ReactDOM from 'react-dom';
import ANTD from 'antd/dist/antd.min.js';

import RC from '../lib/css.jsx';
import {mount} from 'react-mounter'
//import {Dispatcher} from 'flux';
var Dispatcher = require('flux').Dispatcher;
import h from '../lib/h.jsx';

let KUI = {};


KUI.React = React;
KUI.ReactDOM = ReactDOM;
KUI.ANTD = ANTD;
KUI.RC = RC;
KUI.ReactMounter = mount;
KUI.Dispatcher = Dispatcher;
KUI.h = h;

KUI.Page = class extends RC.CSSMeteorData{
	constructor(p){
		super(p);

	}

	componentDidMount(){
		super.componentDidMount();

		if(!_.isUndefined(this.data.ready)){
			let loop = ()=>{
				if(!this.data.ready){
					_.delay(loop.bind(this), 100);
				}
				else{
					this.runOnceAfterDataReady();
				}
			};

			_.delay(loop.bind(this), 100);
		}

	}
	runOnceAfterDataReady(){

	}
};

export default KUI;