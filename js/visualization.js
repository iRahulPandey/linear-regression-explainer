// js/visualization.js
/**
 * Main visualization code for linear regression explainer
 */

let svg, g;
let xScale, yScale;
let width, height, margin, innerWidth, innerHeight;
let regressionLine, errorLinesGroup, pointsGroup;
let slope = 1.0;
let intercept = 0.0;

/**
 * Initialize the visualization
 */
function initVisualization() {
    // Set up dimensions
    svg = d3.select("#plot");
    width = +svg.attr("width");
    height = +svg.attr("height");
    margin = {top: 40, right: 40, bottom: 60, left: 60};
    innerWidth = width - margin.left - margin.right;
    innerHeight = height - margin.top - margin.bottom;
    
    // Add the main group element
    g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Set up scales
    xScale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, innerWidth]);
    
    yScale = d3.scaleLinear()
        .domain([0, 10])
        .range([innerHeight, 0]);
    
    // Add axes
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));
    
    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));
    
    // Add axis labels
    g.append("text")
        .attr("class", "x-axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("X");
    
    g.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Y");
    
    // Add the regression line
    regressionLine = g.append("line")
        .attr("class", "regression-line");
    
    // Group for the error lines
    errorLinesGroup = g.append("g")
        .attr("class", "error-lines-group");
    
    // Add the data points group
    pointsGroup = g.append("g")
        .attr("class", "points-group");
    
    // Initialize the visualization with data
    updateVisualization();
    
    // Set up event handlers
    setupEventHandlers();
}

/**
 * Update the visualization with current data and parameters
 */
function updateVisualization() {
    // Update regression line
    const x1 = 0;
    const y1 = slope * x1 + intercept;
    const x2 = 10;
    const y2 = slope * x2 + intercept;
    
    regressionLine
        .attr("x1", xScale(x1))
        .attr("y1", yScale(y1))
        .attr("x2", xScale(x2))
        .attr("y2", yScale(y2));
    
    // Update error lines
    const errorLines = errorLinesGroup.selectAll(".error-line")
        .data(data);
    
    errorLines.exit().remove();
    
    errorLines.enter()
        .append("line")
        .attr("class", "error-line")
        .merge(errorLines)
        .attr("x1", d => xScale(d.x))
        .attr("y1", d => yScale(d.y))
        .attr("x2", d => xScale(d.x))
        .attr("y2", d => yScale(slope * d.x + intercept));
    
    // Update data points
    const points = pointsGroup.selectAll(".data-point")
        .data(data);
    
    points.exit().remove();
    
    points.enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("r", 6)
        .merge(points)
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .classed("outlier-point", d => d.isOutlier)
        .style("fill", d => d.isOutlier ? "var(--outlier-color)" : "var(--primary-color)")
        .style("stroke", "#fff")
        .style("stroke-width", 1.5)
        .on("click", function(event, d) {
            event.stopPropagation();
            removeDataPoint(d);
            updateVisualization();
            updateMetricsDisplay(calculateMetrics(data, slope, intercept));
        });
        updateMetricsDisplay(calculateMetrics(data, slope, intercept));
}

/**
 * Set up event handlers for the visualization
 */
function setupEventHandlers() {
    // Add click handler to add points
    svg.on("click", function(event) {
        if (event.target.tagName === "svg" || event.target.classList.contains("plot-container")) {
            const [x, y] = d3.pointer(event, g.node());
            if (x >= 0 && x <= innerWidth && y >= 0 && y <= innerHeight) {
                const newX = xScale.invert(x);
                const newY = yScale.invert(y);
                addDataPoint(newX, newY, false);
                updateVisualization();
            }
        }
    });
    
    // Add slope slider handler
    d3.select("#slope").on("input", function() {
        slope = +this.value;
        d3.select("#slope-value").text(formatNumber(slope, 1));
        updateVisualization();
    });
    
    // Add intercept slider handler
    d3.select("#intercept").on("input", function() {
        intercept = +this.value;
        d3.select("#intercept-value").text(formatNumber(intercept, 1));
        updateVisualization();
    });
    
    // Add reset button handler
    d3.select("#reset-data").on("click", function() {
        resetData();
        slope = 1.0;
        intercept = 0.0;
        
        // Update sliders
        d3.select("#slope").property("value", slope);
        d3.select("#slope-value").text(formatNumber(slope, 1));
        
        d3.select("#intercept").property("value", intercept);
        d3.select("#intercept-value").text(formatNumber(intercept, 1));
        
        updateVisualization();
    });
    
    // Add gradient descent button handler
    d3.select("#run-gradient-descent").on("click", function() {
        const button = d3.select(this);
        button.property("disabled", true);
        button.text("Running...");
        
        runGradientDescent(
            data, 
            slope, 
            intercept, 
            (newSlope, newIntercept) => {
                slope = newSlope;
                intercept = newIntercept;
                
                // Update UI
                d3.select("#slope").property("value", slope);
                d3.select("#slope-value").text(formatNumber(slope, 2));
                
                d3.select("#intercept").property("value", intercept);
                d3.select("#intercept-value").text(formatNumber(intercept, 2));
                
                updateVisualization();
            },
            () => {
                button.property("disabled", false);
                button.text("Run Gradient Descent");
            }
        );
    });
    
    // Add outlier button handler
    d3.select("#add-outlier").on("click", function() {
        generateOutlier(slope, intercept);
        updateVisualization();
    });
}