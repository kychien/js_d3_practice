// from data.js
// var tableData = data;

// Title Case function to convert str params to titlecase
function tCase(str) {
    var words = String(str).toLowerCase().split(" ");
    var charExp = /^[a-z]/;                     // regex for checking for non-letters
    var first = 0;
    for (var i = 0; i < words.length; i++) {
        // Front of the string will be all non-letters plus the first letter
        var front = words[i].charAt(0); 
        while (!(charExp.test(words[i].charAt(first))) && (first < words[i].length)) {
            first++;
            front += words[i].charAt(first)
            //console.log("Char at " + first + " of "+ words[i] +" is not a letter.");
        }
        // Attache the upper'd front with the lowercase remainder
        words[i] = front.toUpperCase() + words[i].slice(first+1);
        first = 0;
    }
    return words.join(" ");
}

// Function to build ufo sighting table rows
function buildRow(row, cells){
    Object.entries(cells).forEach(([key, value]) => {
        var cell = row.append("td");
        if (key != "comments") {
            cell.attr("class", "t-cen");
            if (tCases.indexOf(key) > -1) {
                cell.text(tCase(value));
            } else if (tUp.indexOf(key) > -1) {
                cell.text(value.toUpperCase());
            } else {
                cell.text(value);
            }
        } else {
            cell.text(value);
        }
    });
    return;
}

// Function to populate filter option menu
function buildOpt(arr, id) {
    var target = d3.select(id);
    Object.values(arr).forEach(val => {
        var newOpt = target.append("option");
        newOpt.attr("value", val[0]);
        newOpt.text(val[1]);
    });
    return;
}

var tCases = ["city", "shape", "durationMinutes"];
var tUp = ["state", "country"];
var ufoTBody = d3.select("#ufo-table-body");
var fBtn = d3.select("#filter-btn");
var lSlct = d3.select("#lvl-list");
var citiesOpt = [];
var statesOpt = [];
var countriesOpt = [];
var shapesOpt = [];
var citiesLbl = [];

// Populate the pre-filtered table
data.forEach(set => {
    var row = ufoTBody.append("tr");
    buildRow(row, set);

    if (citiesOpt.indexOf(set.city) < 0) {
        citiesOpt.push(set.city);
        citiesLbl.push(tCase(set.city) + ", " + set.state.toUpperCase());
    }
    if (statesOpt.indexOf(set.state) < 0) {
        statesOpt.push(set.state);
    }
    if (countriesOpt.indexOf(set.country) < 0) {
        countriesOpt.push(set.country);
    }
    if (shapesOpt.indexOf(set.shape) < 0) {
        shapesOpt.push(set.shape);
    }
});

citiesOpt.sort();
citiesLbl.sort();
statesOpt.sort();
countriesOpt.sort();
shapesOpt.sort();

citiesLbl = citiesLbl.map((val, ind) => [citiesOpt[ind], val]);
var statesLbl = statesOpt.map(val => [val, val.toUpperCase()]);
var countriesLbl = countriesOpt.map(val => [val, val.toUpperCase()]);
var shapesLbl = shapesOpt.map(val => [val, tCase(val)]);

buildOpt(citiesLbl, "#locale-list");
buildOpt(shapesLbl, "#shape-list");
function updateOpts(lvl) {
    // Swap out the old option list
    var newList = document.createElement("select");
    var oldList = document.getElementById("locale-list");
    newList.setAttribute("class", "form-control");
    newList.setAttribute("id", "locale-list");
    oldList.parentNode.replaceChild(newList, oldList);
    
    // Select the new empty list for manipulation
    var locList = d3.select("#locale-list");
    var initOpt = locList.append("option");
    
    // Add first 2 options
    initOpt.attr("value", "all");
    initOpt.text("Any");
    initOpt = locList.append("option");
    initOpt.attr("disabled", true);
    initOpt.text("──────────")
    
    switch(lvl){
        case "city":
            buildOpt(citiesLbl, "#locale-list");
            break;
        case "state":
            buildOpt(statesLbl, "#locale-list");
            break;
        case "country":
            buildOpt(countriesLbl, "#locale-list");
            break;
    }
}

fBtn.on("click", function() {

    // Prevent the refresh
    d3.event.preventDefault();

    // Make a copy of the data set to manipulate
    var fSet = data.map(i => i);
    
    var fList = d3.select("#filters");
    var fDate = fList.select("#datetime").property("value");
    var fLvl = fList.select("#lvl-list").property("value");
    var fLoc = fList.select("#locale-list").property("value");
    var fShape = fList.select("#shape-list").property("value");
    var sSet;
    console.log(fDate);
    var targetDate = new Date(fDate);
    
    // Filter on Date if not empty
    if (fDate != "") {
        // Filter on the provided date
        fSet = fSet.filter(spot => {
            var spotDate = new Date(spot.datetime);
            return targetDate.getTime() === spotDate.getTime();
        });
    }

    // Filter on Shape if not 'all'
    if (fShape != "all") {
        sSet = fSet.filter(spot => spot.shape == fShape);
        // console.log(sSet);
        fSet = sSet;
    }

    // Filter on location if set
    if (fLoc != "all"){
        switch(fLvl){
            case "city":
                sSet = fSet.filter(spot => spot.city == fLoc);
                break;
            case "state":
                sSet = fSet.filter(spot => spot.state == fLoc);
                break;
            case "country":
                sSet = fSet.filter(spot => spot.country == fLoc);
                break;
        }
        fSet = sSet;
    }

    
    var fTBody = document.createElement("tbody");
    fTBody.setAttribute("id", "ufo-table-body");
    var oTBody = document.getElementById("ufo-table-body");
    oTBody.parentNode.replaceChild(fTBody, oTBody);

    ufoTBody = d3.select("#ufo-table-body");

    fSet.forEach(set => {
        var row = ufoTBody.append("tr");
        buildRow(row, set);
    });
    return;
});