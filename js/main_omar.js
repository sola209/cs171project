/**
 * Created by omarabboud1 on 2016-11-13.
 */

d3.csv("data/trafficking.csv", function(data){

    scatterchart = new ScatterChart("vis-area", data);

    d3.select("#attribute-type").on("change", scatterchart.wrangleData());

});

