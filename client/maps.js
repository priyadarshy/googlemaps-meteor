/*
 * maps.js
 *
 * @author: ashutosh@siftcal.com
 */

currentLocation = null;
currentMap =  null;

Template.maps.created = function() {
  Session.set("mapsReady", false);
};

Template.maps.destroyed = function() {
  Session.set("mapsReady", false);
};

Template.maps.rendered = function() {
  currentMap = gmaps.initialize("pac-input", Template.maps.locationUpdatedCallback, Session.get("mapInitialLocation"));	
  Session.set("mapsReady", true);
};

Template.maps.locationUpdatedCallback = function(newLocation) {
  currentLocation = newLocation;
};

// This can probably be deleted at some point.
Template.maps.preserve (['map-canvas', '.map-canvas', 'map-canvas', '#map', 'map', '.map']);


