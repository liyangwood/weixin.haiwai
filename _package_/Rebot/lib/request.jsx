import {HTTP} from 'meteor/http';

Meteor.http = HTTP;

let requestSelf = null;
if(Meteor.isServer){

	requestSelf = function(opts, callback){
		var fn = (function(err, rs){
			if(!rs){
				return false;
			}

			var body = rs.content;

			if(opts.json){
				try{
					body = JSON.parse(body);
				}catch(e){}

			}

			callback(err, rs, body);
		});

		if(!opts.method){
			opts.method = 'get';
		}

		if(opts.method.toLowerCase() === 'get'){
			Meteor.http.call('get', opts.url, opts, fn);

		}
		else if(opts.method.toLowerCase() === 'post'){
			Meteor.http.call('post', opts.url, opts, fn);
		}
		else{
			//TODO
		}
	};



}

export {
	requestSelf
};