var csv = [];
var svg;
var svgType;
var svgGen;

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

var gens = [
	1, 2, 3, 4, 5, 6
];


window.onload = function () {

	$("#attrForm").change(function () {
		$(this).val($("input[name='attr']:checked").val());
		$("#attrTitle").text($("input[name='attr']:checked").val());
		show();
	});

	$("#binForm").change(function () {
		$(this).val($("input[name='bin']:checked").val());
		$("#binTitle").text($("input[name='bin']:checked").val());
		show();
	});

	svgType = d3.select("#content").append("svg")
		.attr("width", 1000).attr("height", 700)
		.attr("id", "svgType")
		.on("click", nextAttr);

	svgGen = d3.select("#content").append("svg")
		.attr("width", 1000).attr("height", 700)
		.attr("id", "svgGen")
		.on("click", nextAttr);

	$("svg").hide();

	d3.csv("../Files/Pokemon.csv", function (data) {
		csv = data;

		// Default doing Bin: Type and Attr: Attack
			
		$("input[value='Type']").prop('checked', true);
		$("input[value='Attack']").click();
		$(".filter").fadeIn(1000);

	});
}

var getAvgType = function (type, attr) {
	var total = 0;
	var count = 0;

	for (var i = 0; i < csv.length; i++) {
		var pokemon = csv[i];

		if (pokemon.Type1 != type && pokemon.Type2 != type)
			continue;

		if (attr == "Male" || attr == "Female") {
			total += parseFloat(pokemon[attr]);
		}
		else {
			total += parseInt(pokemon[attr]);
		}
		count++;
	}

	return total/count;
};

var getAvgGen = function (gen, attr) {
	var total = 0;
	var count = 0;

	for (var i = 0; i < csv.length; i++) {
		var pokemon = csv[i];

		if (pokemon.Generation != gen)
			continue;

		if (attr == "Male" || attr == "Female") {
			total += parseFloat(pokemon[attr]);
		}
		else {
			total += parseInt(pokemon[attr]);
		}

		count++;
	}

	return total/count;
}

var getHeight = function (key, attr) {
	if (isType()) {
		var height = getAvgType(key, attr);
	}
	else if (isGen()) {
		var height = getAvgGen(key, attr);
	}

	if (attr != "Total") {
		height *= 5;
	}

	if (attr == "Male" || attr == "Female") {
		height *= 200;
		height = Math.round(height);
	}

	return height;
}

var isType = function () {
	return $("input[value='Type']").is(':checked');
}

var isGen = function () {
	return $("input[value='Generation']").is(':checked');
}

var getAttr = function () {
	return $("#attrForm").val();
}

var show = function () {
	var attr = $("#attrForm").val();

	var heightArray = [];
	if (isType()) {
		$("#svgGen").hide();
		$("#svgType").fadeIn();

		svg = svgType;
		for(var i = 0; i < types.length; i++) {

			var height = getHeight(types[i], attr);
			heightArray.push(height);
		}

		showType(heightArray);
	}
	else if (isGen()) {
		$("#svgType").hide();
		$("#svgGen").fadeIn();
		svg = svgGen;
		for(var i = 0; i < gens.length; i++) {

			var height = getHeight(gens[i], attr);
			heightArray.push(height)
		}

		showGen(heightArray);
	}
}

var showType = function(heightArray) {
		
		var bar = $(".Normal");

		if (!bar.length) {

			svg.selectAll("rect").data(heightArray)
				.enter()
				.append("rect").attr("width", 45)
				.attr("height", function (d) { return d; })
				.attr("x", function (d, i) { return i*45 + 10*i + 7; })
				.attr("class", function(d, i) { return "bar " + types[i] })
				.attr("y", function (d, i) { return svg.attr("height") - d; })
				.on("mouseover", zoomBar)
				.on("mouseout", shrinkBar);

			svg.selectAll("text")
				.data(heightArray)
				.enter()
				.append("text")
				.text(getTip)
				.attr("x", function (d, i) { return i*45 + 10*i + 7 + 22; })
				.attr("y", function (d, i) { return svg.attr("height") - d - 3; })
				.attr("text-anchor", "middle").style("opacity", 0)
				.attr("class", function(d, i) { return "tip " + types[i]});
		

		}
		else {
				svg.selectAll("rect").data(heightArray)
					.transition().duration(600)
					.attr("y", function(d) { return svg.attr("height") - d; })
					.attr("height", function(d) {return d;});

				svg.selectAll("text").data(heightArray).transition().duration(600)
				.attr("y", function(d) { return svg.attr("height") - d - 3})
				.text(getTip);
		}
}

