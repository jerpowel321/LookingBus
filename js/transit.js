// Define busMarker
let busMarker = [];
// Define all live bus ref for a route
let liveBuses = [];
// Define data for bus stops such as lat, lng, name
busStopsArray = [];

function getBusStops(operatorId, route) {
    console.log("inside get bus stops", operatorId, route)
    var operator = "&operator_id=" + operatorId
    var busRoute = "&Line_id=" + route
    var BASEURL = "http://api.511.org/transit/stops?api_key="
    var queryURL = BASEURL + API_Key_511 + operator + busRoute
    console.log(queryURL)
    let location;
    // Creating an AJAX call for the specific transportation agency and line being searched
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Empty out the bus data 
        $("#busStopData").empty();
        $("#busStopDataTitle").empty();
        // Define dataBusStops to be the array of bus stops data
        let dataBusStops = response.Contents.dataObjects.ScheduledStopPoint
        console.log("=========== Bus Stop Data ==============")
        console.log("Bus Stop Data from 511.org API", dataBusStops)
        console.log("=========== Bus Stop Data ==============")
        // Create an h3 element displaying "Bus Stops" 
        var h3 = $("<h3>").text("Bus Stops").addClass("purple").css("padding-top", "40px");
        // Display under the #BusStopDataTitle Div
        $("#busStopDataTitle").append(h3);
        // Display the google Map centered around the first bus stop locaton received from the API Call
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(userLocation[0], userLocation[1]),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var infowindow = new google.maps.InfoWindow();
        // Display Bus Stop Markers by interating through the dataBusStops array
        var marker, i;
        for (i = 0; i < dataBusStops.length; i++) {
            // Pick out the data we want to use 
            let lat = dataBusStops[i]["Location"]["Latitude"]
            let lng = dataBusStops[i]["Location"]["Longitude"]
            let latNum = Number(lat)
            let lngNum = Number(lng)
            let name = dataBusStops[i]["Name"]
            let title = "Bus Stop"
            let busStopId = dataBusStops[i]["id"]
            let icon = "https://img.icons8.com/office/40/000000/map-pin.png"
            let stop = [latNum, lngNum, name, title, busStopId]
            // push the bus stop data into the BusStopsArray 
            busStopsArray.push(stop)
            // Pass the lattitude, longitude, map, title, icon, name and i to the displayMarker function
            setTimeout(function () {
                displayMarker(lat, lng, map, title, icon, name, i)
            }, i * 200);
            // create a p element displaying the bus stop name
            var p = $("<p>").text(name);
            // Display uner the #busStopData Div
            $("#busStopData").append(p);
        }
        // Display user location marker and assign it index 250
        displayMarker(userLocation[0], userLocation[1], map, "You are here", "https://img.icons8.com/emoji/48/000000/star-emoji.png", "Your Location", 250)
        findLiveBus(operatorId, route)
    }
    )
}

function findLiveBus(operatorId, route) {
    let url = "http://api.511.org/transit/VehicleMonitoring?api_key=" + API_Key_511 + "&agency=" + operatorId
    console.log("This is the live bus url", url)
    $.ajax({
        url: url,
        method: "GET"
    }).then(function (response) {
        console.log("=========== Bus Data ==============")
        console.log(response)
        console.log("=========== Bus Data ==============")
        let data = response["Siri"]["ServiceDelivery"]["VehicleMonitoringDelivery"]["VehicleActivity"]
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            if (data[i]["MonitoredVehicleJourney"]["LineRef"] === route) {
                let busRef = data[i]["MonitoredVehicleJourney"]["VehicleRef"];
                liveBuses.push(busRef)
            }
        }
        console.log("=========== Bus Data for route ==============")
        console.log(liveBuses)
        console.log("=========== Bus Data for route ==============")
        // Get the bus location and show it on the Map
        busID = liveBuses[0]
        getBus(operatorId,busID)
        timeUpdate(operatorId,busID)

    })
}


