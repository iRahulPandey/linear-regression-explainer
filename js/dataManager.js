// js/dataManager.js
/**
 * Manages data points for the linear regression visualization
 */

// Initial data points
const initialData = [
    {x: 1, y: 2, isOutlier: false},
    {x: 2, y: 1, isOutlier: false},
    {x: 3, y: 3, isOutlier: false},
    {x: 4, y: 4, isOutlier: false},
    {x: 5, y: 3.5, isOutlier: false},
    {x: 6, y: 5.5, isOutlier: false},
    {x: 7, y: 7, isOutlier: false}
];

// Current data points
let data = [...initialData];

// Counter for generating different outliers
let outlierCounter = 0;

/**
 * Reset data to initial state
 * @returns {Array} - The reset data array
 */
function resetData() {
    data = [...initialData];
    outlierCounter = 0;
    return data;
}

/**
 * Add a new data point
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {boolean} isOutlier - Whether this is an outlier point
 * @returns {Object} - The added data point
 */
function addDataPoint(x, y, isOutlier = false) {
    const newPoint = {x, y, isOutlier};
    data.push(newPoint);
    return newPoint;
}

/**
 * Remove a data point
 * @param {Object} point - The point to remove
 * @returns {Array} - The updated data array
 */
function removeDataPoint(point) {
    data = data.filter(p => p !== point);
    return data;
}

/**
 * Generate an outlier point
 * @param {number} slope - Current regression line slope
 * @param {number} intercept - Current regression line intercept
 * @returns {Object} - The generated outlier point
 */
function generateOutlier(slope, intercept) {
    // Increment outlier counter
    outlierCounter++;
    
    // Determine which quadrant to place the outlier based on the counter
    const quadrant = outlierCounter % 4;
    
    let position;
    switch(quadrant) {
        case 0: // Top-left quadrant
            position = {
                x: randomInRange(1, 4),
                y: randomInRange(7, 10)
            };
            break;
        case 1: // Top-right quadrant
            position = {
                x: randomInRange(7, 10),
                y: randomInRange(7, 10)
            };
            break;
        case 2: // Bottom-right quadrant
            position = {
                x: randomInRange(7, 10),
                y: randomInRange(0.5, 3)
            };
            break;
        case 3: // Bottom-left quadrant
            position = {
                x: randomInRange(1, 4),
                y: randomInRange(0.5, 3)
            };
            break;
    }
    
    // Calculate the predicted y value for this x
    const predictedY = slope * position.x + intercept;
    
    // Make sure the outlier is sufficiently far from the regression line
    const distanceFromLine = Math.abs(position.y - predictedY);
    if (distanceFromLine < 3) {
        // If it's too close to the line, move it perpendicular to the line
        const direction = Math.random() > 0.5 ? 1 : -1;
        position.y = predictedY + direction * (3 + Math.random() * 2);
        
        // Ensure y stays within the visible area (0-10)
        position.y = clamp(position.y, 0.5, 9.5);
    }
    
    return addDataPoint(position.x, position.y, true);
}