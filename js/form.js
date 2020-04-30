let operatorId;
// Adding a click event listener to the search button
$("#searchRoute").on("click", function (event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    event.preventDefault();
    // Take the value of the agency and route the user selected and pass it to the getBusStops function
    operatorId = $("select#agency option:checked").val()
    let route = $("select#line option:checked").val()
    console.log("I am clicked ", operatorId, route)

    // padding the operator ID and route to getBusStops function which retrieves the bus stop location from 511.org 
    getBusStops(operatorId, route);
    // console.log("IM CLICKED", busID)
});
