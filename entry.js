var L = require('leaflet')
var Transitive = require('transitive-js')
L.TransitiveLayer = require('leaflet-transitivelayer')

// set some Leaflet map configuration properties
var config = {
    tileUrl : 'http://{s}.tiles.mapbox.com/v3/conveyal.ie3o67m0/{z}/{x}/{y}.png',
    initLatLng : new L.LatLng(38.903324,-77.04448), // DC
    initZoom : 13
};

// set up the leaflet map, disabling inertia and zoom animation
var map = L.map('map', {
  inertia: false,
  zoomAnimation: false
})

// add the base TileLayer
map.addLayer(new L.TileLayer(config.tileUrl));

// create the Transitive instance
var transitive = new Transitive({
  data: DATA,
  useDynamicRendering: true,
  draggableTypes: ['PLACE']
});

// create and add the Transitive layer to the map
var transitiveLayer = new L.TransitiveLayer(transitive);
map.addLayer(transitiveLayer);

// set the initial map view
map.setView(config.initLatLng, config.initZoom);

// set up the demo clear/load controls
document.getElementById("clear").onclick = function(event) {
  transitive.clearData();
};

document.getElementById("load").onclick = function(event) {
  transitive.updateData(DATA);
  map.fitBounds(transitiveLayer.getBounds());
};
