/*
 * googlemaps-meteor.js
 */

var testStartingData = {
  name:"San Francisco",
  address:"San Francisco, CA, USA",
  coordinate: {lat:37.7749295,lng:-122.41941550000001}
};

Template.mapShow.created = function() {
  Session.set("mapInitialLocation", testStartingData);
};

Template.mapSearch.created = function() {
  Session.set("mapInitialLocation", testStartingData);
};


Template.mapShow.destroyed = function() {

};

Template.mapShow.rendered = function() {

};
