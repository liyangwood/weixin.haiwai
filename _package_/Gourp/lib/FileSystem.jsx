import {KG, FS} from 'meteor/kg:base';


var createThumb = function(fileObj, readStream, writeStream) {
	//gm(readStream, fileObj.name()).resize('256', '256').stream().pipe(writeStream);
	//console.log(arguments);
};

var getBase64Data = function(doc, callback) {
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
		callback(null, buffer.toString('base64'));
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

	FS.Chat.allow(allow);
	FS.MSG34.allow(allow);
	FS.HeadImage.allow(allow);

	if(Meteor.isServer){
		//Meteor.publish("images", function(){
		//	return FS.Chat.find();
		//});
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



	console.log('FS Route init success');
};

Image.getBase64Data = getBase64Data;
FS.Image = Image;
export default FS;