# Technical Challenge for [LookingBus](https://www.lookingbus.com/)

## Introduction
LookingBus is a start up with a mission of making public transportation accessible for people with visual impairments. The company provides an application where people with visual impairments can specify which stop they will be boarding and getting off of a bus. This advanced notification is received by the bus drivers and the information is used to prepare, wait and assist riders with special needs accordingly.  

LookingBus works in partnership with cities across the country on initiatives to address core mobility gaps for seniors, persons with disabilities, and veterans, using proprietary technology to improve safety, reliability, and the customer experience. The company also works in conjunction with cities on smart bus-stop initiatives which assist people with visual impairments to find the exact location of the stop.


## Goal
The goal of this assignment is to display in real time, a bus' location, route and movement every minute on a google map using 511.org. The speed of the bus between two stops should be displayed in a chart. 
    - 511.org provides bay area public transit data from caltrain, bart, muni and much more

## Specific App Requirements
### Functionality  
    - Using 511.org choose a bus to display on a google map, using a bus marker for its real time location 
    - Query the 511.org every minute to update the position of the bus
    - Useing 511.org display the stops of the bus' route on the google map
    - In a chart, display the average speed of the bus between stops (xAxis - Speed), (yAxis - Time or Distance)

### Design
The application should include the following components. 
    - Top navigation bar with at least 1 active item
    - Left side navigation bar with at least 1 active item
    - A pull up drawer (accordion????) which displays the chart
    - Bottom foldable????

## 511.org API Endpoints
Doccumentation for 511.org API can be found [here](https://511.org/sites/default/files/pdfs/open%20data/511%20SF%20Bay%20Open%20Data%20Specification%20-%20Transit.pdf).

### The following endpoints were used in this application. 
    
<b>1) API: Operator (pg. 9) </b>

Per API doccumentation: "Operator within a jurisdiction represents a company providing public transport services. Consumers can request a list of all the operators within the jurisdiction or they can use additional filters such as operator code/id to restrict the results as per their needs and use case."

<b>Request Endpoint:</b> http://api.511.org/transit/operators?api_key={your-key}
       
Response includes a list of operators 
    
	Exmaple of Operator Data   

			```
			{
				"Id": "SF"
				"Montiored": true
				"Name": "San Francisco Municipal Transportation Agency"
				"PrimaryMode": "bus"
				"PrivateCode": "SF"
				"ShortName": "SF Muni"
				"SiriOperatorRef": "SFMTA"
				"TimeZone": "America/Vancouver"
				"WebSite": "https://SFMTA.com"
			}
			```

2) API: Line (pg.11)
Per API doccumentation: "Lines are routes covered by transit operators within the jurisdiction. Consumers can request list of all the routes within an operator or they can use additional filters like line id to restrict the results as per their needs and use case."

<b>Request Endpoint: </b> http://api.511.org/transit/lines?api_key={your-key}&operator_id=SF



Response includes a list of Lines for SF MTA
Exmaple of Line Data 

    ```javascript
    {
        "Id": "LBUS"
        "Montiored": true
        "Name": "TARAVAL BUS"
        "OperatorRef": "SF"
        "PublicCode": "LBUS"
        "SiriLineRef": "LBUS"
        "TransportMode": "bus"
    }
    ```

3) API: Stop (pg. 13)
Per API doccumentation: "Stop or ScheduledStopPoint is a location where passengers can board or alight from vehicles. Consumers can request list of all the stops serviced by an agency/operator within the jurisdiction. Stop groupings or StopAreas are also returned when specifically requested using the include_stop_areas parameter."

Request Endpoint: 

http://api.511.org/transit/stops?api_key={your-key}&operator_id=SF&Line_id=LBUS
            
Response includes a list of Scheduled Stop Points for the LBUS line
Exmaple of Stop Data   

    ```javascript
    {   
        "id:" "13267",
        "StopType": "onstreetBus",
        "Name": "15th Ave & Taraval St",
        "Location": {
            "Longitude": "-122.471405", 
            "Latitude": "37.743069"
            }
    }
    ```

4) API: Real-time Vehicle Monitoring (pg. 32)
Per API doccumentation: "Siri Vehicle monitoring service provides information about current location and expected activities of a particular vehicle. It also provides details for current and subsequent Journey patterns."

