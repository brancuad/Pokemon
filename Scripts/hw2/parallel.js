// Total -> SpAtk -> SpDef -> Defense -> Attack -> HP -> 
// Legendary -> Female -> Speed -> Male

var data = [];
var svg;

var attributes = [
	"Total",
	"SpAtk",
	"SpDef",
	"Defense",
	"Attack",
	"HP",
	"Legendary",
	"Female",
	"Speed",
	"Male"
];

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

var margin = {top: 40, right: 20, bottom: 30, left: 40};
var width = 1500 - margin.left - margin.right;
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
			.attr("width", 1500).attr("height", 700)			.attr("id", "svg")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
				d.Generation = +d.Generation;
				d.Male = +d.Male;
				d.Female = +d.Female;
				d.Index = +d.Index;
				d.Pnum = +d.Pnum;
			});
			data = csv;

			plot();

	});
}

var line = d3.line();
var dragging = {};
var x = d3.scalePoint().range([0, width], 1);
var y = {};

var plot = function() {

	var axis = d3.axisLeft();
	var foreground;

	// Get list of dimensions and scale for each
	x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
		return attributes.includes(d) && (y[d] = d3.scaleLinear()
				.domain(d3.extent(data, function(p) {
					return +p[d];
				}))
				.range([height, 0]));
	}));


	foreground = svg.append("g")
		.attr("class", "foreground")
		.selectAll("path")
		.data(data)
		.enter().append("path")
		.attr("class", function(d) {
			return d.Type1 + " " + d.Type2;
		})
		.attr("d", path);

	  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

      // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });

}

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
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
	$("." + type).attr("style", "opacity: 1; stroke-width: 3px;")
}