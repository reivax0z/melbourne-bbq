/**
 * 
 */

//Global variables
var map;
var directionsDisplay;
var directionsService;
var initialLocation;

var prevSelectPlace = 0;
var prevBouncingIndex = 0;

var selectedClassName = "selectedPlace";
var unselectedClassName = "";
var selectedIcon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
var unselectedIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

var tabs = 'all_';

var markers = new Array();


var browserSupportFlag = false;

function initializeMapPlaces(positions, places, zoomVal) {
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();
	
	var sumLat = 0;
	var sumLong = 0;
	
	if(navigator.geolocation) {
		browserSupportFlag = true;
	}
	
	// Create a new LatLngBounds object
	var markerBounds = new google.maps.LatLngBounds();

	for (var i = 0; i < positions.length; i++) {
		sumLat+=positions[i].lat();
		sumLong+=positions[i].lng();
		markerBounds.extend(positions[i]);
	}
	sumLat/=positions.length;
	sumLong/=positions.length;
	var centerPos = new google.maps.LatLng(sumLat, sumLong);
	
	// Init the map
	var myOptions = {
			zoom: zoomVal,
			center: centerPos,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById('map_places'), myOptions);
	
	map.fitBounds(markerBounds);
	
	// delegate it with a parameter containing all the positions
	for (var i = 0; i < positions.length; i++) {
		addLocationAndLink(positions[i], places[i], i);
	}
}

function selectOnePlace(index) {
	document.getElementById(tabs+prevSelectPlace).className = unselectedClassName;
	markers[prevSelectPlace].setIcon(unselectedIcon);
    document.getElementById(tabs+index).className = selectedClassName;
	markers[index].setIcon(selectedIcon);
    
    prevSelectPlace = index;
}

function goToAnchor(index){
	var url = location.href;
    location.href = "#"+tabs+index;
    history.replaceState(null,null,url);
}

function goToAnchorMap(){
	var url = location.href;
    location.href = "#map_places";
    history.replaceState(null,null,url);
}

function addLocationAndLink(pos, link, index){
	// Get coordinates
	var options = {
			position: pos,
			title: link.name,
			icon: unselectedIcon
	};
	var marker = new google.maps.Marker(options);
	
	google.maps.event.addListener(marker, 'click', function() {
		clearDirections();
		bounce(index);
		goToAnchor(index);
	});

	// Show marker on map
	marker.setMap(map);
	
	markers[index] = marker;
}

function bounce(index) {
	var marker = markers[index];
	var prevMarker = markers[prevBouncingIndex];
	
	prevMarker.setAnimation(null);
	
	// Is the marker already animating?
	if (marker.getAnimation()) {
		marker.setAnimation(null);
	} else {
		// Make it bounce!
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
	
	selectOnePlace(index);
	
	prevBouncingIndex = index;
}

function bounceAndCenter(index) {
	clearDirections();
	var marker = markers[index];
	bounce(index);
	map.setCenter(marker.getPosition());
	goToAnchorMap();
}

function directions(destination){
	var end = markers[destination].getPosition();
	navigator.geolocation.getCurrentPosition(function(position) {
		  initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		  map.setCenter(initialLocation);
		  computeRoute(initialLocation, end);
		});
	bounce(destination);
	goToAnchorMap();
}

function computeRoute(start, end){
	clearDirections();
	directionsDisplay.setMap(map);
	  var request = {
	      origin:start,
	      destination:end,
	      travelMode: google.maps.TravelMode.WALKING
	  };
	  directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response);
	    }
	  });
}

function clearDirections(){
	if(directionsDisplay != null) {
		directionsDisplay.setMap(null);
		directionsDisplay = null;
	}

	directionsDisplay = new google.maps.DirectionsRenderer();
}