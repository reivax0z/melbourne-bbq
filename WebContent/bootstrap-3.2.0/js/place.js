var allPlaces = [];
var bbqPlaces = new Array();

function populateContent(){
	var content = "";
	for(var i=0; i<allPlaces.length; i++){
	  content += '<a id="all_'+i+'" href="#map_places" class="list-group-item" onclick="bounceAndCenter(0, '+i+');">'+allPlaces[i].name+'</a>';
	}
	document.getElementById("list_places").innerHTML = content;
}

$(document).ready(function() {
	
	function parseJSON( data ) {
		allPlaces = data.places;
		
		for(var i=0; i<allPlaces.length; i++){
			bbqPlaces.push(new google.maps.LatLng(allPlaces[i].lat, allPlaces[i].lng));
		}
		initializeMapPlaces(bbqPlaces, allPlaces, 13, 0);
		populateContent();
	}
	
	$.ajax({
		type: "GET",
		url: "./bbq.json", // change to full path of file on server
		dataType: "json",
		success: parseJSON,
		failure: function(data) {
			alert("JSON File could not be found");
		}
	});
});
