'use strict';
/**
 * App for navigating a food market
 * Author: Lorenz Puskas
 *
 * @requires jQuery
 * @version 0.0.1
 */
var MapApp = (function () {
    // Properties

    // initialize the map
    var map = L.map('map').setView([51.509865, -0.118092], 12);


    // Methods
    function init() {
        // Application init code

        initMap();
        setPopUpInfo();
        insert();
        var locationbtn = $('#locbtn');
        locationbtn.on('click', getLocationLeaflet);
        //locationbtn.on("click", getLocationLeaflet);


    }


    /**
     * initMap
     * Loads the tile layer
     */
    function initMap() {
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 17,
                minZoom: 2
            }).addTo(map);

    }


    /**
     * setPopUpInfo
     * Extracts data from an external json file to set some info
     * for the popUp windows.
     */
    function setPopUpInfo() {
        $.getJSON("js/features.json", function (data) {
            var restaurantIcon = L.icon({
                iconUrl: 'https://cdn3.iconfinder.com/data/icons/barbecue-icons-1/476/Fork_And_Steak_Knife-512.png',
                iconSize: [60, 50]
            });

            L.geoJson(data, {

                pointToLayer: function (feature, latlng) {
                    var marker = L.marker(latlng, {icon: restaurantIcon});


                    window.navigator.geolocation.getCurrentPosition(function (pos) { // Gets the geoposition of the user
                        var lat = pos.coords.latitude;
                        var lon = pos.coords.longitude;
                        var mypos = L.latLng(lat, lon); // Creates a leaflet object of the coordinates
                        marker.bindPopup(
                            '<h1 class="popUph1">' + feature.properties.title + '</h1>' + '<br/>' +
                            '<p class="popUp-p">' + feature.properties.description + '</p>' + '<br/>' +
                            '<p class="popUp-p">' + "Avstånd till restaurang:" + " " + getDistance(mypos, latlng) + '</p>' + '<br/>' +
                            "<img class='popUp-img' src=" + feature.properties.image + " >");
                    });
                    return marker;
                }
            }).addTo(map);
        });
    }

    function insert() {
        var img = document.createElement("img");
        var src = document.getElementById("map");
        img.setAttribute('id', 'locbtn');
        img.src = "http://www.freeiconspng.com/uploads/safari-icon-0.png";
        src.appendChild(img);
    }

    /**
     * getDistance
     * Method that takes to positions and calculates
     * the distance(bird-way) between them.
     * @param from
     * @param to
     * @returns {string}
     */
    function getDistance(from, to) {
        return from.distanceTo(to).toFixed(0) / 1000 + ' km';
    }


    /**
     * onLocationFound
     * Creates an icon and a circle for the users geoposition.
     * Locates the position of the user.
     * */
    function onLocationFound(e) {
        var positioner = L.icon({
            iconUrl: 'img/userPosition.png',
            iconSize: [50, 50]
        });
        var radius = e.accuracy / 2;
        var location = e.latlng;
        L.marker(location, {icon: positioner}).addTo(map);
        L.circle(location, radius).addTo(map);
    }

    /**
     * onLocationError
     * Displaying error
     * @param e
     */
    function onLocationError(e) {
        alert(e.message);
    }

    /**
     * getLocationLeaflet
     * Gets the location on the map.
     */
    function getLocationLeaflet() {
        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);
        map.locate({setView: true, maxZoom: 16});
    }

    return {
        init: init
    };

})();

MapApp.init(); // Run application