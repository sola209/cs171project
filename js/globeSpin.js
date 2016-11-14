


GlobeSpin = function(_world, _globeData){
    this.world = _world;
    this.globeData = _globeData;

    this.initVis();
}


GlobeSpin.prototype.initVis = function() {
    var vis = this;

    vis.width = 500,
        vis.height = 500;

    vis.projection = d3.geo.orthographic()
        .translate([vis.width / 2, vis.height / 2])
        .scale(vis.width / 2 - 20)
        .clipAngle(90)
        .precision(0.6);
    vis.canvas = d3.select("#globe-area").append("canvas")
        .attr("width", vis.width)
        .attr("height", vis.height);
    vis.c = vis.canvas.node().getContext("2d");
    vis.path = d3.geo.path()
        .projection(vis.projection)
        .context(vis.c);
    vis.title = d3.select("h5");
    vis.title2 = d3.select("h6");
    vis.theImage = d3.select("#globeImage");


    vis.names = vis.globeData.countryQuotes;

    vis.countries = topojson.feature(vis.world, vis.world.objects.countries).features;
    vis.globe = {type: "Sphere"},
        vis.land = topojson.feature(vis.world, vis.world.objects.land),
        vis.borders = topojson.mesh(vis.world, vis.world.objects.countries, function (a, b) {
            return a !== b;
        }),
        vis.i = -1,

        vis.countries = vis.countries.filter(function (d) {
            return vis.names.some(function (n) {
                if (d.id == n.id) {
                    n.geoData = d;
                    return d.name = n.name;
                }


            });
        });


    vis.n = vis.names.length;
    // console.log(vis.names);

    (function transition() {
        d3.transition()
            .duration(5000)
            .each("start", function () {
                vis.title.text(vis.names[vis.i = (vis.i + 1) % vis.n].name);
                vis.title2.text(vis.names[vis.i % vis.n].quote);
                vis.myString = vis.names[vis.i % vis.n].image;
                document.getElementById('globeImage').src = vis.myString;
            })
            .tween("rotate", function () {
                vis.p = d3.geo.centroid(vis.names[vis.i].geoData),
                    vis.r = d3.interpolate(vis.projection.rotate(), [-vis.p[0], -vis.p[1]]);
                return function (t) {
                    vis.projection.rotate(vis.r(t));
                    vis.c.clearRect(0, 0, vis.width, vis.height * 2);
                    vis.c.fillStyle = "#ccc", vis.c.beginPath(), vis.path(vis.land), vis.c.fill();
                    vis.c.fillStyle = "#f00", vis.c.beginPath(), vis.path(vis.names[vis.i].geoData), vis.c.fill();
                    vis.c.strokeStyle = "#fff", vis.c.lineWidth = .5, vis.c.beginPath(), vis.path(vis.borders), vis.c.stroke();
                    vis.c.strokeStyle = "#000", vis.c.lineWidth = 2, vis.c.beginPath(), vis.path(vis.globe), vis.c.stroke();
                };
            })
            .transition()
            .each("end", transition);

    })();


    d3.select(self.frameElement).style("height", vis.height + "px");
}


/*  Used http://bl.ocks.org/mbostock/4183330  as a guide*/