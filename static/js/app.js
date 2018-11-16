// from data.js
// var tableData = data;

function tCase(str) {
    var words = String(str).toLowerCase().split(" ");
    // var charExp = /^[a-z]/;
    var first = 0;
    for (var i = 0; i < words.length; i++) {
        var front = words[i].charAt(0); 
        // while (!(charExp.test(words[i].charAt(first))) && (first < words[i].length)) {
        //     first++;
        //     console.log("Char at " + first + " is not a letter.");
        // }
        words[i] = front.toUpperCase() + words[i].slice(1);
        first = 0;
    }
    return words.join(" ");
}

var tCases = ["city", "shape", "durationMinutes"];
var tUp = ["state", "country"];
var tbody = d3.select("tbody");

data.forEach(set => {
    var row = tbody.append("tr");
    Object.entries(set).forEach(([key, value]) => {
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
        }
    });
});
