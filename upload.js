var AWS = require('aws-sdk');
var fs = require('fs');
var config = require('./config');

//access key = AKIAICY2UUB2GL35MMLA
//secret_access_key = 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
//heroku config:set AWS_ACCESS_KEY=AKIAICY2UUB2GL35MMLA AWS_SECRET_KEY=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
//heroku config:set S3_BUCKET = math_server

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || config.s3.key;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || config.s3.secret;
var S3_BUCKET = process.env.S3_BUCKET || config.s3.bucket;

AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});

var s3obj = new AWS.S3({
	params: { Bucket: S3_BUCKET }
});



module.exports.uploadFile = function(fileName,key) {

		console.log('uploading!');

		var body = fs.createReadStream(fileName);

		s3obj.upload({
			Body: body,
			Key: key,
			ContentType: 'video/webm'
		})
		.on('httpUploadProgress', function(evt) { console.log(evt); })
		.send(function(err, data) {
			console.log("Uploaded!");
			console.log(err, data);
		});

};

module.exports.upload = function(key,body,callback) {

	s3obj.upload(
		{
			Body: body,
			Key: key,
			ContentType: "image/svg+xml"
		})
		.on('httpUploadProgress', function(evt) { console.log(evt); }).
	  send(function(err, data) { console.log(err, data) });
};

module.exports.check = function (key,callback){
	s3obj.headObject({Key:key}, function (err, metadata) {
	  if (err && err.code === 'NotFound') {
			callback(false)
	    // Handle no object on cloud here
	  } else {
			callback(true);
	  }
	});
	return;
};

module.exports.get = function(key,callback) {
	s3obj.getObject({Key:key}, function(err, data) {
		var bodyString = data.Body.toString();
		callback(bodyString);
	});
};
