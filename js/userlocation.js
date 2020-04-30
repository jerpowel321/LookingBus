// Function to retrieve the location of the user
function geoFindMe() {
    // Display status message on webpage
    const status = document.querySelector('#status');
    function success(position) {
        // Set the userLocation to an empty array
        userLocation = [];
        // Retrieve the latitude and longitude of the user 
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        // update the userLocation variable 
        userLocation.push(latitude)
        userLocation.push(longitude)
        console.log(userLocation)
        status.textContent = '';
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(latitude, longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var infowindow = new google.maps.InfoWindow();
        // Update the current location star and display on map
        displayMarker(latitude, longitude, map, "You are here", "https://img.icons8.com/emoji/48/000000/star-emoji.png", "Your Location", 251)
        var marker, i;
        // Display the bus pins
        for (i = 0; i < busStopsArray.length; i++) {
            // Pick out the data we want to use 
            let lat = busStopsArray[i][0]
            let lng = busStopsArray[i][1]
            let name = busStopsArray[i][2]
            let title = busStopsArray[i][3]
            let id = busStopsArray[i][4]
            let busStopId = busStopsArray[i][5]
            let icon = "https://img.icons8.com/office/40/000000/map-pin.png"
            // Pass the lattitude, longitude, map, title, icon, name and i to the displayMarker function
            displayMarker(lat, lng, map, title, icon, name, i)
        }
        // Get the bus location and show it on the Map
        getBus()
    }
    // If the user denies popup window requestion access to their location display the following message
    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
