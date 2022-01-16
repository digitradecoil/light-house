global.entry = 'https://light-house.co.il';
global.globalServer = 'https://light-house.co.il/app/';
global.globalFileServer = 'https://light-house.co.il/src/img/';


// global.entry = 'http://localhost/light-house.loc';
// global.globalServer = 'http://localhost/light-house.loc/app/';
// global.globalFileServer = 'http://localhost/light-house.loc/src/img/';

global.globalSiteUrl = 'http://lighthouse.statos.org';
global.globalAdminMail = 'statosbiz@statos.co';
global.globalSiteName = 'lighthouse';
global.globalclientMail = 'Lhtattoohaifa@gmail.com';

global.nDate = () => { return new Date().toLocaleTimeString('he-Il', { hour: 'numeric', minute: 'numeric', second: 'numeric'}).split(':').join('') };

let ua = navigator.userAgent.toLowerCase();
global.android = ua.indexOf("android") > -1;

const jic = {
	compress: function(source_img_obj, quality, output_format) {
		var mime_type = "image/jpeg";
		if(typeof output_format !== "undefined" && output_format=="png"){
			mime_type = "image/png";
		}
		var cvs = document.createElement('canvas');
		cvs.width = source_img_obj.naturalWidth;
		cvs.height = source_img_obj.naturalHeight;
		var ctx = cvs.getContext("2d");
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, cvs.width, cvs.height);
		ctx.drawImage(source_img_obj, 0, 0);
		var newImageData = cvs.toDataURL(mime_type, quality/100);
		var result_image_obj = new Image();
		result_image_obj.src = newImageData;
		return result_image_obj;
	},
	upload: function(compressed_img_obj, upload_url, file_input_name, filename, successCallback, errorCallback, duringCallback, customHeaders){
		if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
			XMLHttpRequest.prototype.sendAsBinary = function(string) {
				var bytes = Array.prototype.map.call(string, function(c) {
					return c.charCodeAt(0) & 0xff;
				});
				this.send(new Uint8Array(bytes).buffer);
			};
		}
		var type = "image/jpeg";
		if(filename.substr(-4).toLowerCase()==".png"){
			type = "image/png";
		}
		var data = compressed_img_obj.src;
		data = data.replace('data:' + type + ';base64,', '');
		var xhr = new XMLHttpRequest();
		xhr.open('POST', upload_url, true);
		var boundary = 'someboundary';
		xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
		if (customHeaders && typeof customHeaders === "object") {
			for (var headerKey in customHeaders){
				xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
			}
		}
		if (duringCallback && duringCallback instanceof Function) {
			xhr.upload.onprogress = function (evt) {
				if (evt.lengthComputable) {
					duringCallback ((evt.loaded / evt.total)*100);
				}
			};
		}
		xhr.sendAsBinary(['--' + boundary, 'Content-Disposition: form-data; name="' + file_input_name + '"; filename="' + filename + '"', 'Content-Type: ' + type, '', atob(data), '--' + boundary + '--'].join('\r\n'));
		xhr.onreadystatechange = function() {
			if (this.readyState == 4){
				if (this.status == 200) {
					successCallback(this.responseText);
				}else if (this.status >= 400) {
					if (errorCallback &&  errorCallback instanceof Function) {
						errorCallback(this.responseText);
					}
				}
			}
		};
	}
};
global.jic = jic;
export default jic;
