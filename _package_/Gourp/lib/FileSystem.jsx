import {KG, FS, DataMan} from 'meteor/kg:base';
import http from 'meteor/http';

FS.DataMan = DataMan;

var createThumb = function(fileObj, readStream, writeStream) {
	//gm(readStream, fileObj.name()).resize('256', '256').stream().pipe(writeStream);
	//console.log(arguments);
};

var getBase64Data = function(doc, encoding, callback) {
	var buffer = new Buffer(0);
	// callback has the form function (err, res) {}
	var readStream = doc.createReadStream('images');

	readStream.on('data', function(chunk) {
		buffer = Buffer.concat([buffer, chunk]);
	});
	readStream.on('error', function(err) {
		callback(err, null);
	});
	readStream.on('end', function() {
		//console.log(123);
		// done
		callback(null, buffer.toString(encoding||'base64'));
	});
};
var getBase64DataSync = Meteor.wrapAsync(getBase64Data);


let allow = {
	insert: function(){
		return true;
	},
	update : function(){
		return true;
	},
	remove : function(){
		return true;
	},
	download : function(){
		return true;
	}
};

FS._init = function(){



	FS.Chat = new FS.Collection('HW-ImageFile-Chat', {
		stores: [
			new FS.Store.GridFS("images", {})
		]
	});
	FS.MSG34 = new FS.Collection('HW-File-MSG34', {
		stores : [
			new FS.Store.GridFS('HW-File-MSG34')
		]
	});
	FS.HeadImage = new FS.Collection('HW-File-HeadImage', {
		stores : [
			new FS.Store.GridFS('HW-File-HeadImage')
		]
	});

	FS.Upload = new FS.Collection('HW-Upload-File', {
		stores: [
			new FS.Store.GridFS("HW-Upload-File")
		]
	});

	FS.Chat.allow(allow);
	FS.MSG34.allow(allow);
	FS.HeadImage.allow(allow);
	FS.Upload.allow(allow);

	if(Meteor.isServer){

	}




	console.log('FS init success');
};

let Image = {};


Image.saveChatImage = function(name, buffer, callback){

	var newFile = new FS.File();
	newFile.attachData(buffer, {type: 'image/png'}, (function(error){
		if(error) throw error;
		if(name.indexOf('.png')>0){
			newFile.name(name);
		}
		else{
			newFile.name(name+'.png');
		}


		FS.Chat.insert(newFile, function(err, file){
			callback(err, file);
		});

	}));
};
Image.saveChatVoice = function(name, buffer, callback){
	var newFile = new FS.File();
	newFile.attachData(buffer, {type: 'audio/mp3'}, (function(error){
		if(error) throw error;
		newFile.name(name);

		FS.MSG34.insert(newFile, function(err, file){
			callback(err, file);
		});

	}));
};

Image.checkHeadImage = function(name, callback){
	let one = FS.HeadImage.findOne({
		'original.name' : name
	});

	callback(!!one);
};

Image.saveHeadImage = function(name, buffer, callback){

	var newFile = new FS.File();
	newFile.attachData(buffer, {type: 'image/png'}, (function(error){
		if(error) throw error;
		newFile.name(name);

		FS.HeadImage.insert(newFile, function(err, file){
			callback(err, file);
		});
	}));
};





Image.initRoute = function(){
	KG.Picker.route('/res/chat/image', function(p, req, res, next){

		let id = p.query.id;


		let one = FS.Chat.findOne({
			'original.name' : id+'.png'
		});

		if(one){

			let file = one.getFileRecord();
			//console.log(file.url());

			let stream = file.createReadStream('images');
			res.writeHead(200, {
				'Content-Type': 'image/jpeg',
				'Content-Length': file.size()
			});
			stream.pipe(res);

		}


	});

	//head image
	KG.Picker.route('/res/head/image/:qunID/:name', function(p, req, res, next){

		let qunID = p.qunID,
			name = p.name;
		let fileName = qunID+'/'+name;

		let one = FS.HeadImage.findOne({
			'original.name' : fileName
		});

		if(one){

			let file = one.getFileRecord();
			//console.log(file.url());

			let stream = file.createReadStream('HW-File-HeadImage');
			res.writeHead(200, {
				'Content-Type': 'image/png',
				'Content-Length': file.size()
			});
			stream.pipe(res);

		}



	});

	//chat voice
	KG.Picker.route('/res/chat/voice', function(p, req, res, next){

		let id = p.query.id;

		let one = FS.MSG34.findOne({
			'original.name' : id
		});

		if(one){

			let file = one.getFileRecord();
			console.log(file.url())
			let stream = file.createReadStream('HW-File-MSG34');
			res.writeHead(200, {
				'Content-Type': 'audio/mp3',
				'Content-Length': file.size()
			});
			stream.pipe(res);

		}

	});

	KG.Picker.route('/res/upload', function(p, req, res, next){

		//var f = new FS.File();
		//
		//f.attachData(req, {type: 'image/jpeg'});
		//console.log(f.name(), f.type(), f.size());
		//let nn = Meteor.uuid()+'.jpeg';
		//f.name(nn);
		//f = FS.Upload.insert(f);
		//res.end(JSON.stringify({url:'/res/upload/'+f.name()}));



		var buffer = [];

		res.on('data', Meteor.bindEnvironment(function(chunk){
			console.log(chunk.length)
			buffer.push(chunk);
		}));

		res.on('end', Meteor.bindEnvironment(function(){
			//save to db
			buffer = Buffer.concat(buffer);

			console.log(buffer);
			var f = new FS.File();

			f.attachData(buffer, {type: 'image/jpeg'});
			console.log(f.name(), f.type(), f.size());
			let nn = Meteor.uuid()+'.jpeg';
			f.name(nn);
			f = FS.Upload.insert(f);
			res.end(JSON.stringify({url:'/res/upload/'+f.name()}));

		}));

	});

	KG.Picker.route('/res/upload/:name', function(p, req, res, next){
		let name = p.name;

		let one = FS.Upload.findOne({
			'original.name' : name
		});


		if(one){
			let file = one.getFileRecord();
			let stream = file.createReadStream('HW-Upload-File');

			res.writeHead(200, {
				'Content-Type': file.type(),
				'Content-Length': file.size()
			});
			console.log(file);
			stream.pipe(res);
			//res.write(x);
			//res.end()

		}
	});


};

Image.getBase64Data = getBase64Data;
FS.Image = Image;
KG.FS = FS;
export default FS;