SlaveryBarChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data.slice(0);
	this.displayData = _data.slice(0);
	this.initVis();
}

SlaveryBarChart.prototype.initVis = function(){
	var vis = this;

	vis.selectOption = document.getElementById("barchart-selector").value;

	// console.log(vis.data);
	vis.margin = {top: 140, right: 40, bottom: 40, left: 60};

	vis.width = 800 - vis.margin.left - vis.margin.right,
			vis.height = 500 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#slavery-barchart").append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales and axes
	vis.x1 = d3.scale.linear()
	    .range([vis.width/2, 0]);

	console.log(vis.x1);

	vis.x2 = d3.scale.linear()
	    .range([vis.width/2, vis.width]);

	vis.y = d3.scale.ordinal()
		.rangeRoundBands([0, vis.height], .1);

	vis.xAxis1 = d3.svg.axis()
	    .scale(vis.x1)
	    .orient("top")

	vis.xAxis2 = d3.svg.axis()
	    .scale(vis.x2)
	    .orient("top")

	vis.yAxis = d3.svg.axis()
		    .scale(vis.y)
		    .orient("left");

	vis.svg.append("g")
		.attr("class", "x-axis axis x1");

	vis.svg.append("g")
		.attr("class", "x-axis axis x2");

	vis.svg.append("g")
			.attr("class", "y-axis axis")
			.attr("transform", "translate(" + vis.width/2 + "," + 0 + ")");


	// Add x-axis labels
	vis.svg.append("text")
	    .attr("x", vis.width / 4 )
	    .attr("y",  -100)
	    .attr("class", "axis-title")
	    .style("text-anchor", "middle")
	    .style("color", "teal")
	    .text("Individuals Trafficked");

    vis.svg.append("text")
	    .attr("x", 3*vis.width / 4 )
	    .attr("y",  -100)
	    .attr("class", "axis-title")
	    .style("text-anchor", "middle")
	    .style("color", "teal");
	    // .text("Individuals Supported to Exit Slavery");


	vis.wrangleData();
}

SlaveryBarChart.prototype.wrangleData = function(){
	var vis = this;

	vis.data.forEach(function(d) {
		d.POPULATION = parseInt(d.POPULATION.replace(/,/g, ''));
		d.EST_POP_SLAVERY = parseInt(d.EST_POP_SLAVERY.replace(/,/g, ''));
		d.EXIT_SLAVERY = parseInt(d.EXIT_SLAVERY.replace(/,/g, ''));
		d.JUSTICE = +d.JUSTICE
	});

	vis.displayData = vis.data.filter(function(d) {
		return (!(isNaN(d.POPULATION)) && !(isNaN(d.EST_POP_SLAVERY)) && !(isNaN(d.EXIT_SLAVERY))) ;
	})

	vis.displayData = vis.displayData.sort(function(a,b) {
		return b.EST_POP_SLAVERY - a.EST_POP_SLAVERY;
	})

	vis.displayData = vis.displayData.slice(1,6);
	// console.log(vis.displayData);

	vis.updateVis();
}

