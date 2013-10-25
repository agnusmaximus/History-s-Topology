SEARCH_URL = "https://www.googleapis.com/freebase/v1/search"
API_KEY = "AIzaSyBBJoStIWMWfWkgHIoRtLCCAg8B4ay2Vk8"

//Typeahead search for the search bar
$(function() {
    $("#search").suggest({
	key : API_KEY
    });
});

//Get figure information from the freebase api
function get_figure_info(name, callback) {
    $.ajax({
	type : "GET",
	url : SEARCH_URL, 
	data : {"query" : name}
    })
	.done(function(data) {
	    callback(data);
	});
}

