// Source code available from here:
// https://developers.google.com/maps/documentation/javascript/examples/places-searchbox

currentMarkers = [];

gmaps = {
    // map object
    map: null,

    // google markers objects
    markers: [],

    // google lat lng objects
    latLngs: [],

    // our formatted marker data objects
    markerData: [],

    // add a marker given our formatted marker data object
    addMarker: function (marker) {
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: this.map,
            title: marker.title,
            // animation: google.maps.Animation.DROP,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        this.latLngs.push(gLatLng);
        this.markers.push(gMarker);
        this.markerData.push(marker);
        return gMarker;
    },

    // calculate and move the bound box based on our markers
    calcBounds: function () {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = this.latLngs.length; i < latLngLength; i++) {
            bounds.extend(this.latLngs[i]);
        }
        this.map.fitBounds(bounds);
    },

    // check if a marker already exists
    markerExists: function (key, val) {
        _.each(this.markers, function (storedMarker) {
            if (storedMarker[key] == val)
                return true;
        });
        return false;
    },

    // intialize the map, optionally takes a map that has been initialized.
    initialize: function (oldMap, linkedTemplate, searchBoxId, locationUpdateCallback) {
        var markers = [];
        var map;
        if (!oldMap) {
            // This would need to be handled to show multiple maps simultaneously.
            map = new google.maps.Map(document.getElementById('map-canvas'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            // Custom initialization for a new map.
            var defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(37.506458, -122.626762),
                new google.maps.LatLng(37.835276,-122.000542));
            map.fitBounds(defaultBounds);
            console.log(">>>>> Initialization Bounds >>>>>");
        } else {
            map = oldMap[0];
        }
        //
        //  These things need to happen regardless of its a map that's being reloaded or not, well it doesn't hurt. 
        //
        // Create the search box and link it to the UI element.
        var input = document.getElementById(searchBoxId);

        /** @type {HTMLInputElement} */
        var searchBox = new google.maps.places.SearchBox((input));

        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        google.maps.event.addListener(searchBox, 'places_changed', function () {
            places = searchBox.getPlaces();
            for (var i = 0, marker; marker = markers[i]; i++) {
                marker.setMap(null);
            }

            // For each place, get the icon, place name, and location.
            markers = [];
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location,
                    data: place
                });
                markers.push(marker);
                var address = _.first(markers).data.formatted_address;
                _.rest(markers).forEach(function(marker){
                    marker.setMap(null); // remove all the markers.
                });
                // Format the marker data nicely.
                var markerData = _.first(markers).data;
                var markerName = markerData.name;
                var markerFormattedAddress = markerData.formatted_address;
                var markerGeometry = _.object(["lat", "lng"],_.first(_.values(markerData.geometry.location),2));
                var locationInfo =  {name: markerName, address:markerFormattedAddress, coordinate:markerGeometry};
                //console.log(locationInfo);
                locationUpdateCallback(locationInfo);

                bounds.extend(place.geometry.location);
                if (places.length==1) {
                    var listener = google.maps.event.addListener(map, "idle", function() {
                      map.setZoom(16);
                      google.maps.event.removeListener(listener);
                  });
                }
                google.maps.event.addListener(marker, 'click', function (
                    innerMarker) {
                    return function () {
                        map.panTo(innerMarker.getPosition());
                        markerClicked(innerMarker, markers);
                    }
                }(marker));
            }
            currentMarkers = markers;
            map.fitBounds(bounds);
        });
        // [END region_getplaces]

        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        google.maps.event.addListener(map, 'bounds_changed', function () {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
        });
        return [map];
    }
}

function markerClicked(clickedMarker, markers) {
    // Remove the clicked marker from list of all markers.
    //var markersToRemove = _.without(markers, clickedMarker);
    // Then remove all the markers but that one from the map.
    //markersToRemove.forEach(function(marker) {
      //marker.setMap(null);
    //});

    // TODO this needs to be upated to work with the new way of pulling out data from the marker.
    // also it needs to avoid using the session variable.
    // Set the data of the current location in the prefixed session variable.
    //Session.set(Session.get("mapElementPrefix") + "currentAddress", clickedMarker.data.formatted_address);
    //Session.set(Session.get("mapElementPrefix") + "locationData", _.pick(clickedMarker.data, 'name', 'formatted_address', 'geometry'));
    // Update the text box to show the address of the selected pin.
    //$("#" + Session.get("mapElementPrefix")).val(clickedMarker.data.formatted_address);
};
