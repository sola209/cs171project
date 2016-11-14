


var width = 500,
    height = 500;

var countries;
var projection = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .scale(width / 2 - 20)
    .clipAngle(90)
    .precision(0.6);
var canvas = d3.select("#map-area").append("canvas")
    .attr("width", width)
    .attr("height", height);
var c = canvas.node().getContext("2d");
var path = d3.geo.path()
    .projection(projection)
    .context(c);
var title = d3.select("h5");
var title2 = d3.select("h6");
queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.json, "data/introData.json")
    .await(ready);
function ready(error, world, intro) {
    if (error) throw error;


    var names = intro.countryQuotes;

    countries = topojson.feature(world, world.objects.countries).features;
    var globe = {type: "Sphere"},
        land = topojson.feature(world, world.objects.land),
        borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
        i = -1,

    countries = countries.filter(function(d) {
        return names.some(function(n) {
            if (d.id == n.id){
                n.geoData = d;
                return d.name = n.name;
            }


        });
    });


    n = names.length;

    (function transition() {
        d3.transition()
            .duration(5000)
            .each("start", function() {
                title.text(names[i = (i + 1) % n].name);
                title2.text(names[i % n].quote);
            })
            .tween("rotate", function() {
                var p = d3.geo.centroid(names[i].geoData),
                    r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                return function(t) {
                    projection.rotate(r(t));
                    c.clearRect(0, 0, width, 2*height);
                    c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
                    c.fillStyle = "rgba(186, 20, 53, 0.96)", c.beginPath(), path(names[i].geoData), c.fill();
                    c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
                    c.strokeStyle = "#ccc", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
                };
            })
            .transition()
            .each("end", transition);

    })();

}
d3.select(self.frameElement).style("height", height + "px");

/*  Used http://bl.ocks.org/mbostock/4183330  as a guide*/