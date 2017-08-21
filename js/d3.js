var data1 = [48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48];
var data2 = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40];
var data3 = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
var data = [];

var height = 200;
var width = 430;
var margin = {
    left: 25,
    right: 25,
    top: 50,
    bottom: 0
};

var yScale = d3.scaleLinear()
    .domain([0, 50 /*d3.max(data)*/ ])
    .range([height, 0]);
var xScale = d3.scaleLinear()
    .domain([0, 20])
    .range([0, width]);

var yAxis = d3.axisLeft(yScale).ticks(5);
var xAxis = d3.axisBottom(xScale);

var line = d3.line()
    .x(function (d, i) {
        return xScale(i);
    })
    .y(function (d, i) {
        return yScale(d);
    });

function makegraphs(chartline1, chartline2, chartline3, chartid, title) {

    var svg = d3.select("#" + chartid).append("svg").attr("height", (height + margin.top + 25)).attr("width", "100%");

    var chartGroup = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    chartGroup.append("path")
        .attr("class", "line1")
        .attr("stroke", "blue")
        .attr("d", line(chartline1));

    chartGroup.append("path")
        .attr("class", "line2")
        .attr("stroke", "green")
        .attr("d", line(chartline2));

    chartGroup.append("path")
        .attr("class", "line3")
        .attr("stroke", "red")
        .attr("d", line(chartline3));

    chartGroup.append("g")
        .attr("fill", "none")
        .attr("class", "axis y")
        .attr("text-anchor", "end")
        .text("amount (pcs)")
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Amount (pcs)");

    chartGroup.append("g")
        .attr("fill", "none")
        .attr("class", "axis x")
        .attr("transform", "translate(0," + height + ")")
        .attr("text-anchor", "end")
        .text("time (sec)")
        .call(xAxis)
        .append("text")
        .attr("fill", "#000")
        //.attr("transform", "rotate(-90)")
        .attr("x", width)
        .attr("transform", "translate(0,-5)")
        .attr("text-anchor", "end")
        .text("Time (sec)");

    chartGroup.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
}

makegraphs(data1, data2, data3, "chart1", "Inventory");
makegraphs(data1, data2, data3, "chart2", "Service Level");
makegraphs(data1, data2, data3, "chart3", "test3");

function updateCharts(chartline1, chartline2, chartline3, chartid) {

    var chartGroup = d3.select("#" + chartid).transition();

    chartGroup.select(".line1")
        .duration(100)
        .attr("d", line(chartline1));
    chartGroup.select(".line2")
        .duration(100)
        .attr("d", line(chartline2));
    chartGroup.select(".line3")
        .duration(100)
        .attr("d", line(chartline3));

}

var interval = setInterval(function () {
    updateCharts(data1, data2, data, "chart1");
    updateCharts(data1, data, data3, "chart2");
    updateCharts(data, data2, data3, "chart3");
}, 5000);
