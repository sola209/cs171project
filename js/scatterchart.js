
// --> CREATE SVG DRAWING AREA

ScatterChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data.slice(0);
    this.displayData = [];

    this.initVis();
}

ScatterChart.prototype.initVis = function() {

    tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });

    var vis = this;

    vis.margin = { top: 40, right: 0, bottom: 90, left: 60 };
    vis.width = 700 - vis.margin.left - vis.margin.right;
    vis.height = 600 - vis.margin.top - vis.margin.bottom;
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.svg.call(tip);

    // Analyze the dataset in the web console
    // console.log(vis.data);
    // console.log("Countries: " + vis.data.length);


    vis.xScale = d3.scale.linear()
        .range([80, vis.width - 80])
        .clamp(true);

    vis.xScaleLog = d3.scale.log()
        .range([0, vis.width]);

    vis.yScale = d3.scale.linear()
        .range([vis.height - 60, 60])
        .clamp(true);

    vis.popScale = d3.scale.linear()
        .range([4, 30])
        .clamp(true);

    vis.colorScale = d3.scale.category20();

    vis.xAxis = d3.svg.axis()
        .scale(vis.xScale)
        .orient("bottom");

    // Create a generic axis function
    vis.yAxis = d3.svg.axis()
        .scale(vis.yScale)
        .orient("left");

    vis.svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(10,250)rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Government Response Score (/100)");

    vis.svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(350,565)")  // centre below axis
        .text("% of Population in Modern Slavery");

    vis.svg.call(tip);

    vis.wrangleData();

}

ScatterChart.prototype.wrangleData = function(){

    var vis = this;

    vis.data_filtered = vis.data.filter(function (d) {
        return d["EST_POP_SLAVERY"] != "no data" && d["Total score (/100)"] != "no data"
    });

    if (d3.select("#attribute-type").property("value") == "Russia_Eurasia") {
        // console.log('hi');
        vis.data_filtered = vis.data_filtered.filter(function (d) {
            return d["GEOGRAPHIC_REGION"] == "Russia & Eurasia"
        })
    }
    ;
    if (d3.select("#attribute-type").property("value") == "Europe") {
        vis.data_filtered = vis.data_filtered.filter(function (d) {
            return d["GEOGRAPHIC_REGION"] == "Europe"
        })
    }
    ;
    if (d3.select("#attribute-type").property("value") == "Americas") {
        vis.data_filtered = vis.data_filtered.filter(function (d) {
            return d["GEOGRAPHIC_REGION"] == "Americas"
        })
    }
    ;
    if (d3.select("#attribute-type").property("value") == "Middle_East_North_Africa") {
        vis.data_filtered = vis.data_filtered.filter(function (d) {
            return d["GEOGRAPHIC_REGION"] == "Middle East & North Africa"
        })
    }
    ;
    if (d3.select("#attribute-type").property("value") == "Asia") {
        vis.data_filtered = vis.data_filtered.filter(function (d) {
            return d["GEOGRAPHIC_REGION"] == "Asia"
        })
    }
    ;
    if (d3.select("#attribute-type").property("value") == "Subsaharan_Africa") {
        vis.data_filtered = vis.data_filtered.filter(function (d) {
            return d["GEOGRAPHIC_REGION"] == "Sub-Saharan Africa"
        })
    }
    ;

    // console.log(vis.data.length);
    // console.log(vis.data_filtered.length);

    vis.data_clean = vis.data_filtered.map(function (d) {
        var _d = [d.Country,
            +d["EST_POP_SLAVERY"],
            +d["Total score (/100)"],
            d["POPULATION"],//.replace(/\,/g, ''),
            d["GEOGRAPHIC_REGION"],
            d["GOVERNMENT RESPONSE RANK"]];
        // console.log(_d);
        return _d;
    });

    vis.data_clean = vis.data_clean.sort(function (a, b) {
        return b[3] - a[3];
    })

    // console.log(vis.data_clean);
    vis.updateVis();

};

ScatterChart.prototype.updateVis = function() {

    var vis = this;

    vis.xScale.domain(d3.extent(vis.data_clean, function (d) { return d[1]; }));
    vis.xScaleLog.domain(d3.extent(vis.data_clean, function (d) { return d[1]; }));
    vis.yScale.domain(d3.extent(vis.data_clean, function (d) { return d[2]; }));
    vis.popScale.domain(d3.extent(vis.data_clean, function (d) { return d[3]; }));

    var yaxis_page = vis.svg.selectAll(".baryaxis").data(vis.data_clean);

    yaxis_page.enter().append("g").attr("class","baryaxis");

    yaxis_page
        .transition()
        .duration(800)
        .attr("class","baryaxis")
        .attr("transform","translate(45,0)")
        .call(vis.yAxis);

    yaxis_page.exit().remove();

    var xaxis_page = vis.svg.selectAll(".barxaxis").data(vis.data_clean);

    xaxis_page.enter().append("g").attr("class","baryxxis");

    xaxis_page
        .transition()
        .duration(800)
        .attr("class","barxaxis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis)
        .selectAll("text")
        .attr("y", 20)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "translate(0, 27)rotate(90)");

    xaxis_page.exit().remove();

    circles = vis.svg.selectAll("circle").data(vis.data_clean);

    circles.enter().append("circle");

    circles
        .attr("fill", function (d) {
            return vis.colorScale(d[4])
        })
        .attr("r", function (d) {
            return vis.popScale(d[3])
        })
        .attr("stroke", "black")
        .attr("cy", function (d) {
            return vis.yScale(d[2])
        })
        .attr("cx", function (d) {
            return vis.xScale(d[1])
        })
        .attr("data-legend", function (d) {
            return d[4]
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    circles.exit().remove();


    vis.legend = vis.svg.selectAll(".legend2").data(vis.data_clean);

    vis.legend.enter().append("g").attr("class", "legend2");

    vis.legend
        .transition()
        .duration(800)
        .attr("transform", "translate(350,100)")
        .style("font-size", "12px");
        // .call(d3.legend);

    vis.legend.exit().remove();

    tip.html(function (d) {
        return "<font color='red'>Country: </font>" + d[0] + "<br/>" +
            "Population: " + d[3] + "<br/>" +
            "% in Modern Slavery: " + d[1] + "<br/>" +
            "Government response score (/100): " + d[2] + "<br/>" +
            "Government response global rank: " + d[5];
    });

};