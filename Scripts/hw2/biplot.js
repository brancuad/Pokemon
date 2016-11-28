var data = [];
var svg;
var svgScree;
var tooltip;

var types = [
	"Normal",
	"Fire",
	"Fighting",
	"Water",
	"Grass",
	"Flying",
	"Poison",
	"Electric",
	"Ground",
	"Psychic",
	"Rock",
	"Ice",
	"Bug",
	"Dragon",
	"Ghost",
	"Dark",
	"Steel",
	"Fairy"
];

var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = 1000 - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;

window.onload = function () {

		$("<option />").val(null).text("None").appendTo("#filterSelect");
		
		for (var i = 0; i < types.length; i++) {
			$("<option />").val(types[i]).text(types[i]).appendTo("#filterSelect");
		}


		$("#filterSelect").change(function (){
			filterTypes($(this).val());
		});

		svg = d3.select("#content").append("svg")
			.attr("width", 1000).attr("height", 700)
			.attr("id", "svg");

		tooltip = d3.select("#content").append("div")
			.attr("class", "tooltip").style("opacity", 0);

		d3.csv("../Files/pca.csv", function (csv) {
			// Convert numerical values to numbers
			csv.forEach(function(d) {
				d.PCA1 = +d.PCA1;
				d.PCA2 = +d.PCA2;
			});
			data = csv;

			plot("PCA1", "PCA2");

		});
}



plot = function (attr1, attr2) {
	// functions to set up x
	var xValue = function(d) {
		return d[attr1];
	};

	var xScale = d3.scaleLinear().range([0, width]),
	xMap = function(d) {
		return xScale(xValue(d));
	},
	xAxis = d3.axisBottom().scale(xScale);

	// functions to set up y
	var yValue = function(d) {
		return d[attr2];
	}

	var yScale = d3.scaleLinear().range([height, 0]),
	yMap = function(d) { 
		return yScale(yValue(d));
	},
	yAxis = d3.axisLeft().scale(yScale);

	// add graph to canvas
	var g = svg.append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

	// Dots won't overlap axis with these buffers
	xScale.domain([0, d3.max(data, xValue)+1]);
	yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

	// draw dots
	g.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", function(d) {
			return "dot " + d.Type1  +" " + d.Type2;
		})
		.attr("r", 3.5)
		.attr("cx", xMap)
		.attr("cy", yMap)
		.on("mouseover", function(d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9);
			tooltip.html(d.Name + "<br />" + attr1 + ": " + d[attr1] + "<br />" + attr2  +": " + d[attr2] )
			.style("left", (d3.event.pageX + 5) + "px")
			.style("top", (d3.event.pageY - 28) + "px");

		})
		.on("mouseout", function(d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0);
		});

		g.selectAll("line")
			.data(data)
			.enter().append("line")
			.attr("class", function(d) {
				return "line " + d.Type1 + " " + d.Type2;
			})
		    .style("stroke-width", 1)
		    .attr("x1", xScale(0))
		    .attr("y1", yScale(0))
		    .attr("x2", xMap)
		    .attr("y2", yMap);
		// end of drawing lines

		//x-axis
	g.append("g").attr("class", "x axis")
			.attr("transform", "translate(0," + yScale(0) + ")")
			.call(xAxis)
		.append("text")
			.attr("class", "label")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text(attr1);

	// y-axis
	g.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(attr2);
}

function filterTypes(type) {
	if (!type) {

		for (var i = 0; i < types.length; i++) {
			$("." + types[i]).attr("style", "opacity: 1; stroke-width: 1px;");
		}
		return;

	}
	for (var i = 0; i < types.length; i++) {
		if (type != types[i])
			$("." + types[i]).attr("style", "opacity: .1; stroke-width: 1px;");
	}
	$("." + type).attr("style", "opacity: 1; stroke-width: 2px;")
}
