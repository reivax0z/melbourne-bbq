var allPlaces = [];
var bbqPlaces = new Array();

function populateContent(){
	var content = '<table class="table table-striped"><tbody>';
	for(var i=0; i<allPlaces.length; i++){
	  content += '<tr id="all_'+i+'"><td>'+allPlaces[i].name+'</td><td><buton type="button" class="btn btn-default" onclick="bounceAndCenter('+i+');">Location</button></td><td><buton type="button" class="btn btn-success" onclick="directions('+i+');">Directions</buton></td></tr>';
	}
	content += '</tbody></table>';
	document.getElementById("list_places").innerHTML = content;
}

$(document).ready(function() {
	
	function parseJSON( data ) {
		allPlaces = data.places;
		
		for(var i=0; i<allPlaces.length; i++){
			bbqPlaces.push(new google.maps.LatLng(allPlaces[i].lat, allPlaces[i].lng));
		}
		initializeMapPlaces(bbqPlaces, allPlaces, 13);
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
