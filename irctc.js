const puppeteer = require('puppeteer');
      fs = require('fs'),
     request = require('request');
     jimp = require("jimp");
     ocrSpaceApi = require('ocr-space-api');

var username='irctc user name';
var password= 'irctc password';
var ocrapikey= '<OCR Space API Key>';


function convertImageToMonochrome(imageName){
	return new Promise(function(resolve,reject) {
	console.log('Entered Into convertImageToMonochrome function!!!')
	jimp.read(imageName, function (err, img) {
    if (err) throw err;
    	img.background(0xFFFFFFFF)
    		.greyscale()
    		.brightness(0.15)
    		.contrast(1)
           .write("captcha.jpg"); // save 
       });
	 console.log('Image converted to monochrome successfully!!!');
	 resolve();
	});
}


function convertImageToText(imagePath, imageFormat){ 
	return new Promise(function(resolve,reject) {
	console.log('Entered to convertImageToText function!!!')
var options =  {
    apikey: ocrapikey,
    language: 'eng',
    imageFormat: imageFormat, 
    isOverlayRequired: true
  };
 
// Image file to upload 
 
// Run and wait the result 
ocrSpaceApi.parseImageFromLocalFile(imagePath, options)
  .then(function (parsedResult) {
    console.log('parsedText: \n', parsedResult.parsedText);
    console.log('ocrParsedResult: \n', parsedResult.ocrParsedResult);
    resolve(parsedResult);
  }).catch(function (err) {
    console.log('ERROR:', err);
    reject(-1);
  });
  console.log('Exiting from convertImageToText function!!!');


});
}

(async () => {


  const browser = await puppeteer.launch({
  headless: false
});

  const page = await browser.newPage();
  page.on('console', (msg) => {
    console.log(msg);
});
  
 
  await page.goto('https://www.irctc.co.in',{networkIdleTimeout:1000, waitUntil: 'networkidle'});


  await page.screenshot({path: 'step1.png'});


  var captcha = await page.evaluate(function(){
  	var img =document.getElementById("captchaImg");
  	if(!img){
  		img = document.getElementById("cimage");
  	}
  	img.setAttribute('crossOrigin', 'anonymous');
  	var canvas = document.createElement('CANVAS');
   var ctx = canvas.getContext('2d');
   ctx.drawImage(img,0,0);
   var myDataURL = canvas.toDataURL('image/png');
   alert(myDataURL);
   return myDataURL;
  }).then(function(data){
  	return data;
  },function(){
  		    console.log('Getting image failed!!!');
  			return -1;
  });

  //console.log(captcha);

  if(captcha==-1){

  	var captchaurl = await page.evaluate(function(){
  	var img =document.getElementById("captchaImg");
  	return $(img).attr('src');
  });

  	 function download(uri, filename){
     return new Promise(function(resolve,reject) {
    request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);

  	});
});
}

 await download(captchaurl, 'captcha.png').then(function(){ console.log(' Image Downlaoded!!!')},undefined);

 }else{

var base64Data = captcha.replace(/^data:image\/png;base64,/, "");
fs.writeFile("captcha.png", base64Data, 'base64', 
function(err, data) {
if (err) {
    console.log('err', err);
}
console.log('Image converted to file from base64 successfully!');
});

 }

await convertImageToMonochrome('captcha.png').then(function(){ console.log('Image converted to monochrome!!! resolved')},undefined);

await page.waitFor(1000);

var parsedData = await convertImageToText('captcha.jpg','image/jpeg').then(function(data){ console.log('Image converted to text!!! resolved');
return data;
},undefined);

console.log('logging parsed result');
console.log(parsedData.parsedText);


var NLPtext = parsedData.parsedText;
NLPtext = NLPtext.replace(/\s/g,'');
NLPtext = NLPtext.substr(NLPtext.indexOf('w')+1);
console.log(NLPtext);

await page.evaluate(function(NLPtext, username, password){
$('#usernameId').val(username);
$('.loginPassword').val(password);
$('#nlpAnswer').val(NLPtext);
$('#loginbutton').click();
},NLPtext,username,password);

await page.waitForNavigation();
console.log("LoggedIn successfully!!!");

 //await browser.close();



})();



