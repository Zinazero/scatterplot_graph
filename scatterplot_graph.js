// Fetching data from the provided URL
fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json()) // Parsing the response as JSON
    .then((data) => {
      // Importing the necessary functions from the d3 library
      const parseTime = d3.timeParse("%M:%S"); // Function to parse time in the format "%M:%S"
  
      // Extracting the time values from the data and parsing them
      const time = data.map((d) => parseTime(d.Time));
  
      // Extracting the year values from the data
      const years = data.map((d) => d.Year);
  
      // Creating a tooltip element and setting its initial opacity to 0
      const tooltip = d3
        .select("#graphContainer")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
  
      // Defining the dimensions of the SVG container and the padding
      const w = 1000;
      const h = 600;
      const padding = 50;
  
      // Creating scales for the x and y axes
      const xScale = d3
        .scaleLinear()
        .domain([1993, 2016])
        .range([padding, w - padding]);
      const yScale = d3
        .scaleTime()
        .domain([d3.max(time), d3.min(time)]) // Reversing the time scale so that the lower times are at the bottom
        .range([h - padding, padding]);
  
      // Creating the SVG element
      const svg = d3
        .select("#graphContainer")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
  
      // Adding circles to the SVG for each data point
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.Year)) // Setting the x-coordinate of the circle based on the year
        .attr("cy", (_, i) => yScale(time[i])) // Setting the y-coordinate of the circle based on the parsed time
        .attr("r", 5) // Setting the radius of the circle
        .attr("class", "dot") // Adding the "dot" class to the circle for styling
        .attr("data-xvalue", (d) => d.Year) // Storing the year value as a data attribute
        .attr("data-yvalue", (_, i) => time[i]) // Storing the parsed time value as a data attribute
        .attr("fill", function (d) {
          if (d.Doping === "") {
            return "orange"; // Setting the fill color to orange for data points without doping allegations
          } else {
            return "blue"; // Setting the fill color to blue for data points with doping allegations
          }
        })
        .attr("stroke", "black") // Adding a black stroke to the circles
        .on("mouseover", function (event, d) {
          // Function to handle mouseover event for the circles
          tooltip.transition().duration(100).style("opacity", 0.9); // Making the tooltip visible
  
          tooltip
            .html(
              d.Name +
                ": " +
                d.Nationality +
                "<br>" +
                "Year: " +
                d.Year +
                ", Time: " +
                d.Time +
                "<br><br>" +
                d.Doping
            )
            .style("left", `${event.pageX + 10}px`) // Positioning the tooltip slightly to the right of the mouse pointer
            .style("top", `${event.pageY - 50}px`) // Positioning the tooltip slightly above the mouse pointer
            .attr("data-year", d.Year); // Storing the year value as a data attribute
        })
        .on("mouseout", (d) => {
          // Function to handle mouseout event for the circles
          tooltip.transition().duration(100).style("opacity", 0); // Making the tooltip invisible
        });
  
      // Creating x and y axes using the scales defined earlier
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); // Formatting the tick labels as integers
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")); // Formatting the tick labels as time
  
      // Appending the x-axis to the SVG
      svg
        .append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis)
        .attr("id", "x-axis");
  
      // Appending the y-axis to the SVG
      svg
        .append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis)
        .attr("id", "y-axis");
  
      // Creating a legend with color codes and labels
      const legendData = [
        { label: "No doping allegations", color: "orange" },
        { label: "Riders with doping allegations", color: "blue" }
      ];
  
      const legend = svg
        .append("g")
        .attr("id", "legend")
        .attr(
          "transform",
          "translate(" + (w - padding - 200) + "," + (h - padding - 300) + ")"
        );
  
      // Adding legend items (rectangles and text) for each data entry in the legendData array
      const legendItems = legend
        .selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => "translate(0, " + i * 20 + ")");
  
      // Adding colored rectangles to the legend
      legendItems
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", (d) => d.color);
  
      // Adding labels to the legend
      legendItems
        .append("text")
        .attr("x", 15)
        .attr("y", 10)
        .text((d) => d.label);
    });
  