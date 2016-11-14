queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.json, "data/globeSpin.json")
    .defer(d3.csv, "data/trafficking.csv")
    .defer(d3.json, "data/hierarchy.json")
    .await(ready);

function ready(error, world, globeData, gsi, hierarchy) {
    if (error) throw error;

    var globeSpin = new GlobeSpin(world, globeData);
    var hierarchy = new Hierarchy("tree", hierarchy);
    var slaveryBarChart = new SlaveryBarChart("slavery-barchart", gsi);
    var scatterchart = new ScatterChart("vis-area", gsi);
    d3.select("#attribute-type").on("change", scatterchart.wrangleData());
}
