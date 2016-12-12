/**
 * Created by omarabboud1 on 2016-11-27.
 */
function initChord(){

    var width = 600,
        height = 600,
        outerRadius = Math.min(width, height) / 2 - 10,
        innerRadius = outerRadius - 24;

    var matrix = [
        [ 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 14, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0 ],
        [ 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 7, 0, 0, 0, 94, 3, 0, 1, 0, 0, 0 ],
        [ 1, 0, 0, 0, 4, 59, 0, 1, 0, 0, 0 ],
        [ 1, 0, 0, 0, 0, 0, 97, 10, 0, 0, 0 ],
        [ 1, 0, 0, 0, 0, 0, 0, 31, 0, 0, 0 ],
        [ 1, 0, 0, 0, 1, 7, 3, 18, 0, 0, 0 ],
        [ 7, 0, 0, 0, 1, 25, 3, 33, 0, 0, 0 ],
        [ 4, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0 ]
    ];

    var regions = [ "W. Europe", "Cen. Europe", "The Balkans", "West Africa", "South America",
        "North / Central America", "Sub-Saharan Africa", "North Africa & M.E.", "South Asia",
        "East Asia", "C.Asia" ];

    /*var colors = ["#760d0d", "#000000", "#4b320c", "#060f3a", "#4F54A8", "#424242"]*/
    var colors = [ "#f2ecec","#D9C5C4","#CDB1B0","#9B6460","#8F504C",
        "#E5D8D8","#772A24","#833D38","#A87774","#B48B88","#C09E9C" ]

    var formatPercent = d3.format(".1%");

    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var layout = d3.layout.chord()
        .padding(.04)
        .sortSubgroups(d3.descending)
        .sortChords(d3.ascending);

    var path = d3.svg.chord()
        .radius(innerRadius);

    var svg = d3.select("#container2").append("svg")
        .attr("id","chordsvg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("id", "circle")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("circle")
        .attr("r", outerRadius);

    // Compute the chord layout.
    layout.matrix(matrix);

    // Add a group per neighborhood.
    var group = svg.selectAll(".group")
        .data(layout.groups)
        .enter().append("g")
        .attr("class", "group")
        .on("mouseover", mouseover);

    // Add a mouseover title.
    group.append("title").text(function(d, i) {
        return regions[i] + ": " + formatPercent(d.value) + " of origins";
    });

    // Add the group arc.
    var groupPath = group.append("path")
        .attr("id", function(d, i) { return "group" + i; })
        .attr("d", arc)
        .style("fill", function(d, i) { return colors[i]; });

    // Add a text label.
    var groupText = group.append("text")
        .attr("x", 6)
        .attr("dy", 15);

    groupText.append("textPath")
        .attr("xlink:href", function(d, i) { return "#group" + i; })
        .text(function(d, i) { return regions[i]; });

    // Remove the labels that don't fit. :(
    groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
        .remove();

    // Add the chords.
    var chord = svg.selectAll(".chord")
        .data(layout.chords)
        .enter().append("path")
        .attr("class", "chord")
        .style("fill", function(d) { return colors[d.source.index]; })
        .attr("d", path);

    // Add an elaborate mouseover title for each chord.
    //chord.append("title").text(function(d) {
    //    return regions[d.source.index]
    //        + " → " + regions[d.target.index]
    //        + ": " + formatPercent(d.source.value)
    //        + "\n" + regions[d.target.index]
    //        + " → " + regions[d.source.index]
    //        + ": " + formatPercent(d.target.value);
    //});

    function mouseover(d, i) {
        chord.classed("fade", function(p) {
            update_text2(i);
            return p.source.index != i
                && p.target.index != i;
        });
    }
}


initChord();

function updateChord() {
    d3.select("#chordsvg").remove();
    initChord();
    $("#numnations").text('168');
    $("#vuln").text('38.7');
    $("#traff").text('0.54%');
    $("#resp").text('39.7');
    $("#desc").html('The crime of trafficking in persons affects virtually every' +
    'country in every region of the world. Between 2010 and ' +
    '2012, victims with 152 different citizenships were identified '+
    'in 124 countries across the globe.' +'<br/>' + '<br/> ' +
    'Transregional trafficking flows are mainly detected in the ' +
    'rich countries of the Middle East, Western Europe and ' +
    'North America. These flows often involve victims from ' +
    "the ‘global south’; mainly East and South Asia and SubSaharan " +
    'Africa.');
}

/*function update_text(region){

    if(d3.select("#attribute-type").property("value") == "global"){
        $("#numnations").text('168');
        $("#vuln").text('38.7');
        $("#traff").text('0.5%');
        $("#resp").text('39.7');
        $("#desc").html('The crime of trafficking in persons affects virtually every '+
        'country in every region of the world. Between 2010 and '+
        '2012, victims with 152 different citizenships were identified '+
        'in 124 countries across the globe.'+'<br/>'+''+'<br/>'+

        'Transregional trafficking flows are mainly detected in the '+
        'rich countries of the Middle East, Western Europe and '+
        'North America. These flows often involve victims from '+
        'the ‘global south’; mainly East and South Asia and SubSaharan '+
        'Africa.');
    }

    if(d3.select("#attribute-type").property("value") == "europe"){
        $("#numnations").text('37');
        $("#vuln").text('27.1');
        $("#traff").text('0.2%');
        $("#resp").text('54.2');
        $("#desc").html('Western and Central Europe is a region that is both an '+
        'origin and a destination for trafficking in persons. Countries '+
        'in Central Europe and the Balkans are mainly origin '+
        'areas for cross-border trafficking into the rest of Europe. '+
        'These countries also detect significant levels of domestic trafficking.'+
        '<br/>'+''+'<br/>'+'In terms of legislation, all the countries in Western and ' +
            'Central Europe considered in this Report have national ' +
            'legislation that is in line with the UN Trafficking in Persons Protocol today. ');
    }

    if(d3.select("#attribute-type").property("value") == "americas"){
        $("#numnations").text('27');
        $("#vuln").text('34.85');
        $("#traff").text('0.4%');
        $("#resp").text('45.3');
        $("#desc").html('In this region, 58 percent of the relevant flows are either domestic or subregional. As a result,' +
            'most victims from this part of the world ' +
            'are trafficked to a richer country nearby, or to a richer area within the same country. ' + '<br/>' + '' + '<br/>' +
            'In terms of the regional response to trafficking in persons, most of the countries have specific ' +
            'legislation today,' +
            ' although in some cases it is partial. The criminal justice ' +
            'response in the Western Hemisphere shows that among the countries considered, only the United States' +
            ' and Peru reported more than 50 convictions for trafficking in persons per year.');
    }

    if(d3.select("#attribute-type").property("value") == "asia"){
        $("#numnations").text('27');
        $("#vuln").text('40.22');
        $("#traff").text('0.7%');
        $("#resp").text('35.6');
        $("#desc").html('The main destinations for victims from the subregion of East Asia and the Pacific ' +
            '(outside the subregion) are North America and the Middle East, and to a lesser extent Western Europe.'
            + '<br/>' + '' + '<br/>' +
            'The number of convictions in this part of the world is higher than in other regions, ' +
            'with many countries reporting more than 50 convictions per year. However, for many countries in this ' +
            'region (22 per cent) data on convictions is not available. So, the regional average is actually ' +
            'biased as a result of the absence of proper information on the criminal justice response');
    }

    if(d3.select("#attribute-type").property("value") == "subsaharan_africa"){
        $("#numnations").text('46');
        $("#vuln").text('47.3');
        $("#traff").text('0.6%');
        $("#resp").text('28.8');
        $("#desc").html('In terms of flows, domestic trafficking is the main type of trafficking in Sub-Saharan Africa. ' +
            'This type of trafficking accounts for more than three quarters of the total number of detected victims ' +
            'in this subregion. ' +'<br/>' + '' + '<br/>' +
            'As described in the global overview, the key concern in the subregion of SubSaharan Africa is ' +
            'lack of legislation. As a result of the late introduction of proper ' +
            'legislation, most of the countries in this part of the world report very few convictions, ' +
            'and the number of countries where this information is not available or accessible is very high compared ' +
            'to the rest of the world.');
    }

    if(d3.select("#attribute-type").property("value") == "russia_eurasia"){
        $("#numnations").text('12');
        $("#vuln").text('37.0');
        $("#traff").text('0.8%');
        $("#resp").text('39.4');
        $("#desc").html('Trafficking for sexual exploitation is the major detected form of trafficking in persons ' +
            'in Central Asia. More than 65 per cent of the victims detected in this region are trafficked for ' +
            'sexual exploitation.' + '<br/>' + '' + '<br/>' + 'Most of the countries in Eastern Europe and ' +
            'Central Asia reported having between 10 and 50 convictions for trafficking in persons per year. ' +
            'For two countries in this subregion, however, this information was not available.');
    }

    if(d3.select("#attribute-type").property("value") == "middle_east"){
        $("#numnations").text('18');
        $("#vuln").text('45.0');
        $("#traff").text('0.7%');
        $("#resp").text('33.3');
        $("#desc").html('The Middle East is not only a destination for Sub-Saharan (mainly East) Africans. ' +
            'The region also experiences inbound trafficking from distant regions, especially from the region ' +
            'of South Asia, East Asia and the Pacific.' + '<br/>' + '' + '<br/>' +
            'No country in North Africa and the Middle East had an offense that criminalized trafficking in persons ' +
            'as of 2014. Only two countries had partial legislation (focused on trafficking in children). ' +
            'Very few countries provide information about the number of convictions' +
            ', and when such figures are available, they are generally very low.');

    }

}*/

function update_text2(i){


    if(i == 2 || i == 0){
        $("#numnations").text('37');
        $("#vuln").text('27.1');
        $("#traff").text('0.2%');
        $("#resp").text('54.2');
        $("#desc").html('Western and Central Europe is a region that is both an '+
            'origin and a destination for trafficking in persons. Countries '+
            'in Central Europe and the Balkans are mainly origin '+
            'areas for cross-border trafficking into the rest of Europe. '+
            'These countries also detect significant levels of domestic trafficking.'+
            '<br/>'+''+'<br/>'+'In terms of legislation, all the countries in Western and ' +
            'Central Europe considered in this Report have national ' +
            'legislation that is in line with the UN Trafficking in Persons Protocol today. ');
    }

    if(i == 5 || i == 4){
        $("#numnations").text('27');
        $("#vuln").text('34.85');
        $("#traff").text('0.4%');
        $("#resp").text('45.3');
        $("#desc").html('In this region, 58 percent of the relevant flows are either domestic or subregional. As a result,' +
            'most victims from this part of the world ' +
            'are trafficked to a richer country nearby, or to a richer area within the same country. ' + '<br/>' + '' + '<br/>' +
            'In terms of the regional response to trafficking in persons, most of the countries have specific ' +
            'legislation today,' +
            ' although in some cases it is partial. The criminal justice ' +
            'response in the Western Hemisphere shows that among the countries considered, only the United States' +
            ' and Peru reported more than 50 convictions for trafficking in persons per year.');
    }

    if(i == 9 || i == 8){
        $("#numnations").text('27');
        $("#vuln").text('40.22');
        $("#traff").text('0.7%');
        $("#resp").text('35.6');
        $("#desc").html('The main destinations for victims from the subregion of East Asia and the Pacific ' +
            '(outside the subregion) are North America and the Middle East, and to a lesser extent Western Europe.'
            + '<br/>' + '' + '<br/>' +
            'The number of convictions in this part of the world is higher than in other regions, ' +
            'with many countries reporting more than 50 convictions per year. However, for many countries in this ' +
            'region (22 per cent) data on convictions is not available. So, the regional average is actually ' +
            'biased as a result of the absence of proper information on the criminal justice response');
    }

    if(i == 3 || i == 6){
        $("#numnations").text('46');
        $("#vuln").text('47.3');
        $("#traff").text('0.6%');
        $("#resp").text('28.8');
        $("#desc").html('In terms of flows, domestic trafficking is the main type of trafficking in Sub-Saharan Africa. ' +
            'This type of trafficking accounts for more than three quarters of the total number of detected victims ' +
            'in this subregion. ' +'<br/>' + '' + '<br/>' +
            'As described in the global overview, the key concern in the subregion of SubSaharan Africa is ' +
            'lack of legislation. As a result of the late introduction of proper ' +
            'legislation, most of the countries in this part of the world report very few convictions, ' +
            'and the number of countries where this information is not available or accessible is very high compared ' +
            'to the rest of the world.');
    }

    if(i == 10){
        $("#numnations").text('12');
        $("#vuln").text('37.0');
        $("#traff").text('0.8%');
        $("#resp").text('39.4');
        $("#desc").html('Trafficking for sexual exploitation is the major detected form of trafficking in persons ' +
            'in Central Asia. More than 65 per cent of the victims detected in this region are trafficked for ' +
            'sexual exploitation.' + '<br/>' + '' + '<br/>' + 'Most of the countries in Eastern Europe and ' +
            'Central Asia reported having between 10 and 50 convictions for trafficking in persons per year. ' +
            'For two countries in this subregion, however, this information was not available.');
    }

    if(i == 7){
        $("#numnations").text('18');
        $("#vuln").text('45.0');
        $("#traff").text('0.7%');
        $("#resp").text('33.3');
        $("#desc").html('The Middle East is not only a destination for Sub-Saharan (mainly East) Africans. ' +
            'The region also experiences inbound trafficking from distant regions, especially from the region ' +
            'of South Asia, East Asia and the Pacific.' + '<br/>' + '' + '<br/>' +
            'No country in North Africa and the Middle East had an offense that criminalized trafficking in persons ' +
            'as of 2014. Only two countries had partial legislation (focused on trafficking in children). ' +
            'Very few countries provide information about the number of convictions' +
            ', and when such figures are available, they are generally very low.');

    }






}

