var Map;

Map = {
    /***
     * Initializes the Google Map component
     * @param element - element id on which Google Maps will be displayed
     * @param autoCompleteElement - Input element id on which Google Place AutoComplete will be shown
     */
    init: function (element, autoCompleteElement) {
        var mapOptions = {
            center: new google.maps.LatLng(31.5, 34.5),
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this._map = new google.maps.Map(document.getElementById(element), mapOptions);
        this.marker._marker = new google.maps.Marker({
            map: this._map,
            draggable: true,
            icon: '../admin_public/images/map_pin.png'
        });
        this.infoWindow._infoWindow = new google.maps.InfoWindow();

        if (autoCompleteElement) {

            var input = document.getElementById(autoCompleteElement);
            var autocomplete = new google.maps.places.Autocomplete(input, {
                    types: ["geocode"]}
            );
            autocomplete.bindTo('bounds', this._map);

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                if (place.geometry) {
                    var latLng = place.geometry.location;

                    var autocompletePlaceChangedEvent = new CustomEvent('Autocomplete_onPlaceChanged', { 'detail': { 'latLng': latLng} });
                    dispatchEvent(autocompletePlaceChangedEvent);
                }
            });
        }

        // Events declaration
        google.maps.event.addListener(this._map, 'click', function (event) {
            var clickedEvent = new CustomEvent('Map_onClick', { 'detail': { 'latLng': event.latLng } });
            dispatchEvent(clickedEvent);
        });
        google.maps.event.addListener(this.marker._marker, "dragend", function (event) {
            var dragEndEvent = new CustomEvent('Map_onDragEnd', { 'detail': { 'latLng': event.latLng } });
            dispatchEvent(dragEndEvent);
        });
        google.maps.event.addListener(this.infoWindow._infoWindow, 'closeclick', function () {
            Map.infoWindow._isVisible = false;
        });
    },
    /**
     * Searches for an Address in Google Maps,
     * @Return - Result is returned in the Geocoder_onFoundLocation event
     * @param location - a string containing an address
     */
    findLocation: function (location) {
        var geocoder = new google.maps.Geocoder();
        var request = {"address": '"' + location + '"'};
        geocoder.geocode(request, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var result = results[0].geometry.location;
            }
            var findLocationResultEvent = new CustomEvent('Geocoder_onFoundLocation', { 'detail': { 'latLng': result }});
            dispatchEvent(findLocationResultEvent);
        });
    },
    marker: {
        /***
         * Moves the marker to specified location (latLng)
         * @param latLng
         */
        moveMarker: function (latLng) {
            this._marker.setPosition(latLng);
        }
    },
    infoWindow: {
        /**
         * Sets the InfoWindow text.
         * @param content
         */
        setContent: function (content) {
            this._infoWindow.setContent(content);
        },
        /**
         * Displays the InfoWindow.
         * if content is passed - updates the InfoWindow text.
         * @param content
         */
        show: function (content) {
            if (this._isVisible != true) {
                this._infoWindow.open(Map._map, Map.marker._marker);
                this._isVisible = true;
            }
            else {
                this._infoWindow.setPosition(Map.marker._marker.position)
            }
            if (content) {
                this.setContent(content);
            }
        },
        /**
         * Hides the InfoWindow
         */
        hide: function () {
            if (this._isVisible) {
                this._infoWindow.close();
                this._isVisible = false;
            }
        }
    },
    /**
     * Centers the Google Map to a specific location (latLng)
     * if zoom is passed - Updates the Google Map zoom value.
     * @param latLng
     * @param zoom
     */
    panAndZoomMapToLocation: function (latLng, zoom) {
        if (zoom) {
            this._map.setZoom(zoom);
        }
        this._map.panTo(latLng);
    }
};

function convertStringToLatLng(input) {
    var latLngStr = input.split(",", 2);
    var lat = (latLngStr[0].replace(/[A-Za-z()$-]/g, ""));
    var lng = (latLngStr[1].replace(/[A-Za-z()$-]/g, ""));
    var latLng = new google.maps.LatLng(lat, lng);

    return latLng;
}