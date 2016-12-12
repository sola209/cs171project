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
    // var hierarchy = new Hierarchy("tree", hierarchy);
    slaveryBarChart = new SlaveryBarChart("slavery-barchart", gsi);
    var flowMap = new FlowMap("#flow", [world, nodes, flows]);
    var countryInfo =
    // Update the visualization
    $( '.flow-select' ).mouseenter( function(){
        $('.flow-select').css('background-color', '#4c4c4c');
        $(this).css('background-color', 'rgba(255, 255, 255, 0.47)');
        flowMap.wrangleData(this.id)

    } );

    $(".flow-select").click(function(){
        descriptionText = {
            "United States": "The United States acts primarily as a destination country for people that are trafficked internationally. Both sexual exploitation and forced labor are very prevalent.",
            "Russia": "Russia acts as both a source and a destination country. Sexual exploitation is the dominant type of human trafficking.",
            "Indonesia": "Indonesia acts primarily as a source country. People are trafficked out of Indonesia for sexual exploitation and forced labor.",
            "India": "India mostly acts as a source country - that is, trafficking incidents tend to involve transport out of India. These cases include both sexual exploitation and forced labor.",
            "Lebanon": "Lebanon acts primarily as a source country. Trafficking cases include both sexual exploitation and forced labor.",
            "All": "In total, 600,000 to 800,000 people are trafficked across international borders every year, of which 80% are female and half are children. Source: www.dosomething.org"
        }
        var current = this;
        $('.flow-select').each(function() {
            if ( $(this).height() > 60)
                $( this ).animate({ height: "-=70" },  { duration: 200, queue: false });
                $( this ).html(""+this.id);
        });
        if ( $(this).height() < 60){
            $( this ).animate({height: "+=70"},  { duration: 200, queue: false } );
            $( this ).html(descriptionText[this.id]);}
        else
        {$( this ).animate({ height: "-=70" },  { duration: 200, queue: false });
            $( this ).html(""+this.id)};
    });
    
    var video = document.getElementById("myVideo");
    // Don't toggle the loader until the video is loaded
    while( (video.readyState !== 4) && (video.readyState !== 0)) {
        console.log(video.readyState);
    }

    $('body').toggleClass('loaded');


}

function moveDivisor() {
    var divisor = document.getElementById("divisor");
    var slider = document.getElementById("slider");
    var percent = document.getElementById("percent");

    divisor.style.width = slider.value+"%";
    percent.innerHTML = slider.value+"%";

    slaveryBarChart.wrangleData();
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
