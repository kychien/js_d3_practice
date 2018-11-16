// from data.js
// var tableData = data;

var tbody = d3.select("tbody");

data.forEach(set => {
    var row = tbody.append("tr");
    Object.values(set).forEach(value => {
        var cell = row.append("td");
        cell.text(value);
    });
});
