d3.csv('databreaches.csv',function (data) {
// CSV section
  var body = d3.select('#bottom')
  var selectData = [ { "text" : "all" },
                     { "text" : "1" },
                     { "text" : "2" },
                    { "text" : "3" },
                    { "text" : "4" },
                    { "text" : "5" },
                   ]

  // Select Y-axis Variable
  var span = body.append('span')
      .text('Select Sensitivity: ')
  var yInput = body.append('select')
      .attr('id','radiusSelect')
      .on('change',filter)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  body.append('br')
    
  var tooltip = d3.select("#bottom").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

  // Variables
  var body = d3.select('#bottom')
  var margin = { top: 50, right: 310, bottom: 50, left: 80 }
  var h = 500 - margin.top - margin.bottom
  var w = 1700 - margin.left - margin.right
  // Scales
  var colorScale = d3.scaleSequential(d3["interpolateYlOrRd"])
  	.domain([0, d3.max(data, function(d) { return d.severity; })]);
  var xScale = d3.scaleLinear()
    .domain([2004, 2018])
    .range([0,w])
  var yScale = d3.scaleLinear()
    .domain([
      0,
      4000000
      ])
    .range([h,0])
  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.axisBottom(xScale)
    //.tickFormat(formatPercent)
    .ticks(14).tickFormat(d3.format("d"));
  // Y-axis
  var yAxis = d3.axisLeft(yScale)
    //.tickFormat(formatPercent)
    .ticks(5)
  // Circles
  var circles2 = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d['year']) })
      .attr('cy',function (d) { return yScale(d['impact']) })
      .attr('r', function(d) { return Math.sqrt(d['records_rounded'])/.2/100; })
      .attr('stroke','gray')
      .attr('stroke-width',1)
      .attr('fill',function (d) { return colorScale(d.severity); })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(10)
          .attr('r',function(d) { return Math.sqrt(d['records_rounded'])/.2/75; })
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(10)
          .attr('r',function(d) { return Math.sqrt(d['records_rounded'])/.2/100; })
          .attr('stroke-width',1)
      })//tooltip
      .on("mouseover", function(d) {		
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltip.html(d['Entity'] + "<br/>Description: "  + d['story'] + "<br/>Year:" + d['year'] + "<br/>Records: " + d['records_lost'] + "<br/>Sector: " + d['organization'] + "")	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
        })					
        .on("mouseout", function() {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
    
    
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    
    svg.append("text")             
      .attr("transform",
            "translate(" + (w/2) + " ," + 
                           (h + margin.top + -5) + ")")
      .style("text-anchor", "middle")
      .text("Year");
  // Y-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','yAxis')
      .call(yAxis);
    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (h / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Impact of Breach (Severity * Number of Records)"); 
    
    
  var legend = svg.selectAll(".legend")
      .data(colorScale.ticks(5).slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  //console.log(colorScale);
// Add a legend for the color values.
	  /*
	  console.log(colorScale.ticks(5).slice(1).reverse()); 
  var legend = svg.selectAll(".legend")
      .data(colorScale.ticks(5).slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (w + 20) + "," + (20 + i * 20) + ")"; });

  legend.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", colorScale);

  legend.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);

  svg.append("text")
      .attr("class", "label")
      .attr("x", w + 20)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text("Severity");
	  */

  // draw legend colored rectangles
	 
  legend.append("rect")
      .attr("x", w + 60)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);
	 
  // draw legend text
  legend.append("text")
      .attr("x", w + 80)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) {
      if (d == 1){
        return "1: Email Addresses";
      }else if(d == 2){
          return "2: SSN/Personal Details";
      }else if(d == 3){
          return "3: Credit Card info";
      }else if(d == 4){
          return "4: Email password/Health Records";
      }else if(d == 5){
          return "5: Full Bank Account Details";
      }  
   })
    
// Add a legend for the color values.
  var legend = svg.selectAll(".legend")
      .data(colorScale.ticks(5).slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width + 20) + "," + (20 + i * 20) + ")"; });
	  
    
    function filter(){
       var stuff = this.value;
       //d3.selectAll('circle') // move the circles
      circles2.transition().duration(1)
      .delay(function (d,i) { return i*10})
        .attr('cy',function (d) { if(d['severity'] == stuff){return yScale(d["impact"])}else if(stuff == 'all'){return yScale(d["impact"])}else{return 0;} })
       .attr('cx',function (d) { if(d['severity'] == stuff){return xScale(d["year"])}else if(stuff == 'all'){return xScale(d["year"])}else{return 0;} })
       .attr('r',function (d) { if(d['severity'] == stuff){return Math.sqrt(d['records_rounded'])/.2/100;}else if(stuff == 'all'){return Math.sqrt(d['records_rounded'])/.2/100;}else{return 0;} })
   }
})