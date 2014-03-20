
// Simulate a location we have stored.
var testStartingData =  {name:"San Francisco",
  address:"San Francisco, CA, USA",
  coordinate:{lat:37.7749295,lng:-122.41941550000001}
}

if (Meteor.isClient) {

  Template.mapShow.created = function() {

    Session.set("mapInitialLocation", testStartingData);
    // Wait until the map is ready then go to location.
    Deps.autorun(function (c) {
      if (! Session.get("mapsReady")){
        console.log("not ready");
        return;
      }

      Template.maps.centerOnLocation(Session.get("mapInitialLocation"));
      c.stop();
    });
  };

  Template.mapShow.rendered = function() {
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
