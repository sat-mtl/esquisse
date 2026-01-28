import * as d3 from "d3";
require("./d3.layout.chord.sort.js");
require("./d3.stretched.chord.js");

import toolsCsv from './tools.csv';
import categoriesCsv from './categories.csv';

import './style.css';
import { line, text } from "d3";

const logos = require.context('../../images/logos', true)
const logoPath = (name) => logos(name, true)

/// Forking Nadieh Bremer's Hacking a chord diagram to visualize a flow
// https://www.visualcinnamon.com/2015/08/stretched-chord/#code-for-all-intermediate-steps
// https://gist.github.com/nbremer/c11409af47b5950f0289

////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////
var screenWidth = 600,//$(window).width(),
	mobileScreen = (screenWidth > 400 ? false : true);

var margin = {left: 100, top: 10, right: 100, bottom: 10},
	width = Math.min(screenWidth, 800) - margin.left - margin.right,
	height = (mobileScreen ? 300 : Math.min(screenWidth, 800)/**5/6*/) - margin.top - margin.bottom;
			
var svg = d3.select("#tools").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
	innerRadius = outerRadius * 0.95,
	pullOutSize = 0,//(mobileScreen? 20 : 50),
	opacityDefault = 0.7, //default opacity of chords
	opacityLow = 0.02; //hover opacity of those chords not hovered over
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var tools = d3.csvParse(toolsCsv);
var categories = d3.csvParse(categoriesCsv);

var Names = Array.from(new Set(tools.flatMap(d => [d.source] )));

// https://observablehq.com/@d3/directed-chord-diagram?collection=@d3/d3-chord
var index = new Map(Names.map((name, i) => [name, i]));
var matrix = Array.from(index, () => new Array(Names.length).fill(0));
for (const {source, target} of tools) for (const t of target.split(',')) matrix[index.get(source)][index.get(t)] = 1;//+= parseInt(value);
var l = matrix.length;
var respondents = l+2, //Total number of respondents (i.e. the number that makes up the total group)
	emptyPerc = 0.9, //What % of the circle should become empty
	emptyStroke = Math.round(respondents*emptyPerc); 

// Add empty strokes
function addEmptyStrokes(){
	var index = tools.findIndex(t => t.cat === "interop");
	var r1 = Array(l+2).fill(0);
	var r2 = Array(l+2).fill(0);
	r1[l+1] = emptyStroke
	r2[index] = emptyStroke
	for (let i = 0; i < l; i++) {
		matrix[i] = matrix[i].concat([0]);
		matrix[i].splice(index,0,0);
	}
	matrix.splice(index, 0, r1);
	matrix.splice(l+1, 0, r2);
	tools.splice(index,0,{"source":"emptyStroke1"})
	tools.splice(l+1,0,{"source":"emptyStroke2"})
	Names.splice(index,0,"emptyStroke1")
	Names.splice(l+1,0,"emptyStroke2")
}
addEmptyStrokes(); // comment to toggle between circular and stretched chords

//Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
//invisible chord center vertically
var offset = 0;//(2 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/4;

//Custom sort function of the chords to keep them in the original order
function customSort(a,b) {
	return 1;
};

//Custom sort function of the chords to keep them in the original order
var chord = customChordLayout() //d3.layout.chord()//Custom sort function of the chords to keep them in the original order
	.padding(.2)
	.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
	.matrix(matrix);
	
var arc = d3.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
	.endAngle(endAngle);

var path = stretchedChord()
	.radius(innerRadius)
	.startAngle(startAngle)
	.endAngle(endAngle)
	.pullOutSize(pullOutSize);

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", fade(opacityLow))
	.on("mouseout", fade(opacityDefault));

g.append("path")
	.style("stroke", function(d,i) { var c=categories.find(c => c.id === tools[i].cat); return (c === undefined ? "none" : eval(c.color));} )
	.style("fill", function(d,i) { var c=categories.find(c => c.id === tools[i].cat); return (c === undefined ? "none" : eval(c.color));} )
	.style("pointer-events", function(d,i) { return (Names[i] === "" ? "none" : "auto"); })
	.attr("d", arc)
	.attr("transform", function(d, i) { //Pull the two slices apart
				d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
				return "translate(" + d.pullOutSize + ',' + 0 + ")";
	});

// Focus on selected tool if defined with URL query (example: https://sat-mtl.gitlab.io/tools/?t=LivePose)
window.onload = function() {
	var queries = location.search.replace('\?','').split('&');
	var selectedTool = "";
	queries.forEach(function(query){console.log(query);var q = query.split('='); if(q[0]==="t"){selectedTool=q[1];}})
	if(selectedTool !== undefined || selectedTool === "") {
		var obj = {};
		obj.index = Names.indexOf(selectedTool);
		if(obj.index > -1){
			svg.selectAll("path.chord")
			.filter(function(d) {return d.source.index !== obj.index && d.target.index !== obj.index && Names[d.source.index] !== "";})
			.transition("fadeOnArc")
			.style("opacity", opacityLow);
		}
	}
}

////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

//The text also needs to be displaced in the horizontal directions
//And also rotated with the offset in the clockwise direction
var toolNames = g.append("a")
    .attr("xlink:href", function(d,i){ return tools[i].code !== "" ? tools[i].code : tools[i].doc} )
    .append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + 35 + ",0)"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
    // .text(function(d,i) { return Names[i]; })

toolNames.selectAll("tspan.text")
    .data((d,i) => Names[i].split("-"))
    .enter()
    .append("tspan")
    .attr("class", "text")
    .text(d => (d.includes("emptyStroke") ? "" : d))
    .attr("x", 0)
    .attr("dx", 0)
    .attr("dy", (d,i) => i*10)