SlaveryBarChart.prototype.updateVis = function(){
	var vis = this;
	d3.select("#barchart-info").html("");

	// console.log(vis);
	// console.log("Top update", vis.displayData);

	vis.selectOption = document.getElementById("barchart-selector").value;
	vis.displayVariable = vis.selectOption == "exit" ? "EXIT_SLAVERY" : "JUSTICE"

	console.log(vis.displayVariable);

	// Update the axes
	vis.enter_vals = vis.displayData.map(function(d) {
		return d.EST_POP_SLAVERY;
	});

	vis.exit_vals = vis.displayData.map(function(d) {
		return d.EST_POP_SLAVERY*d[vis.displayVariable]/100;
	});

	vis.x1.domain([0, d3.max(vis.enter_vals)]);
	vis.x2.domain([0, d3.max(vis.enter_vals)]);
	vis.y.domain(vis.displayData.map(function(d) {return d.Country; }))

	// Call the axes
	vis.svg.select(".x1")
		.call(vis.xAxis1)
		.selectAll("text")
	    .attr("y", 0)
	    .attr("x", 9)
	    .attr("dy", ".35em")
	    .attr("transform", "rotate(-90)")
	    .style("text-anchor", "start");
	vis.svg.select(".x2")
		.call(vis.xAxis2)
		.selectAll("text")
	    .attr("y", 0)
	    .attr("x", 9)
	    .attr("dy", ".35em")
	    .attr("transform", "rotate(-90)")
	    .style("text-anchor", "start");
	vis.svg.select(".y-axis")
		.call(vis.yAxis);

	// Move the y axis labels over to the right
	vis.svg.selectAll(".y-axis text")
		.attr("x", vis.width/2-20);
	
	// console.log("Mid update", vis.displayData);


	// Patterns for the background of the bars (stick men)
	var widthOffset = -2
	var heightOffset = 8
	vis.svg.append("defs")
		.append("pattern")
		.attr("id", "bg")
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', vis.y.rangeBand()-widthOffset)
		.attr('height', vis.y.rangeBand()+heightOffset)
		.append("image")
		.attr("xlink:href", "img/stick-figure.png")
		.attr('width', vis.y.rangeBand()-widthOffset)
		.attr('height', vis.y.rangeBand()+heightOffset);

	vis.svg.append("defs")
		.append("pattern")
		.attr("id", "bg2")
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', vis.y.rangeBand()-widthOffset)
		.attr('height', vis.y.rangeBand()+heightOffset)
		.append("image")
		.attr("xlink:href", "img/stick-figure-blue.png")
		.attr('width', vis.y.rangeBand()-widthOffset)
		.attr('height', vis.y.rangeBand()+heightOffset);

	// Draw rectangles
	vis.bar1 = vis.svg.selectAll(".enter")
		.data(vis.displayData);

	vis.bar1.enter().append("rect")
		.attr("x", function(d) { 
			// console.log("should be drawing a rect...")
			return vis.x1(d.EST_POP_SLAVERY) })
		.attr("y", function(d) { return vis.y(d.Country); })
		.attr("width", function(d) { 
			var val = vis.width/2 - vis.x1(d.EST_POP_SLAVERY);
			return isNaN(val) ? 0 : val; })
		.attr("height", vis.y.rangeBand())
		.attr("fill", "url(#bg)")
		.attr("class", "enter")
        .on('mouseover', function(d) {
        	d3.select(this).style("stroke", "#e74c3c").style("stroke-width", "2");
        })
        .on('mouseout', function(d) {
        	d3.select(this).style("stroke", "black").style("stroke-width", "0");
        })
		.on('click', function(d){ 
			console.log(vis.displayVariable);
			var text = (document.getElementById("barchart-selector").value == "exit") ? "only " + d.EXIT_SLAVERY + "% are supported to exit slavery." : "only " + d.JUSTICE + "% receive criminal justice responses."
			d3.select("#barchart-info").html(d.Country + " has " + d.EST_POP_SLAVERY + " estimated enslaved individuals. Among them, " + text);
		 });

	vis.bar1
		.attr("x", function(d) { 
			// console.log("should be drawing a rect...")
			return vis.x1(d.EST_POP_SLAVERY) })
		.attr("y", function(d) { return vis.y(d.Country); })
		.attr("width", function(d) { 
			var val = vis.width/2 - vis.x1(d.EST_POP_SLAVERY);
			return isNaN(val) ? 0 : val; })
		.attr("height", vis.y.rangeBand())
		.attr("fill", "url(#bg)")
		.attr("class", "enter");

	vis.bar1.exit().remove();

	vis.bar2 = vis.svg.selectAll(".exit")
		.data(vis.displayData);

	vis.bar2.enter().append("rect")
		.attr("x", vis.width/2)
		.attr("y", function(d) { return vis.y(d.Country); })
		.attr("width", function(d) { 
			var val = vis.x2(d.EST_POP_SLAVERY*d[vis.displayVariable] / 100) - vis.width/2;
			return isNaN(val) ? 0 : val; })
		.attr("height", vis.y.rangeBand())
		.attr("fill", "url(#bg2)" )
		.attr("class", "exit")
        .on('mouseover', function(d) {
        	d3.select(this).style("stroke", "#e74c3c").style("stroke-width", "2");
        })
        .on('mouseout', function(d) {
        	d3.select(this).style("stroke", "black").style("stroke-width", "0");
        })
		.on('click', function(d){ 
			console.log(vis.displayVariable);
			var text = (document.getElementById("barchart-selector").value == "exit") ? "only " + d.EXIT_SLAVERY + "% are supported to exit slavery." : "only " + d.JUSTICE + "% receive criminal justice responses."
			d3.select("#barchart-info").html(d.Country + " has " + d.EST_POP_SLAVERY + " estimated enslaved individuals. Among them, " + text);
		 });

	vis.bar2.enter().append("rect")
		.attr("x", vis.width/2)
		.attr("y", function(d) { return vis.y(d.Country); })
		.attr("width", function(d) { 
			var val = vis.x2(d.EST_POP_SLAVERY*d[vis.displayVariable] / 100) - vis.width/2;
			return isNaN(val) ? 0 : val; })
		.attr("height", vis.y.rangeBand())
		.attr("fill", "url(#bg2)" )
		.attr("class", "exit");

	vis.bar2.exit().remove();
	// console.log("End of update", vis.displayData);
}