Request Endpoint:

http://api.511.org/transit/VehicleMonitoring?api_key={your-key}&agency=SF

Response includes a list of vehicles currently being monitored for the SFMTA

Example of Vehicle Real Time Data

    ```javascript
    {   
        "OperatorRef": "SF"
        "OriginName": "Fillmore St & Bay St"
        "OriginRef": "14603"
        "PublishedLineName": "FILLMORE"
        "VehicleLocation": {
            "Latitude": "37.7843056"
            "Longitude": "-122.432991"
        }
        "VehicleRef": "5762"
        "RecordedAtTime": "2020-04-26T23:04:19Z"
        "DestinationName": "Third + 20th",
        "DestinationRef": "13410",
        "DirectionRef": "Outbound",
        "LineRef": "22"
        "Monitored": true
        "MonitoredCall": {
            "AimedArrivalTime": "2020-04-26T23:08:36Z"
            "AimedDepartureTime": "2020-04-26T23:08:36Z"
            "ExpectedArrivalTime": "2020-04-26T23:04:25Z"
            "ExpectedDepartureTime": null
            "StopPointName": "Fillmore St & O'Farrell St"
            "StopPointRef": "14634"
            "VehicleAtStop": ""
            "VehicleLocationAtStop": ""
        }
        "OnwardCalls": {
            "OnwardCall": Array(28) [
                [
                    {
                        "AimedArrivalTime": "2020-04-26T23:10:00Z"
                        "AimedDepartureTime": "2020-04-26T23:10:00Z"
                        "ExpectedArrivalTime": "2020-04-26T23:05:20Z"
                        "ExpectedDepartureTime": null
                        "StopPointName": "Fillmore St & Eddy St"
                        "StopPointRef": "14612"
                    }
                ],
                [
                    {
                        "AimedArrivalTime": "2020-04-26T23:11:14Z"
                        "AimedDepartureTime": "2020-04-26T23:11:14Z"
                        "ExpectedArrivalTime": "2020-04-26T23:06:17Z"
                        "ExpectedDepartureTime": null
                        "StopPointName": "Fillmore St & Turk St"
                        "StopPointRef": "14642"
                    }
                ],
                [ {...}]
            ]
        }
    }

    ```

Note: Vehicles may be used on different routes each day, therefore a vehicleID of 8655 may be used on an LBUS line one day and a 14 bus line the next. Once a vehicle ID number is picked, use the vehicleID in the request parameter to narrow down the results.

Request Endpoint:

http://api.511.org/transit/VehicleMonitoring?api_key={your-key}&agency=SF&vehicleID=8655




### Chart assumptions  

The distance between two stops for this project is calculated based on the bus' current stop destination and the bus' next stop destination. 

The time it takes for a bus to drive between two stops is calculated based on the bus' expected departure time from the current stop destination and the bus' expected arrival time at the bus' next stop destination. 

The speed is calculated by getting the distance/time.

## 🔧 Technologies
- HTML
- CSS
- Bootstrap
- Javascript
- JQuery
- [Chart.js](https://www.chartjs.org/)
- Google Maps JavaScript API
- [511 SF Bay Area Public Transit Open Data](https://511.org/open-data)

## ✨ Credits
- Icons
    * <a href="https://icons8.com/icon/Y8iLfEJeABbG/bus">Bus icon by Icons8</a>
    * <a href="https://icons8.com/icon/JtFPaMeryYel/america">America icon by Icons8</a>
    * <a href="https://icons8.com/icon/95473/heart">Heart icon by Icons8</a>
    * <a href="https://icons8.com/icon/67573/medal">Medal icon by Icons8</a>
    * <a href="https://icons8.com/icon/118992/news">News icon by Icons8</a>
    * <a href="https://icons8.com/icon/g4MZHlvH55Tn/user-location">User Location icon by Icons8</a>
    * <a href="https://icons8.com/icon/qdQpy48X3Rjv/star">Star icon by Icons8</a>
    * <a href="https://icons8.com/icon/80384/bus">Bus icon by Icons8</a>
    * <a href="https://icons8.com/icon/86945/trolleybus">Trolleybus icon by Icons8</a>
    * Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    * Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    * Font Awesome



