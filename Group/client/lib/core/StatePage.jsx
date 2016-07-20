import {KG, _} from 'meteor/kg:base';
import {KUI} from 'meteor/kg:kui';
import './a.jsx';


UI.StatePage = class extends KUI.Page{
	getMeteorData(){
		return {ready : true};
	}
	defineState(){
		return {};
	}
	constructor(p){
		super(p);


		this.state = _.extend({
			status : null
		}, this.defineState());
	}

	render(){
		if(!this.state.status) return null;
		if('loading' === this.state.status){
			return util.renderLoading();
		}

		return this.renderPage();
	}
	renderPage(){
		return '';
	}

	runOnceAfterDataReady(){
		this.setState({
			status : 'loading'
		});

		this.getPageData(()=>{
			this.state.status = true;
		});
	}
	getPageData(callback){
		console.log(123);
		return null;
	}
};
