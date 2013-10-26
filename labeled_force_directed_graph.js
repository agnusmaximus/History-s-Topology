var width = 700, height = 450;
var color = d3.scale.category20();
var force = d3.layout.force()
    .charge(-1020)
    .linkDistance(30)
    .size([width, height]);
var svg = d3.select(".visualize").append("svg")
    .attr("width", width)
    .attr("height", height);

var link, gnodes, node, labels;

var draw_graph = function(graph) {
    force
	.nodes(graph.nodes)
	.links(graph.links)
	.start();

    if (link != undefined)
	link.remove();
    if (gnodes != undefined)
	gnodes.remove();
    if (node != undefined)
	node.remove();
    if (labels != undefined)
	labels.remove();
    
    link = svg.selectAll(".link")
	.data(graph.links)
	.enter().append("line")
	.attr("class", "link")
	.style("stroke-width", function(d) { return Math.sqrt(d.value); });
    
    gnodes = svg.selectAll('g.gnode')
	.data(graph.nodes)
	.enter()
	.append('g')
	.classed('gnode', true);
    
    node = gnodes.append("circle")
	.attr("class", "node")
	.attr("r", 20)
	.style("fill", function(d) { return color(d.group); })
	.call(force.drag)
	.on("click", function(d) { if (d.hasOwnProperty("function")) d.function(d)});
    
    labels = gnodes.append("text")
	.text(function(d) { return d.name; })
	.style("font-family", "Verdana")
	.style("fill", "orange");
    
    force.on("tick", function() {
	link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
	
	gnodes.attr("transform", function(d) { 
            return 'translate(' + [d.x, d.y] + ')'; 
	});
    });
};