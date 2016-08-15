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

FS._init = function(){



	FS.Chat = new FS.Collection('HW-ImageFile-Chat', {
		stores: [
			new FS.Store.GridFS("images", {

			})
		]
	});


	FS.Chat.allow({
		// The creator of a file owns it. UserId may be null.
		insert: function(){
			return true;
		},
		update : function(){
			return true;
		},
		download : function(){
			return true;
		}
	});

	if(Meteor.isServer){
		Meteor.publish("images", function(){
			return FS.Chat.find();
		});
	}


	console.log('FS init success');
};

let Image = {};

////聊天信息中的图片
//Image.Chat = new FS.Collection('image_chat', {
//	stores: [new FS.Store.FileSystem("image_chat", {
//		path : KG.config.pwd + '/temp/weixinlogimage',
//		fileKeyMaker : function(file){
//			return file.name();
//		}
//	})]
//});


//Image.Chat.allow({
//	'insert': function () {
//		// add custom authentication code here
//		return true;
//	}
//});
//
//
//Image.Head = new FS.Collection('image_head', {
//	stores: [new FS.Store.FileSystem("image_head", {
//		path : KG.config.pwd + '/temp/headimage',
//		fileKeyMaker : function(file){
//			return file.name();
//		}
//	})]
//});
//
//Image.Head.allow({
//	'insert': function () {
//		// add custom authentication code here
//		return true;
//	}
//});
//
//
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
//
//Image.saveHeadImage = function(name, buffer, callback){
//	var newFile = new FS.File();
//	newFile.attachData(buffer, {type: 'image/png'}, (function(error){
//		console.log(buffer);
//		if(error) throw error;
//		newFile.name(name+'.png');
//
//		Image.Head.insert(newFile, function(err, file){
//			callback(err, file);
//		});
//	}));
//};
//
//Image.saveChatVoice = function(name, buffer, callback){
//	var newFile = new FS.File();
//	newFile.attachData(buffer, {type: 'audio/mp3'}, (function(error){
//		if(error) throw error;
//		newFile.name(name+'.mp3');
//
//		Image.Chat.insert(newFile, function(err, file){
//			callback(err, file);
//		});
//	}));
//};
//
//Image.saveChatVideo = function(name, buffer, callback){
//	var newFile = new FS.File();
//	newFile.attachData(buffer, {type: 'video/mp4'}, (function(error){
//		if(error) throw error;
//		newFile.name(name+'.mp4');
//
//		Image.Chat.insert(newFile, function(err, file){
//			callback(err, file);
//		});
//	}));
//};


Image.initRoute = function(){
	KG.Picker.route('/res/image/chat', function(p, req, res, next){

		let id = p.query.id;


		let one = FS.Chat.findOne({
			'original.name' : id+'.png'
		});

		if(one){
			console.log(id+'.png');
			//console.log(one.getFileRecord().isImage());

			let file = one.getFileRecord();
			console.log(file.url())

			let stream = file.createReadStream('images');
			res.writeHead(200, {
				'Content-Type': 'image/jpeg',
				'Content-Length': file.size()
			});
			stream.pipe(res);

			//let data = getBase64DataSync(file);
			////console.log(data);
			////res.end(data);
			//res.writeHead(200, {'Content-Type': 'image/png' });
			//res.end(data);
//console.log(file);
//			getBase64Data(file, (err, buffer)=>{
//				console.log(err, buffer);
//				res.end(buffer);
//			})

			//res.end(data);
		}



		//one.attachData(buffer, {type: 'image/png'}, (function(error){
		//	res.end(one.url());
		//}));

		//var path = KG.config.pwd + '/temp/weixinlogimage/' + id + '.png';
		//
		//try {
		//	self.response.end(fs.readFileSync(path));
		//}
		//catch (e) {
		//
		//	wx.getMessageImage(id, function (buffer) {
		//
		//		Image.saveChatImage(id, buffer, function (err, file) {
		//			//console.log(file);
		//			Meteor.setTimeout(function () {
		//				self.response.end(fs.readFileSync(path));
		//			}, 1000);
		//		});
		//
		//	}, query.type === 'big');
		//}

	});

	console.log('FS Route init success');
};

Image.getBase64Data = getBase64Data;
FS.Image = Image;
export default FS;