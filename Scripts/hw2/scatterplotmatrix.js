var data = [];
var svg;

var headers = [
	"Total",
	"Attack",
	"SpAtk",
	"SpDef",
	"Legendary"
];

var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = 1000 - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;
var sizeX = 200;
var sizeY = 140
var padding = 20;

window.onload = function () {

		svg = d3.select("#content").append("svg")
			.attr("width", 1000).attr("height", 700)
			.attr("id", "svg");

		d3.csv("../Files/Pokemon.csv", function (csv) {
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

			setup();

		});
}

var setup = function() {

	var x = d3.scaleLinear().range([padding / 2, sizeX - padding / 2]);

	var y = d3.scaleLinear().range([sizeY - padding / 2, padding / 2]);

	var xAxis = d3.axisBottom().scale(x).ticks(6);
	var yAxis = d3.axisLeft().scale(y).ticks(6);

	var domainByTrait = {},
		traits = d3.keys(data[0]).filter(function(d) {
			if (headers.includes(d))
				return d;
			return;
		}),
		n = traits.length;

	traits.forEach(function(trait) {
		domainByTrait[trait] = d3.extent(data, function(d) {return d[trait];});
	});

	xAxis.tickSize(sizeX * n);
	yAxis.tickSize(-sizeY * n);

	svg.selectAll(".x.axis")
		.data(traits)
		.enter().append("g")
		.attr("class", "x axis")
		.attr("transform", function(d, i) {
			return "translate(" + (n - i - 1) * sizeX + ",0)";
		})
		.each(function(d) {
			x.domain(domainByTrait[d]);
			d3.select(this).call(xAxis);
		});

	svg.selectAll(".y.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { return "translate(0," + i * sizeY + ")"; })
      .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

     var cell = svg.selectAll(".cell")
     	.data(cross(traits, traits))
     	.enter().append("g")
     	.attr("class", "cell")
     	.attr("transform", function(d) {
     		return "translate(" + (n - d.i - 1) *sizeX + "," + d.j * sizeY + ")";
     	})
     	.each(plot);

     cell.filter(function (d) { return d.i === d.j;}).append("text")
     	.attr("x", padding)
     	.attr("y", padding)
     	.attr("dy", ".71em")
     	.text(function(d) {return d.x;});

     function plot(p) {
     	var cell = d3.select(this);

     	x.domain(domainByTrait[p.x]);
     	y.domain(domainByTrait[p.y]);

     	cell.append("rect")
     		.attr("class", "frame")
     		.attr("x", padding/2)
     		.attr("y", padding/2)
     		.attr("width", sizeX-padding)
     		.attr("height", sizeY-padding);

     	cell.selectAll("circle")
     		.data(data)
     		.enter().append("circle")
     		.attr("cx", function(d) {
     			return x(d[p.x]);
     		})
     		.attr("cy", function(d) {
     			return y(d[p.y]);
     		})
     		.attr("r", 4)
     		.attr("class", function(d) {
     			return d.Type1;
     		});
     };

	function cross(a, b) {
		var c = [], n = a.length, m = b.length, i, j;
		for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
		return c;
	}
}