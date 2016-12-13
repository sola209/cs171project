SlaveryBarChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data.slice(0);
	this.displayData = _data.slice(0);
	this.initVis();
}

SlaveryBarChart.prototype.initVis = function(){
	var vis = this;

	// vis.selectOption = document.getElementById("barchart-selector").value;

	// console.log(vis.data);
	vis.margin = {top: 10, right: 40, bottom: 80, left: 175};

	vis.width = 800 - vis.margin.left - vis.margin.right,
			vis.height = 500 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#slavery-barchart").append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	// Scales and axes
	vis.x = d3.scale.linear()
	    .range([0, vis.width]);

	vis.y = d3.scale.ordinal()
		.rangeRoundBands([0, vis.height], .1);

	vis.xAxis = d3.svg.axis()
	    .scale(vis.x)
	    .orient("top")

	vis.yAxis = d3.svg.axis()
		    .scale(vis.y)
		    .orient("left");

	vis.svg.append("g")
		.attr("class", "x-axis axis");

	vis.svg.append("g")
			.attr("class", "y-axis axis");

	vis.tip1 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<span style='padding: 12px; background: rgba(0, 0, 0, 0.5);'><strong>Not supported to exit: </strong><span style='color:#762a23'>" + parseInt((1-(d.EXIT_SLAVERY / 100)) * d.EST_POP_SLAVERY) + "</span></span>";
	});
	vis.tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<span style='padding: 12px; background: rgba(0, 0, 0, 0.5);'><strong>Supported to exit: </strong><span style='color:#762a23'>" + parseInt(d.EST_POP_SLAVERY * d.EXIT_SLAVERY / 100) + "</span></span>";
	});	  

	vis.svg.call(vis.tip1);
	vis.svg.call(vis.tip2);

	// // Add x-axis labels
	// vis.svg.append("text")
	//     .attr("x", vis.width / 4 )
	//     .attr("y",  -100)
	//     .attr("class", "axis-title")
	//     .style("text-anchor", "middle")
	//     .style("color", "teal")
	//     .text("Individuals Trafficked");

 //    vis.svg.append("text")
	//     .attr("x", 3*vis.width / 4 )
	//     .attr("y",  -100)
	//     .attr("class", "axis-title")
	//     .style("text-anchor", "middle")
	//     .style("color", "teal");
	//     // .text("Individuals Supported to Exit Slavery");

	vis.data.forEach(function(d) {
		d.POPULATION = parseInt(d.POPULATION.replace(/,/g, ''));
		d.EST_POP_SLAVERY = parseInt(d.EST_POP_SLAVERY.replace(/,/g, ''));
		d.EXIT_SLAVERY = parseInt(d.EXIT_SLAVERY.replace(/,/g, ''));
		d.JUSTICE = +d.JUSTICE

		if (d.Country == "Democratic Republic of the Congo") {
			d.Country = "DRC";
		}
	});

	vis.data = vis.data.filter(function(d) {
		return (!(isNaN(d.POPULATION)) && !(isNaN(d.EST_POP_SLAVERY)) && !(isNaN(d.EXIT_SLAVERY))) ;
	})

	vis.wrangleData();
}

SlaveryBarChart.prototype.wrangleData = function(){
	var vis = this;

	var divisor = document.getElementById("divisor");
	var slider = document.getElementById("slider");

	var threshold = slider.value ;

	// console.log("threshold")

	vis.displayData = vis.data.sort(function(a,b) {
		return b.EST_POP_SLAVERY - a.EST_POP_SLAVERY;
	})


	vis.displayData = vis.displayData.filter(function(d) {
		return d.EXIT_SLAVERY >= threshold;
	})

	// console.log(vis.displayData);

	vis.updateVis();
}

