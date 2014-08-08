var request = require('request');
var parseString = require('xml2js').parseString;

var cookie = 'PREF=ID=719cf9460e43b333:U=4f4b0492d2797da6:FF=0:LD=en:TM=1405392017:LM=1405812791:GM=1:S=qbcsNNC1BJHO-vHF; HSID=AVnorMoS3GqakD4OW; SSID=AkW86i4tnW4bx7VKQ; APISID=7jwVh8OtYfSV6sEQ/ARcMyEUM-pUx0Rgyg; SAPISID=N4alUzwl6F3ZlPOx/Aew4luQChihHP5tQF; _rtok=2ejFNqP70pY6; SID=DQAAAOwBAAANfjx5Fz8huy0cv-pmW6Sj2ueiSFKYMiYcOxovbI835CiCbSaE_vDLgSB0gTH8QEx_YQq3HDYRQNhuIVVHFWnCVsVdIsmfx8bkO3ILOsqRA6rR3bJgKdndc6n5jDFHf3NgDJiRjsONp_EAKegagHixNqHGk8Rs3DpNDlCATkD89ppXcRtltdIysH7rzQmEzDmrc3rvWm-6JreY9w4ThwulN4QWucbp4xVFeWGrSlZtCSgrDwRst6Qqvsa0AgN5515FBsERuDhhLrV922Lsh2FKSPCO0bCj150R-k0cZz1FFkuQT8IZaDdzBo2Tsfn1msiEgNeasCZ2GiA55pgBbgKKiJSdDaIaFtCOAgF-apyIurfbwzIAUTmh5szQP5RKHbOjE63wJM1E1j5-_Gg16uRICpgBpkRHw7YBDVE0i6SYn4t-rWXBg6wC0bi4VRkygmuMCMJmYYmgliaWxv5H8cV3zVFpUJeyDt4Pas1vpPG27YML8QIVLN0PJJ-QZ0VA1R_mym3OtTJRu1J9GZJ8g1P4ITw_xwnfKuBdr0xEDkuARlEAhlp9dRhBwlrUvH8m6LA0i0-Vpvq8mD5hGmtQA-yHnjBQ9QyB5ApY_1q0SSFTPEyuWVj6rTVx0M3e7HM7b1O35CvoK27QaC_uWF3w8Auv; NID=67=OecGYHZ1Hb2WaXEeZ9mImNtvFL5L7UVm7_f83NE6T9jc-uz2ZOVfaCE2sCZt2JrvzG4RNsH_VSmDl4ZAadzdtZ-2N5Ouy6XNzOiAa1O0m71fEaef4NC84DlGoBpjDlACMySG8Iwi_JQCDseL191u65_b6gFqt2Qvo_h3Ly3M04L-ekUIj4_mqvRZMYQk_s3_j0HRiJoeE2XcEIJSQheiMfURBo9xc3AcvFPP4ESbRd1kZkUX8gO5riDvZqS5-tR04pVj28LwtM12uAFM9iP5d-s305PJx_rmCwIhOZgDA0ShitOgegGToBc; S=photos_html=0AyEiuBasdDiEaT6gtNWtA';
var userId = '107057677740214996859';
var albumId = '10000004149968';

exports.fetch = function(req,res,next){
	var options = {
		url: 'https://picasaweb.google.com/data/feed/api/user/'+userId+'/albumid/'+albumId,
		qs: {
			'fields': 'entry(gphoto:id,gphoto:timestamp,media:group(media:thumbnail),georss:where)',
			'kind':'photo',
			'prettyprint': 'true',
			'max-results': req.param('max')?req.param('max'):'10',
			'thumbsize': req.param('size')?req.param('size'):'48c',
			'start-index': req.param('index')?req.param('index'):'1',
			//'bbox':'-130,30,-120,40'
		},
		headers: {
			cookie: cookie
		}
	}
	request(options,function(a,b,xml){
		parseString(xml, function (err, result) {
			var arr = result.feed.entry;
			for(var i = 0 ;i < arr.length; i++){
				for(var x in arr[i])
					arr[i][x] = parse(arr[i][x],x);
			}
			res.json(arr);
		});
	});
}

//strip data from the obj
function parse(obj,attr){
	if(attr==='media:group'){
		return obj[0]['media:thumbnail'][0]['$']['url'];
	}
	if(attr==='georss:where'){
		return obj[0]['gml:Point'][0]['gml:pos'][0];
	}
	if(obj[0]){
		if(obj[0]['_']) return obj[0]['_'];
		else return obj[0];
	}
	return obj;
}