window.onload = function () {
	scatterplot.init();
	biplot.init();
	parallel.init();
	mds.init();


	$("<option />").val("").text("None").appendTo("#filterSelect");

	for (var i = 0; i < types.length; i++) {
		$("<option />").val(types[i]).text(types[i]).appendTo("#filterSelect");
	}


	$("#filterSelect").change(function (){
		filterTypes($(this).val());
	});
};

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

// Check if type should be hidden
var filterType = function (type) {
	
	if (!$("#filterSelect").val()) {
		return false;
	}
	else if ($("#filterSelect").val() == type) {
		return false;
	}	
	else {
		return true;
	}
}

// Hide all but type
function filterTypes(type) {
	if (!type) {

		for (var i = 0; i < types.length; i++) {
			$("." + types[i]).removeClass("hidden");
		}
		scatterplot.brushmove();
		return;

	}
	for (var i = 0; i < types.length; i++) {
		if (type != types[i])
			$("." + types[i]).addClass("hidden");
	}
	$("." + type).removeClass("hidden");
	scatterplot.brushmove();
}

/* Scatterplot */
var scatterplot = {
	data : [],
	svg : null,
	tooltip : null,

	margin : {top: 20, right: 20, bottom: 30, left: 40},
	width : null,
	height : null,

	init : function () {
		scatterplot.width = 500 - scatterplot.margin.left - scatterplot.margin.right;
		scatterplot.height = 350 - scatterplot.margin.top - scatterplot.margin.bottom;

		$(".attrSel").change(function (){
			$("#xTitle").text($("#xSelect").find(":selected").text());
			$("#yTitle").text($("#ySelect").find(":selected").text());
			scatterplot.plot($("#xSelect").val(), $("#ySelect").val());
			filterTypes($("#filterSelect").val());
		});

		scatterplot.svg = d3.select("#vis1").append("svg")
			.attr("width", 500).attr("height", 350)
			.attr("id", "scatterplot_svg");

		tooltip = d3.select("#vis1").append("div")
			.attr("class", "tooltip").style("opacity", 0);

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

			scatterplot.plot($("#xSelect").val(), $("#ySelect").val());

		})
	},

	brush : null,
	g: null,

	plot : function (attr1, attr2) {
		scatterplot.svg.selectAll("*").remove();

		// functions to set up x
		var xValue = function(d) {
			return d[attr1];
		};

		var xScale = d3.scaleLinear().range([0, scatterplot.width]),
		xMap = function(d) {
			return xScale(xValue(d));
		},
		xAxis = d3.axisBottom().scale(xScale);

		// functions to set up y
		var yValue = function(d) {
			return d[attr2];
		};

		var yScale = d3.scaleLinear().range([scatterplot.height, 0]),
		yMap = function(d) { 
			return yScale(yValue(d));
		},
		yAxis = d3.axisLeft().scale(yScale);

		scatterplot.brush = d3.brush().on("start", scatterplot.brushstart)
					.on("brush", scatterplot.brushmove)
					.on("end", scatterplot.brushend);

		// add graph to canvas
		g = scatterplot.svg.append("g").attr("transform","translate(" + scatterplot.margin.left + "," + scatterplot.margin.top + ")")
			.call(scatterplot.brush);

		// Dots won't overlap axis with these buffers
		xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
		yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

		//x-axis
		g.append("g").attr("class", "xaxis")
				.attr("transform", "translate(0," + scatterplot.height + ")")
				.call(xAxis)
			.append("text")
				.attr("class", "label")
				.attr("x", scatterplot.width)
				.attr("y", -6)
				.style("text-anchor", "end")
				.text(attr1);

		// y-axis
		g.append("g")
				.attr("class", "yaxis")
				.call(yAxis)
			.append("text")
				.attr("class", "label")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text(attr2);

		// draw dots
		g.selectAll(".dot")
			.data(data)
			.enter().append("circle")
			.attr("class", function(d) {
				return "dot " + d.Type1 + " " + d.Type2 + " " + d.Index;
			})
			.attr("r", 3.5)
			.attr("cx", xMap)
			.attr("cy", yMap)
			.on("mouseover", function(d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", .9);
				tooltip.html(d.Name + "<br />" + attr1 + ": " + d[attr1]
				 + "<br />" + attr2  +": " + d[attr2] )
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 28) + "px");

			})
			.on("mouseout", function(d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);
			});
	},

	brushCell : null,
	selection : null,

	brushstart : function(p) {
		brushCell = this;
	},

	brushmove : function() {
		var selection = d3.brushSelection(this);
		if (selection)
			scatterplot.selection = selection;


		var x = $("#xSelect").val();
		var y = $("#ySelect").val();

		// functions to set up x
		var xValue = function(d) {
			return d[x];
		};

		var xScale = d3.scaleLinear().range([0, scatterplot.width]),
		xMap = function(d) {
			return xScale(xValue(d));
		};

		// functions to set up y
		var yValue = function(d) {
			return d[y];
		};

		var yScale = d3.scaleLinear().range([scatterplot.height, 0]),
		yMap = function(d) { 
			return yScale(yValue(d));
		};

		// Dots won't overlap axis with these buffers
		xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
		yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

		scatterplot.svg.selectAll("circle").each(function(d) {
			var hide = scatterplot.selection[0][0] > xMap(d) || xMap(d) > scatterplot.selection[1][0]
				|| scatterplot.selection[0][1] > yMap(d) || yMap(d) > scatterplot.selection[1][1];
			var hide = hide || (filterType(d.Type1) && filterType(d.Type2));
		
			if (hide) {
				$("." + d["Index"]).addClass("hidden");
			}
			else {
				$("." + d["Index"]).removeClass("hidden");
			}
		});
	},

	brushend : function(p) {
		scatterplot.selection = d3.brushSelection(this);

		if(scatterplot.selection === null) {
			filterTypes($("#filterSelect").val());
		}
	},

	cross : function(a, b) {
	  var c = [], n = a.length, m = b.length, i, j;
	  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
	  return c;
	}
};
/* End Scatterplot */

