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
