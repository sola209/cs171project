var globeSpin;
var slaveryBarchart; 

queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.json, "data/globeSpin.json")
    .defer(d3.csv, "data/trafficking.csv")
    .defer(d3.json, "data/hierarchy.json")
    .defer(d3.csv, 'data/trafficking-nodes.csv')
    .defer(d3.csv, 'data/trafficking-flows.csv')


    .await(ready);

function ready(error, world, globeData, gsi, hierarchy, nodes, flows) {
    if (error) throw error;


    globeSpin = new GlobeSpin(world, globeData, "#globe-area");
    var hierarchy = new Hierarchy("tree", hierarchy);
    slaveryBarChart = new SlaveryBarChart("slavery-barchart", gsi);
    var scatterchart = new ScatterChart("vis-area", gsi);

    d3.select("#attribute-type").on("change", scatterchart.wrangleData());
    var flowMap = new FlowMap("#flow", [world, nodes, flows]);
    var countryInfo =
    // Update the visualization
    $( '.flow-select' ).mouseenter( function(){
        flowMap.wrangleData(this.id)} );

    $(".flow-select").click(function(){
        var current = this;
        $('.flow-select').each(function() {
            if ( $(this).height() > 60)
                $( this ).animate({ height: "-=90" },  { duration: 200, queue: false });
                $( this ).html(""+this.id);
        });
        if ( $(this).height() < 60){
            $( this ).animate({height: "+=90"},  { duration: 200, queue: false } );
            $( this ).html("More information for you about "+this.id);}
        else
        {$( this ).animate({ height: "-=90" },  { duration: 200, queue: false });
            $( this ).html(""+this.id)};
    });
    
    var video = document.getElementById("myVideo");
    // Don't toggle the loader until the video is loaded
    while( (video.readyState !== 4) && (video.readyState !== 0) ) {
        console.log(video.readyState);
    }

    $('body').toggleClass('loaded');


}

function nextSpin() {
    globeSpin.updateVis();
}

function prevSpin() {
    globeSpin.prevUpdateVis();
}

function updateBar() {
    slaveryBarChart.updateVis();
}