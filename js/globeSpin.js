

$("[data-media]").on("click", function(e) {
    e.preventDefault();
    var $this = $(this);
    var videoUrl = $this.attr("data-media");
    var popup = $this.attr("href");
    var $popupIframe = $(popup).find("iframe");

    $popupIframe.attr("src", videoUrl);

    $this.closest(".page").addClass("show-popup");
});

$(".popup").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    $(".page").removeClass("show-popup");
});

$(".popup > iframe").on("click", function(e) {
    e.stopPropagation();
});



$('.myPopover').popover({trigger: "hover", placement: 'bottom', html: true});


var divs = $('div[id^="content-"]').hide();
var globeTextTransition = 700;

GlobeSpin = function(_world, _globeData, _parentElement){
    this.world = _world;
    this.globeData = _globeData;
    this.parentElement = _parentElement;

    this.initVis();
}


GlobeSpin.prototype.initVis = function() {
    var vis = this;
    vis.width = 500;
    vis.height = 500;
    vis.transitionSpeed = 4000;

    vis.projection = d3.geo.orthographic()
        .translate([vis.width / 2, vis.height / 2])
        .scale(vis.width / 2 - 20)
        .clipAngle(90)
        .precision(.6);
    vis.canvas = d3.select(vis.parentElement).append("canvas")
        .attr("width", vis.width)
        .attr("height", vis.height);
    vis.c = vis.canvas.node().getContext("2d");
    vis.path = d3.geo.path()
        .projection(vis.projection)
        .context(vis.c);


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

    d3.select(self.frameElement).style("height", vis.height + "px");
    this.updateVis();



};

GlobeSpin.prototype.updateVis = function() {
    var vis = this;


    divs.eq(vis.i).fadeOut(globeTextTransition);


    vis.i = vis.i+1;
    if (vis.i >= vis.names.length){
        vis.i = 0;
    }



    d3.transition()
        .duration(vis.transitionSpeed)
        .tween("rotate", function () {
            vis.p = d3.geo.centroid(vis.names[vis.i].geoData),
                vis.r = d3.interpolate(vis.projection.rotate(), [-vis.p[0], -vis.p[1]]);
            return function (t) {
                vis.projection.rotate(vis.r(t));
                vis.c.clearRect(0, 0, vis.width, vis.height * 2);
                vis.c.fillStyle = "#ccc", vis.c.beginPath(), vis.path(vis.land), vis.c.fill();
                vis.c.fillStyle = "#762a23", vis.c.beginPath(), vis.path(vis.names[vis.i].geoData), vis.c.fill();
                vis.c.strokeStyle = "#000", vis.c.lineWidth = .5, vis.c.beginPath(), vis.path(vis.borders), vis.c.stroke();
                vis.c.strokeStyle = "#ccc", vis.c.lineWidth = 2, vis.c.beginPath(), vis.path(vis.globe), vis.c.stroke();
            };
        })
        .transition();
        /*.each("end", Temp);*/

    divs.eq(vis.i).delay(globeTextTransition);
    divs.eq(vis.i).fadeIn(globeTextTransition);



};

GlobeSpin.prototype.prevUpdateVis = function() {

    var vis = this;

    divs.eq(vis.i).fadeOut(globeTextTransition);

    vis.i = vis.i-1;
    if (vis.i <0){
        vis.i = vis.names.length-1;
    }


    d3.transition()
        .duration(vis.transitionSpeed)
        .tween("rotate", function () {
            vis.p = d3.geo.centroid(vis.names[vis.i].geoData),
                vis.r = d3.interpolate(vis.projection.rotate(), [-vis.p[0], -vis.p[1]]);
            return function (t) {
                vis.projection.rotate(vis.r(t));
                vis.c.clearRect(0, 0, vis.width, vis.height * 2);
                vis.c.fillStyle = "#ccc", vis.c.beginPath(), vis.path(vis.land), vis.c.fill();
                vis.c.fillStyle = "#762a23", vis.c.beginPath(), vis.path(vis.names[vis.i].geoData), vis.c.fill();
                vis.c.strokeStyle = "#000", vis.c.lineWidth = .5, vis.c.beginPath(), vis.path(vis.borders), vis.c.stroke();
                vis.c.strokeStyle = "#ccc", vis.c.lineWidth = 2, vis.c.beginPath(), vis.path(vis.globe), vis.c.stroke();
            };
        })
        .transition();

    divs.eq(vis.i).delay(globeTextTransition);
    divs.eq(vis.i).fadeIn(globeTextTransition);


};






/*  Used http://bl.ocks.org/mbostock/4183330  as a guide*/