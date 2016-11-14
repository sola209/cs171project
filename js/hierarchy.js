Hierarchy = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;
	this.initVis();
}

Hierarchy.prototype.initVis = function(){
	var vis = this;

	vis.margin = {top: 40, right: 350, bottom: 20, left: 150},
	    vis.width = 1200 - vis.margin.right - vis.margin.left,
	    vis.height = 400 - vis.margin.top - vis.margin.bottom;

	vis.i = 0;

	vis.tree = d3.layout.tree()
	    .size([vis.height, vis.width]);

	vis.diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	vis.svg = d3.select("#tree").append("svg")
	    .attr("width", vis.width + vis.margin.right + vis.margin.left)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

	vis.svgTree = vis.svg.append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Create tooltips
    vis.myTip = d3.tip().attr('class', 'd3-tip').html(function (d) {
        return "<strong><span >" + d.description + "</strong></span>";

    });
    vis.svg.call(vis.myTip);



	vis.wrangleData();
}

Hierarchy.prototype.wrangleData = function(){
	var vis = this;


	vis.updateVis();
}

Hierarchy.prototype.updateVis = function(){
	var vis = this;

// Referenced and adapted https://bl.ocks.org/d3noob/8326869 in parts of this code!
    vis.root = vis.data[0];

    // Initialize
    vis.nodes = vis.tree.nodes(vis.root),
        vis.links = vis.tree.links(vis.nodes);
    console.log(vis.nodes);
    console.log(vis.links);
    // Nodes
    vis.node = vis.svgTree.selectAll("g.node")
        .data(vis.nodes, function (d) {
            return d.id || (d.id = ++vis.i);
        });

    vis.nodeEnter = vis.node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                console.log(d.name)
                if (d.name == "Organ Trade") {
                    d.x += 60
                }
                ;
                return "translate(" + d.y + "," + d.x + ")";
            })
        ;

    vis.nodeEnter.append("circle")
        .attr("r", 10)
        .attr("fill", function (d) {
            return d.children ? "white" : "steelblue"
        });
    vis.nodeEnter.append("text")
        .attr("x", function (d) {
            return d.depth < 2 ? 0 : 20;
        })
        .attr("dy", function (d) {
            if (d.depth < 2) {
                return "-1.5em"
            }
            else {
                return "0.35em"
            }
        })
        .style("text-anchor", function (d) {
            return d.depth < 2 ? "middle" : "start";
        })
        .text(function (d) {
            return d.name;
        })
        .style("fill-opacity", 1);

    // Links
    vis.link = vis.svgTree.selectAll("path.link")
        .data(vis.links, function (d) {
            return d.target.id;
        });

    vis.link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", vis.diagonal);

    vis.node.on('mouseover', vis.myTip.show)
        .on('mouseout', vis.myTip.hide);
	
}

	