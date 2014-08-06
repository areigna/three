//extends Map.OverLayView
Moment.prototype = new google.maps.OverlayView();
//constructor
function Moment(obj, map) {
    if(!obj['georss:where']) return;
    this.id_ = obj['gphoto:id'];
    this.time_ = obj['gphoto:timestamp'];
    this.src_ = obj['media:group'];
    //create bound
    var arr = obj['georss:where'].split(' ');
    var lat = parseFloat(arr[0]); var lng = parseFloat(arr[1]);
    this.center_ = new google.maps.LatLng(lat,lng);
    this.sw_ = new google.maps.LatLng(lat-dis,lng-dis);
    this.ne_ = new google.maps.LatLng(lat+dis,lng+dis);
    //
    this.map_ = map;
    this.img_ = null;
    this.setMap(map);
}
//when created, called setMap(map)
Moment.prototype.onAdd = function() {
    // Create the img element and attach it to the div.
    var img = document.createElement('img');
    img.id  = this.id_;
    img.className = 'moment';
    img.src = this.src_;
    img.style.position = 'absolute';

    this.img_ = img;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(img);
    //center it
    map.panTo(this.center_);
};
//when the map is zoomed in or dragged, need to recreate the moment
Moment.prototype.draw = function() {
    var me = this;
    var overlayProjection = this.getProjection();
    var sw = overlayProjection.fromLatLngToDivPixel(this.sw_);
    var ne = overlayProjection.fromLatLngToDivPixel(this.ne_);
    // Resize the image's div to fit the indicated dimensions.
    var img = this.img_;
    img.style.left = sw.x + 'px';
    img.style.top = ne.y + 'px';
    //
    var length = ne.x-sw.x;
    if(length < min) length = min;
    if(length > max) length = max;
    img.style.width = length + 'px';
    img.style.height = length + 'px';//(sw.y - ne.y) + 'px';
    img.style.borderRadius = length/2 + 'px';
    setTimeout(function(){
        img.style.opacity=1;
        setTimeout(function(){
            img.style.opacity=0;
            setTimeout(function(){me.setMap(null);},2000);
        },3330);
    },100);
};
//called when setMap(null)
Moment.prototype.onRemove = function() {
    this.img_.parentNode.removeChild(this.img_);
    this.img_ = null;
};

//create bound element
function bound(a,b,c,d){
    var swBound = new google.maps.LatLng(a, b);//30,-120.1//1:1.155
    var neBound = new google.maps.LatLng(c, d);//30.086,-120//1:0.86
    var bounds = new google.maps.LatLngBounds(swBound, neBound); 
}