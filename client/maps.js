/*
 * maps.js
 *
 * @author: ashutosh@siftcal.com
 */

currentLocation = null;

Template.maps.created = function() {
    // Assign this maps template a property called label.
    this['_label'] = _.uniqueId('mapsTemplate_');
};

Template.maps.rendered = function() {

  // If we can't find the map with this template's label
  // in the global map list. Initialize one and add it.
  if (!_.findWhere(globalMaps, {_label:this._label})) {
    globalMaps[this._label] = gmaps.initialize(null, this, "pac-input", Template.maps.locationUpdatedCallback);	
    Session.set("mapsReady", true);
  } else {
    // Otherwise re-initialize an old map.
    gmaps.initialize(globalMapList[this._label], this, "pac-input");
  }
};

Template.maps.locationUpdatedCallback = function(newLocation) {
    currentLocation = newLocation;
};

Template.maps.centerOnLocation = function(mapStartingLocation) {
  console.log(">>>> Centering on location >>>>");
  // Create the google maps marker.	
  var locationMarker = gmaps.addMarker(
    {"lat":mapStartingLocation.coordinate.lat,
      "lng":mapStartingLocation.coordinate.lng,
      "title":mapStartingLocation.name});
      // Add the marker to the map.
      currentMap = _.values(globalMaps)[0][0]; // Eventually this needs to get the correct map.
      locationMarker.setMap(currentMap);
      // Center the map to the marker and zoom appropriately.
      currentMap.setCenter(new google.maps.LatLng(mapStartingLocation.coordinate.lat, mapStartingLocation.coordinate.lng));
      currentMap.setZoom(16);
};

Template.maps.destroyed = function() {
  // Remove the map from globalMaps associated with this Template.
  _.omit(globalMaps, this._label);
};

// This can probably be deleted at some point.
Template.maps.preserve (['map-canvas', '.map-canvas', 'map-canvas', '#map', 'map', '.map']);


