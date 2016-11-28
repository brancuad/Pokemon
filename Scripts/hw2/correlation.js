var data = [];
var svg;

var headers = [
	"Total",
	"HP",
	"Attack",
	"Defense",
	"SpAtk",
	"SpDef",
	"Speed",
	"Legendary",
	"Male",
	"Female"
];

var margin = {top: 20, right: 20, bottom: 30, left: 60};
var width = 1000 - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;

window.onload = function () {

		svg = d3.select("#content").append("svg")
			.attr("width", 1000).attr("height", 700)
			.attr("id", "svg");

		d3.csv("../Files/correlations.csv", function (csv) {
			// Convert numerical values to numbers
			csv.forEach(function(d) {
				d.Total = +d.Total;
				d.HP = +d.HP;
				d.Attack = +d.Attack;
				d.Defense = +d.Defense;
				d.SpAtk = +d.SpAtk;
				d.SpDef = +d.SpDef;
				d.Speed = +d.Speed;
				d.Legendary = +d.Legendary;
				d.Male = +d.Male;
				d.Female = +d.Female;
			});
			data = csv;

			plot();

		});
}

var plot = function() {

	var x = d3.scaleBand().domain(headers).range([0, width], .1);
	var xGrid = d3.scalePoint().domain(headers).range([0, width], .1);
	var xAxis = d3.axisBottom().scale(x);
	var xGridAxis = d3.axisBottom().scale(xGrid);

	var y = d3.scaleBand().domain(headers).range([0, height], .1);
	var yGrid = d3.scalePoint().domain(headers).range([0, height], .1);
	var yAxis = d3.axisLeft().scale(y);
	var yGridAxis = d3.axisLeft().scale(yGrid);


	// add graph to canvas
	var g = svg.append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

	//x-axis
	g.append("g").attr("class", "xaxis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

			/*
	g.append("g").attr("class", "grid")
			.attr("transform", "translate(0," + height + ")")
			.call(xGridAxis.tickSize(-height,0,0).tickFormat(""));
			*/

	// y-axis
	g.append("g")
			.attr("class", "yaxis")
			.call(yAxis);

			/*
	g.append("g")
			.attr("class", "grid")
			.call(yGridAxis.tickSize(-width, 0 , 0).tickFormat(""));
			*/
	var dataMatrix = [];

	data.forEach(function (a, x) {
		data.forEach(function(b, y) {
			dataMatrix.push({a:a, b:b, x:x, y:y});
		});
	});

	g.selectAll("g.corr")
		.data(dataMatrix)
		.enter()
		.append("g")
		.attr("transform", function (d) {
			return "translate(" + (d.x * width/10) + "," + (d.y * height/10) + ")";
		}).attr("class", "corr");

		
	g.selectAll("g.corr").each(function (matrix, i) {
		d3.select(this).append("rect").style("stroke", "#fff").attr("height", height/10)
		.attr("width", width/10).style("fill", "white");

		d3.select(this).append("rect").attr("height", height/10).attr("width", width/10)
			.style("fill", function () {
				var d = data[Math.floor(i/10)][headers[i%10]];
				var value = Math.round(Math.abs(d)*255);
				if(d>0) {
					//return "rgb(" + value + ", 0, 0 )";
					return "red";
				}
				else {
					//return "rgb(0, 0, " + value + ")";
					return "blue";
				}
		}).style("opacity", function() {

				var d = data[Math.floor(i/10)][headers[i%10]];
				return Math.abs(d);
		});
	});

	$("<div></div>").attr("id", "grad").appendTo("#content");
	$("<span></span>").text("-1").attr("class", "legend").appendTo("#grad");
	$("<span></span>").text("1").attr("class", "legend").attr("style", "float: right").appendTo("#grad");
}