//   .style("opacity", opacityLow)
//   .on("mouseover", function(event, obj){d3.select(event.target).style("opacity", opacityDefault);})
//   .on("mouseout", function(event, obj){d3.select(event.target).style("opacity", opacityLow);})

////////////////////////////////////////////////////////////
////////////////////// Append Logos ////////////////////////
////////////////////////////////////////////////////////////

g.append("circle")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	.style("stroke", function(d,i) { var c=categories.find(c => c.id === tools[i].cat); return (Names[i].includes("emptyStroke") ? "none" : (c === undefined ? "gray" : eval(c.color)));} )
    .style("fill", "none")
    .attr("r", 10)
    .attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + 20 + ",0)"
	})

g.append('svg:image')
	.attr('href', function(d,i) { 
		var logo = logos.keys().find(function(l) {return l.toLowerCase().includes('./'+Names[i].toLowerCase()+'.')} ); 
		return (logo ? logoPath(logo) : undefined); } )
	.attr('x', -8)
	.attr('y', -8)
	.attr('width', 15)
	.attr('height', 15)
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize  ) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + 20 + ",0)"
		+ "rotate(" + -(d.angle * 180 / Math.PI - 90) + ")"
	})

////////////////////////////////////////////////////////////
///////////////// Append categories arcs ///////////////////
////////////////////////////////////////////////////////////

g.append("path")
    .style("stroke", function(d,i) { var c=categories.find(c => c.id === tools[i].cat); return (c === undefined ? "none" : eval(c.color));} )
	.style("fill", function(d,i) { var c=categories.find(c => c.id === tools[i].cat); return (c === undefined ? "none" : eval(c.color));} )
    .attr("d", d3.arc()
      .innerRadius(innerRadius+90)
      .outerRadius(outerRadius+90)
	.startAngle( function(d,i) { return d.startAngle + offset })
	.endAngle( function(d,i) { 
		var index = (i+1 < chord.groups().length && tools[i].cat === tools[i+1].cat ? i+1 : i);
		return chord.groups()[index].endAngle + offset
	})
    )
	.attr("transform", function(d, i) { //Pull the two slices apart
		d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
		return "translate(" + d.pullOutSize + ',' + 0 + ")";
});

var catNames = g.append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + 100 + ",0)"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
	.style("fill", function(d,i) { var c=categories.find(c => c.id === tools[i].cat); return (c === undefined ? "none" : eval(c.color));} )
	// .text(function(d,i) { 
	// 	if (i==0 || tools[i-1].cat !== tools[i].cat){
	// 		var c=categories.find(c => c.id === tools[i].cat); 
	// 		return (c === undefined ? "none" : c.en);}
	// 	return ""
	// })

// Get language from document otherwise from navigator, fr otherwise en
function lang() {
	var l = document.documentElement.lang;
	if (l !== "fr" && l !== "en") l = navigator.language.indexOf('fr') > -1 ? "fr" : "en";
	return l;
}

catNames.selectAll("tspan.text")
    .data(function(d,i){
		var name = "";
		if (i==0 || tools[i-1].cat !== tools[i].cat){
			var c=categories.find(c => c.id === tools[i].cat);
			var l = document.documentElement.lang;
			if (l !== "fr" && l !== "en") l = navigator.language.indexOf('fr') > -1 ? "fr" : "en";
			name = (c === undefined ? "none" : c[lang()]);
		}
		return name.split(/[ ]+/)
	})
    .enter()
    .append("tspan")
    .attr("class", "text")
    .text(d => d)
    .attr("x", 0)
    .attr("dx", 0)
    .attr("dy", (d,i) => i*10)
	.attr("transform", function(d,i) { 
		return "rotate(105)"
	})

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////

var chords = wrapper.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", function(d,i) { var c=categories.find(c => c.id === tools[d.target.index].cat); return (c === undefined ? "none" : eval(c.color));} )
	.style("stroke-width", 1)
	.style("fill", function(d,i) { var c=categories.find(c => c.id === tools[d.target.index].cat); return (c === undefined ? "none" : eval(c.color));} )    
	.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
	.style("pointer-events", function(d,i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
	.attr("d", path);	

////////////////////////////////////////////////////////////
///////////////////////// Tooltip //////////////////////////
////////////////////////////////////////////////////////////

//Arcs
// g.append("title")	
// 	.text(function(d, i) {return Math.round(d.value) + " connection(s) in " + Names[i];});
	
// //Chords
// chords.append("title")
// 	.text(function(d) {
// 		return [Math.round(d.source.value), " connection(s) from ", Names[d.target.index], " to ", Names[d.source.index]].join(""); 
// 	});
	
////////////////////////////////////////////////////////////
///////////////////////// Credits //////////////////////////
////////////////////////////////////////////////////////////

d3.select("#tools")
	.append("div")
	.attr("id","credits")
	.html(function(){
		var l=lang();
		var credits = "";
		credits += (l==="fr" ? 'Créé par ' : 'Created by ');
		credits += '<a href="https://frisson.re">Christian Frisson</a>';
		credits += (l==="fr" ? ' et inspiré par ' : ' and inspired by ');
		credits += '<a href="https://www.visualcinnamon.com/2015/08/stretched-chord/">Nadieh Brehmer</a>';
		credits += '.';
		return credits;
	})

////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(event, obj) {
	svg.selectAll("path.chord")
		.filter(function(d) { return d.source.index !== obj.index && d.target.index !== obj.index && Names[d.source.index] !== ""; })
		.transition("fadeOnArc")
		.style("opacity", opacity);
  };
}//fade
