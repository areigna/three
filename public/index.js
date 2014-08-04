//google maps API
var map;
var speed = 660;
var zoom = 12;
var obj = {
    "gphoto:id": "6043268598467267666",
    "gphoto:timestamp": "1407051705000",
    "media:group": "https://lh6.googleusercontent.com/-ws7ByaYdW-A/U94AxY3qDFI/AAAAAAAAaVI/dH0Un7Icc2o/s48-c/IMG_1728.JPG",
    "georss:where": "37.3777083 -122.0597083"
  };
function initialize() {

    var mapOptions = {
        center: new google.maps.LatLng(36.6, -121.8),
        zoom: 12,
        disableDefaultUI: true,
        mapTypeId: 'terrain',
        styles:[
            {
                "stylers": [
                    { "visibility": "simplified" },
                    { "invert_lightness": true },
                ]
            },
              {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "on" },
                    { "saturation": -100 },
                    { "hue": "#ff0000" },
                    { "lightness": -70 }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    { "visibility": "on" },
                    { "saturation": -100 },
                    { "hue": "#ff0000" },
                    { "lightness": -70 }
                ]
            }
        ]
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    //loadPerson();
}
google.maps.event.addDomListener(window, 'load', initialize);

var moments = [];
var inter ;
function loadPerson(){
    if(moments.length){
        inter = setInterval(loadMoment,speed);
    }
    else{
        $.get('/fetch?max=1000&size=150c&index=1101',function(data){
            moments = data;
            loadMoment();
            inter = setInterval(loadMoment,speed);
        })
    }
}
function stopPerson(){
    clearInterval(inter);
    var arr = document.getElementsByClassName('moment');
    for(var i = 0 ;i < arr.length; i++){
        arr[i].style.opacity = 0;
    }
}
function loadMoment(){
    if(!moments.length) return clearInterval(inter);
    var next = moments.shift();
    if(next['georss:where']){
        var x = new Moment(next, map);
    }
    else loadMoment();
}
//move map to a specific position
function moveMap(dest, callback){
    //check if the same
    console.log(checkSame(dest, map.getCenter()));
    if(checkSame(dest, map.getCenter())) return callback();
    //
    var lat = getTo(map.getCenter().lat(), dest.lat());
    var lng = getTo(map.getCenter().lng(), dest.lng());
    map.panTo(new google.maps.LatLng(lat, lng));
    setTimeout(function(){moveMap(dest, callback);},300);
}
//check if diff is greater than 0.35
function getTo(from, to){
    var diff = map.getZoom()*0.03;
    if(from - to > 0.35) return from - 0.35;
    if(from - to < -0.35) return from + 0.35
    return to;
}
//check two latlng are the same
function checkSame(a,b){
    return a.lat()==b.lat() && a.lng()==b.lng();
}