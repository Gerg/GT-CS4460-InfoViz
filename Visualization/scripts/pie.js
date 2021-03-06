(function($) {
	
	/* 
	 * Add this property to DOM elements, allowing 
	 * us to easily draw a pie chart on any element in the HTML page
	 */
	$.fn.d3InitPieGraph = function(options) {
		// Default options
		var defaults = {
		   		languages: null,
		   		data: [{"data":{"count":"120060"},"name":"en"}, {"data":{"count":"26096"},"name":"ja"},{"data":{"count":"16562"},"name":"es"},  {"data":{"count":"8018"},"name":"pt"},{"data":{"count":"1480"},"name":"ko"},   {"data":{"count":"971"},"name":"fr"}, {"data":{"count":"667"},"name":"de"},{"data":{"count":"531"},"name":"tr"},	{"data":{"count":"494"},"name":"ru"},{"data":{"count":"449"},"name":"it"}],
		   		width: 500,
		   		height: 500,
				radius: 250,
		   		padding: 30,
				what: this.selector,
				self: this
		 		};
		var options = $.extend(defaults, options);
			
			
		return this.each(function(){
			this.options = options;
			
			/** 
			 * Data making 
		 	 */
			// Find the total number of tweets in the defined data set
			total = 0;
			for (i = 0; i < this.options.data.length; i++)
				total += parseInt(this.options.data[i].data.count);
			// Make array of percentages representative of each language
			percentData = new Array();
			for (i = 0; i < this.options.data.length; i++)
				percentData[i] = parseInt(this.options.data[i].data.count)/total;
			
			
			/* D3 Magic */
		    pieData = d3.layout.pie().sort(d3.descending);

		    arc = d3.svg.arc().innerRadius(this.options.radius * 0).outerRadius(this.options.radius*.8); // affects inner and outer radii
				
			var vis = d3.select(this.options.what)
						    .append("svg:svg")
						    .data([percentData])
						    .attr("width", this.options.width)
						    .attr("height", this.options.height);
			var tooltip = $('#tooltip');
			
			var arcs = vis.selectAll("g.arc")
						    .data(pieData)
						  	.enter()
							.append("svg:g")
						    .attr("class", "arc")
						    .attr("transform", "translate(" + this.options.radius + "," + this.options.radius + ")");
			
			var paths = arcs.append("svg:path")
							.attr("fill", function(d, i) { return options.languages[options.data[i].name].color; }) // fills the pie piece with the color corresponding to the language
						    .attr("d", arc)
							.attr("class", "pie-piece")
							.attr("id", function(d, i) { return 'pie-piece-'+options.languages[options.data[i].name].abbr; })
							// animate the color of the pie piece outline when moused over, set the tooltip to visible
							.on("mouseover", function(d,i) {
									brushLang(options.languages[options.data[i].name].abbr);
									return tooltip.stop().fadeIn();
								}) // sets the tooltip to visible
							// define the location of the tooltip and define the text displayed in the tooltip
							.on("mousemove", function(d, i){
								 	return tooltip
									.css({opacity: 1, top:(event.clientY + $(window).scrollTop()+10),left:(event.clientX+10)}) // defines location of tooltip
									.html('<section><strong>'+options.languages[options.data[i].name].name + ": </strong>" + options.data[i].data.count + " tweets" + 
									 	" (" + (d.value*100).toFixed(3) + "%)");
								}) // defines text of tooltip
							// return the pie piece outline to its original color when the mouse leaves its area
							.on("mouseout", function(d,i) { 
									unBrush(options.languages[options.data[i].name].abbr);
									d3.select(this).transition().duration(0)
									//.attr("fill", color[i])
									.attr("stroke", null) // removes the outline from the previously selected pie piece
								 	return tooltip.stop().fadeOut();
								}); // hides the tooltip when it exits the chart
		
			vis.arcs 	= arcs;
			vis.paths 	= paths;
		
			$(this).data('viz', vis);
			$(this).data('tooltip-div',tooltip);
		
		
			// animation of initial drawing of pie chart	
			paths.transition()
			    .ease("cubic-in-out") // defines the timing function
			    .duration(450) // defines duration of transition
			    .attrTween("d", tweenPie);

			// function to perform interpolation
			function tweenPie(b) {
			  b.innerRadius = 0;
			  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
			  return function(t) {
			    return arc(i(t));
			  };
			}
			
			

			
		});
	}
})(jQuery);				






/*
 * Function to return the name of the languange when a shortened version of the language
 * name is inputted.
*/
function getName(str) {
	if (str == "en")
		return "English";
	else if (str == "ja")
		return "Japanese";
	else if (str == "es")
		return "Spanish";
	else if (str == "pt")
		return "Portuguese";
	else if (str == "ko")
		return "Korean";
	else if (str == "fr")
		return "French";
	else if (str == "de")
		return "German";
	else if (str == "tr")
		return "Turkish";
	else if (str == "ru")
		return "Russian";
	else if (str == "it")
		return "Italian";
	else
		return null;
}