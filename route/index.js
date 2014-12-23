var request = require('request');
var parseString = require('xml2js').parseString;

var cookie = 'PREF=ID=719cf9460e43b333:U=4f4b0492d2797da6:FF=0:LD=en:TM=1405392017:LM=1405812791:GM=1:S=qbcsNNC1BJHO-vHF; HSID=A5ZSOrFhQU1xw4kn2; SSID=AplhEYvHZQ1DMdDhP; APISID=zUVR89Xg7ulMw_Gs/ALTmsGT5P4nhCRu51; SAPISID=vwnwwk48DLwudbtK/Avwn5ALiGbzej4GF2; SID=DQAAAAkCAADIPG49E5zwHAqRfm62JCMQ_rKOwdATTzFw24dxOfZOVXnokwDND5RaN5L5DfVohwQZLGBiStqbZqjNXIABfZiU_xZrB-7pGOOey4l7furcxm4DyOZw9NSvTf2xdlW_7b5qPv8ADwSGSPM1dMr5g2uWOmzJtX38camrXJeCjLbDn6oOMX56rBNRYYn3DwpPT9_rkze7FBUMkuZuR9_Zx6EWdlvQAjbL_YLMTLJd_hLUozelvsJa36gVgNJQMCVpvQgJOYSn1bnlSrhm878WRn6AiFQzy4ODq_SecOBcxoL47M_963nfnR6cZ7WGhE9o4R8mCYlQLPHkUvEuso8uGIOX7reszqci9_695lkuRhTl7o5WdhbLYnWIWesyg4KONYnqljnd8MePDLPHS_lrjRdg_8g-6Cz6zfNdofLFyGw6dA2JnQ4vf4NA2SXWrRBEQ2vVONsphmA96uSzsmouDYR8CDnXmesbpOY-10KUZwC2M1jz1u_DEvxlaxVIf2rG8HGiBb2qzzhVbUIq3G24sKzte-1lVgIcMrPhmRbtt6SmCt46zoUacFbA4AVxCexJxLRJoiWhjrA-C-cKtotMgn2Np0h-EEOFcDsW9I6TpcYveEKJ96FP3X0tdaKsimOxw28OF_9zzKIs0dfHXUsM_PkNh2ftqSULlm4-M8uWpex9jiCv76CnFcuUbXx0T1iFhgM; NID=67=Mf0r_5RijwYaJNmdik7FoCSaoTIWJv7cXjdEcHrtlnfHVJUv3XxhgnDu9EjPxc8Z3EZEOyl44EXcHg7gVU4PRVY0YtxdVWJyZjvtp_sd-GwAs8S707BjsprNDvtKwFtLwjdSv29RE5jK_M-4JkY5appvRmawW0S8yOvCT4N-J9qxvySbaSJOdvaGTMlrSCOvQ1KcjFpmbKqlYQNeu1hAkbbWjKSBnYnq0M1D-J7JVcv23k0A2VAn_75mEeI-h3z5v3KMy0OVrE6AALvwyB4dTr83OXiiKFiF13j9E0SytjvOnhDuXEY_oGt595FmWB9bcZfW8h6kfiRjDg; _rtok=Jh_HmLW-rfBP; S=photos_html=KRGD-EchgTjPgQ8RvHXjeA:billing-ui-v3=ZJX8m46OM5HkYKl1tPF97g:billing-ui-v3-efe=ZJX8m46OM5HkYKl1tPF97g:grandcentral=qm8AUd4GuOlDm14BoPUbqg:quotestreamer=IHBVuM_LBd3UjcLpEPS7yA:travel-flights=-bt1YrBsT9mVaoS0uxnFrQ';
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
