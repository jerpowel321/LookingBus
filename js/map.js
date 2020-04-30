function initMap() {
    displayChart()
}

// function to display draggable markers on the map 
function displayMarker(lat, lng, map, title, icon, name, i) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: title,
        icon: icon
    });
    // add an event listener so that when a marker is clicked the name of the marker will be shown
    var infowindow = new google.maps.InfoWindow({
        content: name
    });
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
            infowindow.open(map, marker);
        }
    })(marker, i));
}


	// Function to remove the bus marker from the map
	function removeBus(){
		console.log("Busmarker Length", busMarker.length)
		if(busMarker.length >0){
			for(i=0; i<busMarker.length; i++){
        busMarker[i].setMap(null);
		}
		// Remove the text in the busInfo div
		$("#busInfo").empty();
		}
		busMarker = [];
}