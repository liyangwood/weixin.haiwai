import {KG, _} from 'meteor/kg:base';
import {KUI} from 'meteor/kg:kui';

var util = {};
_.extend(util, _);

let Dispatcher = KUI.Dispatcher;

_.extend(util, {
	goPath : function(url){
		FlowRouter.go(url);
	},


	renderLoading : function(opts){
		opts = _.extend({
			isReady : false
		}, opts||{});


		return <div className="sk-spinner sk-spinner-three-bounce">
			<div className="sk-bounce1"></div>
			<div className="sk-bounce2"></div>
			<div className="sk-bounce3"></div>
		</div>;
	},
	getReactDomNode : function(reactObj){
		return ReactDOM.findDOMNode(reactObj);
	},
	getReactJQueryObject : function(reactObj){
		return $(util.getReactDomNode(reactObj));
	},

	addDollerSign : function(num){
		var tmp = num;
		if(tmp < 0){
			return '-$'+Math.abs(tmp);
		}
		else{
			return '$'+tmp;
		}
	},

	renderNoViewPermission : function(){
		return <h3>{util.const.NoViewPermission}</h3>
	},

	getModuleName : function(x){
		return 'EF-'+x;
	}
});

util.swal = swal;

util.data = {
	subscribe : function(obj, opts){
		let name;
		if(_.isString(obj)){
			name = obj;
		}
		else{
			name = obj._name;
		}

		let x = Meteor.subscribe(name, opts||{});
		x._name = name;
		return x;
	},

	getMaxCount : function(subobj){
		let name = subobj._name;
		if(!name){
			throw Meteor.Error('param error', '[util.data.getMaxCount] argument error');
		}

		return Counts.get(name+'-count');
	}
};

util.const = {
	//TODO input to module
	'StudentStatus' : ['Active', 'Inactive'],
	'Gender' : ['Male', 'Female'],

	dateFormat : 'MM/DD/YYYY',

	PageSize : 10,

	NoViewPermission : 'Sorry, You have no permission to view this page. please contact school administrator.',
	NoOperatorPermission : 'Sorry, You have no permission to operator.'
};

util.dialog = {
	confirm : function(opts){
		if(confirm(opts.msg)){
			opts.YesFn();
		}
	},
	alert : function(msg){
		alert(msg);
	},

	render : function(id, opts){
		id = id || 'modal';
		let self = this;
		opts = _.extend({
			onHide : function(){
				self.refs[id].hide();
			},
			title : '',
			YesFn : function(){},
			YesText : '',
			renderBody : function(){return null;}
		}, opts||{});

		return (
			<KUI.Modal onHide={opts.onHide.bind(this)}
			           title={opts.title}
			           YesText={opts.YesText}
			           onYes={opts.YesFn.bind(this)}
			           ref={id}>


				{opts.renderBody.call(this)}
			</KUI.Modal>
		);
	}
};



let MSGALL = {};
util.message = {
	init : false,
	register : function(name, fn){
		let all = MSGALL;
		all[name] = fn;

		if(this.init){
			return;
		}

		Dispatcher.register(function(param){
			if(all[param.actionType]){
				all[param.actionType].call(null, param);
			}
		});
		this.init = true;
	},
	publish : function(name, param){
		let data = {
			actionType : name
		};
		param = param || {};
		param = _.isObject(param) ? param : {data:param};
		_.extend(data, param);

		Dispatcher.dispatch(data);
	}
};

util.toast = {
	showError(msg){
		util.message.publish('KG:show-error-message', {
			error : msg
		});
	},
	alert(msg){
		util.message.publish('KG:show-toast-message', {
			toast : msg || ''
		});
	}
};

util.user = {

};

util.render = {
	stop : function(obj){
		if(obj.componentDidMount){
			obj.componentDidMount = _.noop;
		}
		if(obj.runOnceAfterDataReady){
			obj.runOnceAfterDataReady = _.noop;
		}
	}
};


util.style = {
	MAIN_WIDTH : '1180px'
};


window.util = util;
window._ = _;