var showGen =function(heightArray) {

		var bar = $(".gen1");

		if (!bar.length) {


			svg.selectAll("rect").data(heightArray)
				.enter()
				.append("rect").attr("width", 157)
				.attr("height", function (d) { return d; })
				.attr("x", function (d, i) { return i*157 + 10*i + 5; })
				.attr("class", function(d, i) { return "bar gen" + gens[i] })
				.attr("y", function (d, i) { return svg.attr("height") - d; })
				.on("mouseover", zoomBar)
				.on("mouseout", shrinkBar);

			svg.selectAll("text")
				.data(heightArray)
				.enter()
				.append("text")
				.text(getTip)
				.attr("x", function (d, i) { return i*157 + 10*i + 7 + 76; })
				.attr("y", function (d, i) { return svg.attr("height") - d - 3; })
				.attr("text-anchor", "middle").style("opacity", 0)
				.attr("class", function(d, i) { return "tip gen" + gens[i]});
			}
		else {
				svg.selectAll("rect").data(heightArray)
					.transition().duration(600)
					.attr("y", function(d) { return svg.attr("height") - d; })
					.attr("height", function(d) {return d;});

				svg.selectAll("text").data(heightArray).transition().duration(600)
				.attr("y", function(d) { return svg.attr("height") - d - 3})
				.text(getTip);
			}
}

var getTip = function(d, i) {

	var label = ((isType()) ? types[i] : "Gen " + gens[i]) + " ";

	if (getAttr() == "Total")
		return label + Math.round(d);
	else if (getAttr() == "Male" || getAttr() == "Female")
		return label + Math.round(d) / 1000;
	else
		return label + Math.round(d) / 5;
}

var nextAttr = function() {
	var next = $("input[name='attr']:checked").next();
	if (!next.length) {
		$("input[value='Attack']").click();
		return
	}
	next.click();
}

var orig = {};

var zooming = false;

var zoomBar = function(d, i) {

	if (zooming) return;

	zooming = true;

	var select;
	if (isType()) {
		select = "text." + types[i];
	}
	else if (isGen()) {
		select = "text.gen" + gens[i];
	}

	orig.TipY = d3.select(select).attr("y");
	d3.select(select).transition().duration(300)
		.style("opacity", 100).attr("y", function() { 
			return parseInt(d3.select(this).attr("y") - 100);
		});	
	

	var bar = d3.select(this);
	orig.X = parseInt(bar.attr("x"));
	orig.Y = parseInt(bar.attr("y"));
	orig.W = parseInt(bar.attr("width"));
	orig.H = parseInt(bar.attr("height"));

	bar.transition().duration(300).attr("x", orig.X - 5)
		.attr("width", orig.W + 10)
		.attr("height", orig.H + 100).attr("y", bar.attr("y") - 100);
}

var shrinkBar = function (d, i) {
	if (isType()) {
		d3.select("text." + types[i]).transition().duration(300)
			.style("opacity", 0).attr("y", function() { return orig.TipY;});
	}
	else if (isGen()) {
		d3.select("text.gen" + gens[i]).transition().duration(300)
			.style("opacity", 0).attr("y", function() { return orig.TipY;});	
	}

	var bar = d3.select(this);

	bar.transition().duration(300).attr("x", orig.X).attr("width", orig.W)
		.attr("height", orig.H).attr("y", orig.Y);

	zooming = false;
}