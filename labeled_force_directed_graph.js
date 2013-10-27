var width = 900, height = 450;
var color = d3.scale.category20();
var force = d3.layout.force()
    .charge(-520)
    .linkDistance(120)
    .size([width, height]);
var svg = d3.select(".visualize").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all")
    .append("svg:g")
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append("svg:g");

svg.append('svg:rect')
    .attr('x', -width * 1000 / 2)
    .attr('y', -height * 1000 / 2)
    .attr('width', width * 1000)
    .attr('height', height * 1000)
    .attr('fill', 'white');

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
	.attr("r", 10)
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

function redraw() {
  svg.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
}
