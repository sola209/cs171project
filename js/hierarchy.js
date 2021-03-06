Hierarchy = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;
	this.initVis();
}

Hierarchy.prototype.initVis = function(){
	var vis = this;

	vis.margin = {top: 40, right: 200, bottom: 40, left: 100},
	    vis.width = 750 - vis.margin.right - vis.margin.left,
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
    // console.log(vis.nodes);
    // console.log(vis.links);
    // Nodes
    vis.node = vis.svgTree.selectAll("g.node")
        .data(vis.nodes, function (d) {
            return d.id || (d.id = ++vis.i);
        });

    vis.nodeEnter = vis.node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                // console.log(d.name)
                if (d.name == "Organ Trade") {
                    d.x += 60
                }
                ;
                return "translate(" + d.y + "," + d.x + ")";
            })
        ;

    vis.ring = vis.nodeEnter.append("circle")
        .attr("class", "ring")
        .attr("r", 12)
        .attr("fill", 'white');

    vis.circles = vis.nodeEnter.append("circle")
        .attr("r", 10)
        .attr("fill", function (d) {
            return "rgba(186, 20, 53, 0.96)"
        })

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

    //vis.svg.on('mouseover', vis.blink);
    vis.circles.on('mouseover', vis.updateDescription)
        .on("mouseout", vis.handleMouseout);
   // vis.node.on("mouseover", vis.showDescription);
}
Hierarchy.prototype.blink = function() {
    for (i = 0; i != 30; i++) {
        $('.ring').fadeTo(500, 0.1).fadeTo(1500, 5.0);

    }
}
Hierarchy.prototype.updateDescription = function(d){

    d3.select(this).attr({
        fill: "white"
    })


    var summaryData = "<br><br><h2>"+d.name+"</h2><br>" + "<div id='definition'>" + d.description + "</div>";
    document.getElementById("summary-data").innerHTML = summaryData;

}
Hierarchy.prototype.handleMouseout = function(d){

    d3.select(this).attr({
        fill: "rgba(186, 20, 53, 0.96)"
    });

}
Hierarchy.prototype.showDescription = function(d){
    d3.select(this).append("text")
        .attr("x", function (d) {
            return 200;
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
            return d.description;
        })
        .style("fill-opacity", 1);


}

