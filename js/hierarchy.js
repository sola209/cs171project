/**
 * Created by lware on 11/12/16.
 */


// --> CREATE SVG DRAWING AREA


var margin = {top: 40, right: 350, bottom: 20, left: 150},
    width = 1200 - margin.right - margin.left,
    height = 400 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svgTree = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("data/hierarchy.json", function(data) {
    console.log(data);
    // Referenced and adapted https://bl.ocks.org/d3noob/8326869 in parts of this code!
    root = data[0];

    // Initialize
    var nodes = tree.nodes(root),
        links = tree.links(nodes);
    console.log(nodes);
    console.log(links);
    // Nodes
    var node = svgTree.selectAll("g.node")
        .data(nodes, function(d) {
            return d.id || (d.id = ++i); });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            console.log(d.name)
            if (d.name=="Organ Trade") {d.x+=60};
            return "translate(" + d.y+ "," + d.x  + ")"; })
        ;

    nodeEnter.append("circle")
        .attr("r", 10)
        .attr("fill", function(d) {
            return d.children ? "white" : "steelblue"
        });
    nodeEnter.append("text")
        .attr("x", function(d) {
            return d.depth<2 ? 0 : 20; })
        .attr("dy", function(d) {
            if (d.depth<2) {return "-1.5em"}
            else {return "0.35em"}})
        .style("text-anchor", function(d) {
            return d.depth<2 ? "middle" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);

    // Links
    var link = svgTree.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal);

});
