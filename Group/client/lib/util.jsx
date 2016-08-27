import {KG, _} from 'meteor/kg:base';
import {KUI} from 'meteor/kg:kui';

var util = {};
_.extend(util, _);

let Dispatcher = KUI.Dispatcher;

_.extend(util, {
	goPath : function(url){
		FlowRouter.go(url);
	},


	renderLoading : function(msg){
		msg = msg || 'Loading ...';

		return (
			<div className="flex-center loading">
				<ND.Icon style={{fontSize:'24px', color:'#2db7f5', marginRight:'12px'}} type="loading" />
				<ND.Spin tip={msg} />
			</div>
		);
	},


	getReactDomNode : function(reactObj){
		return KUI.ReactDOM.findDOMNode(reactObj);
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

util.alert = {
	ok : function(title, msg){
		swal(title, msg||'', 'success');
	},
	error : function(err, msg){
		swal(err.reason||(_.isString(err))?err:err.toString(), msg||'', 'error');
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
	MAIN_WIDTH : '1180px',
	ML_20 : {marginLeft : '20px'},
	ML_12 : {marginLeft : '12px'},
	ML_25 : {marginLeft : '25px'},
	RD : {textAlign : 'right'},
	TD : {textAlign : 'center'}
};

util.ND = {
	getInputValue : function(reactObj){
		return reactObj.refs.input.value;
	},
	setInputValue : function(reactObj, value){
		reactObj.refs.input.value = value || '';
	}
};

util.weixin = {
	addAudio : function(src, endCallback){
		var xx = $('#js_audio');
		if(xx.length < 1){
			$('body').append('<audio id="js_audio" autoplay></audio>');

			xx = $('#js_audio');
		}

		xx.unbind('ended').bind('ended', endCallback);
		xx.empty().append('<source src="'+src+'" type="audio/mp3" />');
		xx[0].play();
	},
	replaceMessageByType : function(item, opts){
		opts = opts || {};

		var html = _.unescape(item.Content);
		if(item.MsgType === 49){
			return <a target="_blank" href={_.unescape(item.Url)}>{item.FileName}</a>
		}
		else if(item.MsgType === 3){
			let imgStyle={
				width : opts.maxImageWidth || '120px',
				height : 'auto'
			};
			return <a target="_blank" href={`/res/chat/image?id=${item.MsgId}`}><img style={imgStyle} src={`/res/chat/image?id=${item.MsgId}`} /></a>
		}
		else if(item.MsgType === 34){
			let path = `/res/chat/voice?id=${item.MsgId}`;

			let click = (e)=>{
				var elem = $(e.target).closest('.js_voice');

				util.weixin.addAudio(path, function(){
					//elem.removeClass('kg-active');

					//TODO 连读
				});

				elem.addClass('kg-active');
			};
			let sy = {
				width : '100px',
				background : '#fffe91',
				height : '40px',
				cursor : 'pointer',
				borderRadius : '5px'
			};
			let sp = {
				marginLeft : '5px',
				fontSize : '14px'
			};
			let ig = {
				width : '24px',
				height : '24px'
			};

			return (
				<div onClick={click} className="js_voice flex-center" style={sy}>
					{/*<ND.Icon type="caret-circle-o-right"></ND.Icon> */}
					<img style={ig} src="http://www.qunzhibo.com/static/img/adg.png" />
					<span style={sp}>{Math.ceil(item.VoiceLength/1000)+'s"'}</span>
				</div>

			);
		}

		return html
	}
};

util.ajax = {
	ajax : function(opts, success, error){
		var url = 'http://www.haiwai.com/service/api/?format=json';

		var type = opts.method || 'get';
		delete opts.method;

		var dtd = $.Deferred();

		if(opts.url){
			url += '&'+opts.url;
			delete opts.url;
		}

		if(type === 'post'){
			url += '&func='+opts.func;
			url += '&act='+opts.act;
		}
		//console.log(url);

		var dataType = 'json';
		if(opts.jsonp){
			dataType = 'jsonp';
			delete opts.jsonp;
		}

		$.ajax({
			type : type,
			url : url,
			data : opts,
			dataType : type==='get'?'jsonp':dataType,
			success : function(json){

				if(success){
					success.call(null, json.status>0, json.return);
				}

				dtd.resolve(json.return);

			},
			error : function(err){
				if(error){
					error(err);
				}

				dtd.reject(err);

			}
		});


		return dtd;

	},
	uploadImage : function(opts, success, error){
		var data = {
			func : 'article',
			act : 'upload',
			method : 'post',
			type : 'image',
			'uploadfield[]' : opts.image
		};

		return this.ajax(data, success, error);
	}
};


window.util = util;
window._ = _;