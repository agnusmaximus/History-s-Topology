Search_URL = "https://www.googleapis.com/freebase/v1/search"
SEARCH_URL = "https://www.googleapis.com/freebase/v1/mqlread"
API_KEY = "AIzaSyBBJoStIWMWfWkgHIoRtLCCAg8B4ay2Vk8"

//Typeahead search for the search bar
$(function() {
    $("#search").suggest({
	key : API_KEY,
    })
	.bind("fb-select", function(e, data) {
	    select_historical_figure(data);
	    $("#search").val("");
	});
});

//Get figure information from the freebase api
function get_figure_info(query, callback) {
    query_string = JSON.stringify(query);
    
    console.log(SEARCH_URL + "?query=" + query_string);
    
    $.ajax({
	type : "GET",
	url : SEARCH_URL + "?query=" + query_string, 
	key : API_KEY,
	data : {}
    })
	.done(function(data) {
	    callback(data);
	});
}

//Selects a historical figure from the input
function select_historical_figure(data) {
    get_figure_info({"id" : data.id, "name" : null, "*" : null},
		    create_historical_nodes);
}

//Graph that stores everything
var graph = {
    "nodes" : [

    ],
    "links" : [

    ]
}

//Called when node is pressed
function node_function(node) {
    console.log("Pressed: ", node);
}

//Creates nodes that represent historical figures
function create_historical_nodes(figure_info) {
    console.log(figure_info);
    name = figure_info.result.name;
    graph.nodes.push({"name":name,"function": node_function});
    draw_graph(graph);
}
