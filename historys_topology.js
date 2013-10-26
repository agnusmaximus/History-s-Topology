SEARCH_URL = "https://www.googleapis.com/freebase/v1/mqlread";
//API_KEY = "AIzaSyBBJoStIWMWfWkgHIoRtLCCAg8B4ay2Vk8";
API_KEY = "AIzaSyAyqIl8LzNg9Gs5uMGIeb0TCs2CXrgHy3o";
QUERY_TIME_INTERVAL = 100;

central_figure_src = undefined;

//Graph that stores everything
var graph = {
    "nodes" : [

    ],
    "links" : [

    ]
}

//Typeahead search for the search bar
$(function() {
    $("#search").suggest({
	key : API_KEY,
	filter:'(all type:/people/person)'
    })
	.bind("fb-select", function(e, data) {
	    select_historical_figure(data, 0);
	    $("#search").val("");
	});
});

//Get figure information from the freebase api
function get_figure_info(query, callback) {
    query_string = JSON.stringify(query);
    
    $.ajax({
	type : "GET",
	url : SEARCH_URL + "?query=" + query_string,
	data : {filter : "(any type:/people/person)", key : API_KEY,}
    })
	.done(function(data) {
	    callback(data);
	});
}

//Selects a historical figure from the input
function select_historical_figure(data, count) {
    //Make sure don't recurse past a depth of 1
    if (count > 1)
	return;

    //Get figure info
    get_figure_info({"id" : data.id, 
		     "name" : null, 
		     "*" : null,
		     "/influence/influence_node/influenced": [{}],
		    },
		    function(data) {
			create_historical_nodes(data, count);
		    });
}

//Called when node is pressed
function node_function(node) {
    //console.log("Pressed: ", node);
}

//perform select historical figure recursively
function select_historical_figure_recursive(figures, count, depth_count) {
    if (count < figures.length) {
	
	select_historical_figure(figures[count], depth_count);
	
	setTimeout(function() {
	    select_historical_figure_recursive(figures, count+1, depth_count);
	}, QUERY_TIME_INTERVAL);
    }
}

//Creates nodes that represent historical figures
function create_historical_nodes(figure_info, count) {
    name = figure_info.result.name;
    in_graph = -1;
    
    //Check if figure already in graph	
    for (i = 0; i < graph.nodes.length; i++) {
	if (graph.nodes[i].name == name) {
	    in_graph = i;
	    break;
	}
    }

    //Keep track of the central figure
    if (count == 0) {
	central_figure_src = graph.nodes.length;
	
	if (in_graph != -1) {
	    central_figure_src = in_graph;
	}
    }
    //Add a link from the central figure to the current figure
    else {
	
	if (in_graph == -1)
	    graph.links.push({"source" : central_figure_src, "target" : graph.nodes.length, "value" : 1});
	else
	    graph.links.push({"source" : central_figure_src, "target" : in_graph, "value" : 1});
    }
    
    if (in_graph == -1)
	//Add the current node to the graph
	graph.nodes.push({"info":figure_info.result,
			  "name":name,
			  "function":node_function});
    
    related_figures = figure_info.result["/influence/influence_node/influenced"] 

    //Recurse on related figures
    setTimeout(function() {
	select_historical_figure_recursive(related_figures, 0, count+1);
    }, QUERY_TIME_INTERVAL);

    draw_graph(graph);
}