// function to display Bus 8750 Location (i.e. this bus changes routes daily)
function getBus(operatorId, busID) {
    // http://api.511.org/transit/VehicleMonitoring?api_key=358de46c-9cbf-4164-8a1d-a5be92f5fe3d&agency=SF&vehicleID=LBUS
    let url = "http://api.511.org/transit/VehicleMonitoring?api_key=" + API_Key_511 + "&agency=" + operatorId + "&vehicleID=" + busID
    console.log("Check url", url)
    $.ajax({
        url: url,
        method: "GET"
    }).then(function (response) {
        // Remove the bus marker from the map
        removeBus()
        console.log("=========== Bus Data ==============")
        console.log(response)
        console.log("=========== Bus Data ==============")
        // Pick out the data we want to use 
        let data = response["Siri"]["ServiceDelivery"]["VehicleMonitoringDelivery"]["VehicleActivity"][0]["MonitoredVehicleJourney"]
        let finalDestination = data["DestinationName"]
        let line = data["LineRef"]
        let direction = data["DirectionRef"]
        let lat = data["VehicleLocation"]["Latitude"]
        let lng = data["VehicleLocation"]["Longitude"]
        let latNum = Number(lat)
        let lngNum = Number(lng)
        let title = line + " " + direction
        let name = line + " " + direction
        let icon = 'https://img.icons8.com/doodle/48/000000/bus--v1.png'
        let stopPointRef = data["MonitoredCall"]["StopPointRef"]

        // Current Stop Data Information
        let currentStopName = data["MonitoredCall"]["StopPointName"]
        let currentStopEArrival = data["MonitoredCall"]["ExpectedArrivalTime"]
        let currentStopAimedDeparture = data["MonitoredCall"]["AimedDepartureTime"]

        // Next Stop Data Information
        let nextStopname = data["OnwardCalls"]["OnwardCall"][0]["StopPointName"]
        let nextStopEArrival = data["OnwardCalls"]["OnwardCall"][0]["ExpectedArrivalTime"]

        // Define variables to use in calculating the distance between two bus stops
        let latCurr, lngCurr, latNext, lngNext;
        // Iterate through the busStops Array to find the latitude and longitude of the current and next bus stop by filtering for the bus stop name
        for (i = 0; i < busStopsArray.length; i++) {
            if (busStopsArray[i][2] === currentStopName) {
                console.log("======= Current Stop Data =========")
                console.log(busStopsArray[i])
                console.log("======= Current Stop Data =========")
                latCurr = busStopsArray[i][0];
                lngCurr = busStopsArray[i][1];
            }
            if (busStopsArray[i][2] === nextStopname) {
                console.log("======= Next Stop Data =========")
                console.log(busStopsArray[i])
                console.log("======= Next Stop Data =========")
                latNext = busStopsArray[i][0];
                lngNext = busStopsArray[i][1];
            }
        }
        console.log(latCurr, lngCurr, latNext, lngNext)
        // Get the miles between the two bus stops calling on the getDistanceBetweenPoints function which takes (the next bus stop latitude, the next bus stop longitude, the current stop latitude and the current stop longitude)
        let miles = getDistanceBetweenPoints(latNext, lngNext, latCurr, lngCurr)
        console.log("The distance in miles from stop ", currentStopName, "to ", nextStopname, " is ", miles, " Miles")
        // Push the distance between two stops into the distance array
        distance.push(miles)
        // Call on the getSpeedBewtween Stops function passing the currentStopAimedDeparture, nextStopEArrival and miles
        getSpeedBetweenStops(currentStopAimedDeparture, nextStopEArrival, miles)

        // Manipulate and estimated arrival time and current time to display in a nice format to users
        let ts = new Date();
        let currentTime = displayNiceTime(ts, false)
        ts = new Date(currentStopEArrival)
        let a = displayNiceTime(ts, true)
        currentStopEArrival = a[0]
        let minutesToArrival = a[1]

        // create elements to display the line and direction of the bus, next stop, expected arrival 
        var h3 = $("<h3>").text(title).addClass("purple text-center").css("padding-top", "20px")
        var text1 = $("<p>").text("Next Stop: " + currentStopName);
        var text2 = $("<p>").text("Estimated Arrival Time: " + currentStopEArrival);
        var text3 = $("<p>").text("Current Time: " + currentTime);
        var text4 = $("<p>").text("Bus " + minutesToArrival)
        var text5 = $("<p>").text("Final Destination: " + finalDestination);
        // Display Bus Information under the #busInfo Div
        $("#busInfo").append(h3, text1, text2, text3, text4, text5);

        // Display Bus Marker 
        var myLatlng = new google.maps.LatLng(latNum, lngNum);
        console.log(latNum, "====awsidjnainsidasnidnna")
        console.log(lngNum, "asjdnsandinsidnaidnsna")
        console.log(myLatlng)
        var bus = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: title,
            icon: icon,
            draggable: true
        });
        console.log("This is the bus", bus)
        busMarker.push(bus)
        console.log("this is the bus marker array", busMarker)
        busMarker[0].setMap(map);


        console.log("===============")
        console.log("Title: ", title)
        console.log("Name: ", name)
        console.log("Line: ", line)
        console.log("Direction: ", direction)
        console.log("Final Destination: ", finalDestination)
        console.log("Current Stop Name ", currentStopName)
        console.log("Current Stop Expected Arrival: ", currentStopEArrival)
        console.log("Current Stop Expected Departure: ", currentStopAimedDeparture)
        console.log("Next stop arrival name: ", nextStopname)
        console.log("Next Stop Expected Arrival", nextStopEArrival)
        console.log("Current Time: ", currentTime)
        console.log("===============")

    })

}

function timeUpdate(operatorId,busID){
	setInterval(function () {
		console.log("Getting Bus Current Location after 1 minute.")
		getBus(operatorId,busID);
	}, 60000); //Eveery 60 seconds
}