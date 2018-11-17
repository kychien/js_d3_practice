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

function buildRow(row, cells){
    Object.entries(cells).forEach(([key, value]) => {
        var cell = row.append("td");
        if (key != "comments") {
            cell.attr("class", "t-cen");
            if (tCases.indexOf(key) > -1){
                cell.text(tCase(value));
            } else if (tUp.indexOf(key) > -1){
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

var tCases = ["city", "shape", "durationMinutes"];
var tUp = ["state", "country"];
var ufoTBody = d3.select("#ufo-table-body");
var fBtn = d3.select("#filter-btn");


// Populate the pre-filtered table
data.forEach(set => {
    var row = ufoTBody.append("tr");
    // Object.entries(set).forEach(([key, value]) => {
    //     var cell = row.append("td");
    //     if (key != "comments") {
    //         cell.attr("class", "t-cen");
    //         if (tCases.indexOf(key) > -1){
    //             cell.text(tCase(value));
    //         } else if (tUp.indexOf(key) > -1){
    //             cell.text(value.toUpperCase());
    //         } else {
    //             cell.text(value);
    //         }
    //     } else {
    //         cell.text(value);
    //     }

    // });
    buildRow(row, set);
});

fBtn.on("click", function() {

    // Prevent the refresh
    d3.event.preventDefault();

    // Make a copy of the data set to manipulate
    var fSet = data.map(i => i);
    // var update = false;
    var fList = d3.select("#filters");
    var fDate = fList.select("#datetime").property("value");
    console.log(fDate);
    var targetDate = new Date(fDate);
    
    if (fDate != ""){
        // Filter on the provided date
        fSet = fSet.filter(spot => {
            var spotDate = new Date(spot.datetime);
            return targetDate.getTime() === spotDate.getTime();
        });
    }
    
    console.log(fSet);

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