/* Biplot */
var biplot = {
	data : [],
	svg : null,
	tooltip : null,

	margin : {top: 20, right: 20, bottom: 30, left: 40},
	width : 0,
	height : 0,

	init : function () {
			biplot.width = 500 - biplot.margin.left - biplot.margin.right;
			biplot.height = 350 - biplot.margin.top - biplot.margin.bottom;

			biplot.svg = d3.select("#vis2").append("svg")
				.attr("width", 500).attr("height", 350)
				.attr("id", "biplot_svg");

			tooltip = d3.select("#vis2").append("div")
				.attr("class", "tooltip").style("opacity", 0);

			d3.csv("../Files/pca.csv", function (csv) {
				// Convert numerical values to numbers
				csv.forEach(function(d) {
					d.PCA1 = +d.PCA1;
					d.PCA2 = +d.PCA2;
				});
				data = csv;

				biplot.plot("PCA1", "PCA2");

			});
	},

	plot : function (attr1, attr2) {
		// functions to set up x
		var xValue = function(d) {
			return d[attr1];
		};

		var xScale = d3.scaleLinear().range([0, biplot.width]),
		xMap = function(d) {
			return xScale(xValue(d));
		},
		xAxis = d3.axisBottom().scale(xScale);

		// functions to set up y
		var yValue = function(d) {
			return d[attr2];
		}

		var yScale = d3.scaleLinear().range([biplot.height, 0]),
		yMap = function(d) { 
			return yScale(yValue(d));
		},
		yAxis = d3.axisLeft().scale(yScale);

		// add graph to canvas
		var g = biplot.svg.append("g").attr("transform","translate(" + biplot.margin.left + "," + biplot.margin.top + ")");

		// Dots won't overlap axis with these buffers
		xScale.domain([0, d3.max(data, xValue)+1]);
		yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

		// draw dots
		g.selectAll(".dot")
			.data(data)
			.enter().append("circle")
			.attr("class", function(d) {
				return "dot " + d.Type1  +" " + d.Type2 + " " + d.Index;
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
					return "line " + d.Type1 + " " + d.Type2 + " " + d.Index;
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
				.attr("x", biplot.width)
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
	},

}
/* End Biplot*/

/* Parallel */
var parallel = {
	attributes : [
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
	],

	margin : {top: 40, right: 20, bottom: 30, left: 40},
	width : 0,
	height : 0,
	parallelsvg : null,

	init : function () {
			parallel.width = 750 - parallel.margin.left - parallel.margin.right;
			parallel.height = 350 - parallel.margin.top - parallel.margin.bottom;

			parallelsvg = d3.select("#vis3").append("svg")
				.attr("width", 750).attr("height", 350)			
				.attr("id", "svg3")
				.append("g")
				.attr("transform", "translate(" + parallel.margin.left + "," + parallel.margin.top + ")");

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

				parallel.plot();

		});
	},

	line : d3.line(),
	dragging : {},
	x : null,
	y : {},

	plot : function() {

		var axis = d3.axisLeft();
		var foreground;

		parallel.x = d3.scalePoint().range([0, parallel.width], 1)

		// Get list of dimensions and scale for each
		parallel.x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
			return parallel.attributes.includes(d) && (parallel.y[d] = d3.scaleLinear()
					.domain(d3.extent(data, function(p) {
						return +p[d];
					}))
					.range([parallel.height, 0]));
		}));

		foreground = parallelsvg.append("g")
			.attr("class", "foreground")
			.selectAll("path")
			.data(data)
			.enter().append("path")
			.attr("class", function(d) {
				return d.Type1 + " " + d.Type2 + " " + d.Index;
			})
			.attr("d", parallel.path);

		  // Add a group element for each dimension.
	  var g = parallelsvg.selectAll(".dimension")
	      .data(dimensions)
	    .enter().append("g")
	      .attr("class", "dimension")
	      .attr("transform", function(d) { return "translate(" + parallel.x(d) + ")"; });

	      // Add an axis and title.
	  g.append("g")
	      .attr("class", "axis")
	      .each(function(d) { d3.select(this).call(axis.scale(parallel.y[d])); })
	    .append("text")
	      .style("text-anchor", "middle")
	      .attr("y", -9)
	      .text(function(d) { return d; });

	},

	position: function(d) {
	  var v = parallel.dragging[d];
	  return v == null ? parallel.x(d) : v;
	},

	transition: function(g) {
	  return g.transition().duration(500);
	},

	// Returns the path for a given data point.
	path: function(d) {
	  return parallel.line(dimensions.map(function(p) { return [parallel.position(p), parallel.y[p](d[p])]; }));
	},
}
/* End Parallel*/