SlaveryBarChart.prototype.updateVis = function(){
	var vis = this;

	var format =  d3.format(",");
	var enslaved = format(d3.sum(vis.data, function(d) {
		return d.EST_POP_SLAVERY
		}));

	var exit = format(d3.sum(vis.displayData, function(d) {
		return d.EST_POP_SLAVERY * d.EXIT_SLAVERY / 100
		}));

	d3.select("#exit-pop").html(exit);
	d3.select("#enslaved-pop").html(enslaved + " people");
	d3.select("#country-count").html(vis.displayData.length + " out of " + vis.data.length + " countries");

	if(vis.displayData.length < 2) {
		console.log(vis.displayData);
	}
	vis.displayData = vis.displayData.slice(0,10);

	// console.log(vis);
	// console.log("Top update", vis.displayData);

	// vis.selectOption = document.getElementById("barchart-selector").value;
	// vis.displayVariable = vis.selectOption == "exit" ? "EXIT_SLAVERY" : "JUSTICE"

	// console.log(vis.displayVariable);

	// Update the axes
	// vis.enter_vals = vis.displayData.map(function(d) {
	// 	return d.EST_POP_SLAVERY;
	// });

	// vis.exit_vals = vis.displayData.map(function(d) {
	// 	return d.EST_POP_SLAVERY*d[vis.displayVariable]/100;
	// });

	vis.x.domain([0, 20000000]);
	vis.y.domain(vis.displayData.map(function(d) {return d.Country; }))

	// Call the axes
	vis.svg.select(".x")
		.call(vis.xAxis)
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
		.attr("x", -15);
	
	// console.log("Mid update", vis.displayData);



	// Draw rectangles
	vis.bar1 = vis.svg.selectAll(".exit")
		.data(vis.displayData);

	vis.bar1.enter().append("rect")
		.attr("x", function(d) { 
			return 0 })
		.attr("y", function(d) { return vis.y(d.Country); })
		.attr("width", function(d) { ;
			return vis.x(d.EXIT_SLAVERY * d.EST_POP_SLAVERY / 100) })
		.attr("height", vis.y.rangeBand())
		.attr("fill", "black")
		.attr("class", "exit")
		.on('mouseover', vis.tip2.show)
      	.on('mouseout', vis.tip2.hide);
  //       .on('mouseover', function(d) {
  //       	d3.select(this).style("stroke", "#e74c3c").style("stroke-width", "2");
  //       })
  //       .on('mouseout', function(d) {
  //       	d3.select(this).style("stroke", "black").style("stroke-width", "0");
  //       })
		// .on('click', function(d){ 
		// 	console.log(vis.displayVariable);
		// 	var text = (document.getElementById("barchart-selector").value == "exit") ? "only " + d.EXIT_SLAVERY + "% are supported to exit slavery." : "only " + d.JUSTICE + "% receive criminal justice responses."
		// 	d3.select("#barchart-info").html(d.Country + " has " + d.EST_POP_SLAVERY + " estimated enslaved individuals. Among them, " + text);
		//  });

	vis.bar1
		.attr("x", function(d) { 
			return 0 })
		.attr("y", function(d) { return vis.y(d.Country); })
		.attr("width", function(d) { ;
			return vis.x(d.EXIT_SLAVERY * d.EST_POP_SLAVERY / 100) })
		.attr("height", vis.y.rangeBand());

	vis.bar1.exit().remove();

	vis.bar2 = vis.svg.selectAll(".enter")
		.data(vis.displayData);

	vis.bar2.enter().append("rect")
		.attr("x", function(d) {
			return vis.x(d.EXIT_SLAVERY * d.EST_POP_SLAVERY / 100)
		})
		.attr("y", function(d) { return vis.y(d.Country); })
		.attr("width", function(d) { 
			return vis.x((1 - (d.EXIT_SLAVERY/100)) * d.EST_POP_SLAVERY ) } )
		.attr("height", vis.y.rangeBand())
		.attr("fill", "#762a23" )
		.attr("class", "enter")
		.on('mouseover', vis.tip1.show)
      	.on('mouseout', vis.tip1.hide);
  //       .on('mouseover', function(d) {
  //       	d3.select(this).style("stroke", "#e74c3c").style("stroke-width", "2");
  //       })
  //       .on('mouseout', function(d) {
  //       	d3.select(this).style("stroke", "black").style("stroke-width", "0");
  //       })
		// .on('click', function(d){ 
		// 	console.log(vis.displayVariable);
		// 	var text = (document.getElementById("barchart-selector").value == "exit") ? "only " + d.EXIT_SLAVERY + "% are supported to exit slavery." : "only " + d.JUSTICE + "% receive criminal justice responses."
		// 	d3.select("#barchart-info").html(d.Country + " has " + d.EST_POP_SLAVERY + " estimated enslaved individuals. Among them, " + text);
		//  });

	vis.bar2
		.attr("x", function(d) {
			return vis.x(d.EXIT_SLAVERY * d.EST_POP_SLAVERY / 100)
		})
		.attr("y", function(d) { return vis.y(d.Country); })
		.attr("width", function(d) { 
			return vis.x((1 - (d.EXIT_SLAVERY/100)) * d.EST_POP_SLAVERY ) } )
		.attr("height", vis.y.rangeBand());

	vis.bar2.exit().remove();
	// console.log("End of update", vis.displayData);
}
