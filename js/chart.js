// Set up the inital map screen
var map;
// Used to store the hours and minutes of the current time and the expected bus arrival time
let t = [];
// Time and speed to be displayed in the chart, count represents each minute that goes by
let time = [0]
let averageSpeed = [0];
let count = 1;
// Miles between two stops
let distance = [];
function getSpeedBetweenStops(currStop, nextStop, distance) {
    console.log("======== Getting the time difference ==========")
    // Converting zulu time to Desktop System Time (Pacific Standard)
    a = new Date(currStop)
    b = new Date(nextStop)
    console.log("The current stop time is ", a)
    console.log("The next stop time is", b)

    // Getting the hours, minutes and seconds of the current stop aimed departure and next stop aimed arrival
    let aHours = a.getHours()
    let aMinutes = a.getMinutes()
    let aSeconds = a.getSeconds();
    let bHours = b.getHours()
    let bMinutes = b.getMinutes()
    let bSeconds = b.getSeconds()
    // Getting the difference in hours, minutes and seconds from the two stops
    let hourDiff = bHours - aHours
    let minutesDiff = bMinutes - aMinutes
    let secondsDiff = bSeconds - aSeconds
    console.log("Next Stop Hours ", bHours, " and Current Stop Hours ", aHours, " should equal ", hourDiff)
    console.log("Next Stop Minutes ", bMinutes, " and Current Stop Minutes ", aMinutes, " should equal ", minutesDiff)
    console.log("Next Stop Seconds ", bSeconds, " and Current Stop Seconds ", aSeconds, " should equal ", secondsDiff)

    // Get the total time difference between two stops in seconds
    let seconds = (hourDiff * 3600) + (minutesDiff * 60) + secondsDiff
    console.log("The time difference in seconds is: ", seconds)

    // Get the total time difference between two stops in minutes
    let minutes = (seconds / 60)
    console.log("The time difference in minutes is: ", minutes)

    // Define speed 
    let speed;
    let hours = (minutes / 60)

    // Calculate the speed in miles per hour
    speed = (distance / hours).toFixed(2)
    console.log("This is the speed in miles per hour ", speed, " mph")

    // Push the average speed and count into the averageSpeed and time arrays
    if (speed <= 0) {
        averageSpeed.push(0)
        time.push(count)
        count++
        console.log("This is the the average speed and time arrays")
        console.log(averageSpeed)
        console.log(time)
        displayChart()
    }
    else {
        averageSpeed.push(speed)
        time.push(count)
        count++
        console.log("This is the the average speed and time arrays")
        console.log(averageSpeed)
        console.log(time)
        displayChart()
    }
}

function displayNiceTime(ts, boolean) {
    let timeUntilBusArrives;
    let hours = ts.getHours()
    let minutes = ts.getMinutes()
    let meridiem = " AM"

    // convert to 12-hour time format
    if (hours > 12) {
        hours = hours - 12
        meridiem = " PM"
    }
    // if it's midnight
    else if (hours === 0) {
        hours = 12
    }
    // minutes should always be two digits long
    if (minutes < 10) {
        minutes = "0" + minutes.toString()
    }
    let time = hours + ":" + minutes + meridiem
    let temp = [hours, minutes]
    t.push(temp)
    if (boolean === true) {
        let hoursDiff = t[1][0] - t[0][0]
        let minutesDiff = t[1][1] - t[0][1]

        if (hoursDiff <= 0 && minutesDiff <= 0) {
            timeUntilBusArrives = "will arrive shortly."
        }
        else if (minutesDiff === 1) {
            timeUntilBusArrives = "will arrive in " + minutesDiff + " minute."
        }
        else if (hoursDiff <= 0) {
            timeUntilBusArrives = "will arrive in " + minutesDiff + " minutes."
        }
        else {
            timeUntilBusArrives = "will arrive in " + hoursDiff + " hours " + minutesDiff + " minutes."
        }
        let a = [time, timeUntilBusArrives]
        console.log(a)
        return a
    }
    return time
}


function displayChart() {
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                data: averageSpeed,
                label: "LBUS",
                borderColor: "#8e5ea2",
                fill: true,
                backgroundColor: "#F5F5F5",
                pointBackgroundColor: '#68BBE5',
                pointHoverBackgroundColor: "#70BE5B",
                pointRadius: 5,
                pointHoverRadius: 10,
                pointBorderColor: "black",
                pointBorderWidth: 2,
                pointHoverBorderColor: "black",
                pointHoverBorderWidth: 2
            }],
        },
        options: {
            scaleOptions: {
                ticks: {
                    beginAtZero: true
                }
            },
            title: {
                display: true,
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 20,
                fontColor: "#70BE5B",
                fontStyle: 'bold',
                position: 'top',
                text: 'Bus Average Speed (mph)'
            },
            scales: {
                yAxes: [{
                    gridLines: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Speed (mph)',
                        fontColor: "#70BE5B",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 18
                    },
                    ticks: {
                        beginAtZero: true,
                    }
                }],
                xAxes: [{
                    gridLines: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Minutes',
                        fontColor: "#70BE5B",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 18
                    },
                }],
            },

        }
    });
}



/**
 * Converts degrees to radians.
 * 
 * @param degrees Number of degrees.
 */
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Returns the distance between 2 points of coordinates in Google Maps
 * 
 * @param lat1 Latitude of the point A
 * @param lng1 Longitude of the point A
 * @param lat2 Latitude of the point B
 * @param lng2 Longitude of the point B
 */
function getDistanceBetweenPoints(lat1, lng1, lat2, lng2) {
    // The radius of the planet earth in meters
    let R = 6378137;
    let dLat = degreesToRadians(lat2 - lat1);
    let dLong = degreesToRadians(lng2 - lng1);
    let a = Math.sin(dLat / 2)
        *
        Math.sin(dLat / 2)
        +
        Math.cos(degreesToRadians(lat1))
        *
        Math.cos(degreesToRadians(lat1))
        *
        Math.sin(dLong / 2)
        *
        Math.sin(dLong / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distanceInMeters = R * c;
    let distanceInMiles = (distanceInMeters/1609).toFixed(2)
    return distanceInMiles;
}