/* Start MDS */
var mds = {
	data : [],
	mdssvg : null,
	tooltip : null,

	margin : {top: 20, right: 20, bottom: 30, left: 40},
	width : 0,
	height : 0,

	init : function () {
		mds.width = 500 - mds.margin.left - mds.margin.right;
		mds.height = 350 - mds.margin.top - mds.margin.bottom;

		mdssvg = d3.select("#vis4").append("svg")
			.attr("width", 500).attr("height", 350)
			.attr("id", "svg4");

		mds.tooltip = d3.select("#vis4").append("div")
			.attr("class", "tooltip").style("opacity", 0);

		d3.csv("../Files/mds.csv", function (csv) {
			// Convert numerical values to numbers
			csv.forEach(function(d) {
				d.MDSx = +d.MDSx;
				d.MDSy = +d.MDSy;
			});

			data = csv;

			mds.plot("MDSx", "MDSy");

		});
	},

	plot : function (attr1, attr2) {
		mdssvg.selectAll("*").remove();

		// functions to set up x
		var xValue = function(d) {
			return d[attr1];
		};

		var xScale = d3.scaleLinear().range([0, mds.width]),
		xMap = function(d) {
			return xScale(xValue(d));
		},
		xAxis = d3.axisBottom().scale(xScale);

		// functions to set up y
		var yValue = function(d) {
			return d[attr2];
		}

		var yScale = d3.scaleLinear().range([mds.height, 0]),
		yMap = function(d) { 
			return yScale(yValue(d));
		},
		yAxis = d3.axisLeft().scale(yScale);

		// add graph to canvas
		var g = mdssvg.append("g").attr("transform","translate(" + mds.margin.left + "," + mds.margin.top + ")");

		// Dots won't overlap axis with these buffers
		xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
		yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

		//x-axis
		g.append("g").attr("class", "xaxis")
				.attr("transform", "translate(0," + mds.height + ")")
				.call(xAxis)
			.append("text")
				.attr("class", "label")
				.attr("x", mds.width)
				.attr("y", -6)
				.style("text-anchor", "end")
				.text(attr1);

		// y-axis
		g.append("g")
				.attr("class", "yaxis")
				.call(yAxis)
			.append("text")
				.attr("class", "label")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text(attr2);

		// draw dots
		g.selectAll(".dot")
			.data(data)
			.enter().append("circle")
			.attr("class", function(d) {
				return "dot " + d.Type1 + " " + d.Type2 + " " + d.Index;
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
	}


}
/* End MDS */