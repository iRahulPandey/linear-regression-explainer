// js/metrics.js
/**
 * Calculation of various error metrics for linear regression
 */

/**
 * Calculate all regression metrics
 * @param {Array} data - Array of data points {x,y}
 * @param {number} slope - Slope of the regression line
 * @param {number} intercept - Intercept of the regression line
 * @returns {Object} - Object containing all calculated metrics
 */
function calculateMetrics(data, slope, intercept) {
    if (data.length === 0) return {
        sse: 0, 
        mse: 0, 
        rmse: 0, 
        mae: 0, 
        r2: 0
    };
    
    // Function to predict y value
    const predictY = x => slope * x + intercept;
    
    // Calculate errors
    const errors = data.map(point => {
        const predicted = predictY(point.x);
        return point.y - predicted;
    });
    
    const squaredErrors = errors.map(error => error * error);
    const absErrors = errors.map(error => Math.abs(error));
    
    // Sum of Squared Errors
    const sse = squaredErrors.reduce((sum, error) => sum + error, 0);
    
    // Mean Squared Error
    const mse = sse / data.length;
    
    // Root Mean Squared Error
    const rmse = Math.sqrt(mse);
    
    // Mean Absolute Error
    const mae = absErrors.reduce((sum, error) => sum + error, 0) / data.length;
    
    // R-Squared
    const yMean = data.reduce((sum, point) => sum + point.y, 0) / data.length;
    const totalSumSquares = data.reduce((sum, point) => sum + Math.pow(point.y - yMean, 2), 0);
    const r2 = totalSumSquares === 0 ? 0 : 1 - (sse / totalSumSquares);
    
    return {
        sse: formatNumber(sse),
        mse: formatNumber(mse),
        rmse: formatNumber(rmse),
        mae: formatNumber(mae),
        r2: formatNumber(r2)
    };
}

/**
 * Update the metrics display in the UI
 * @param {Object} metrics - The metrics object returned from calculateMetrics
 */
function updateMetricsDisplay(metrics) {
    document.getElementById("sse-value").textContent = metrics.sse;
    document.getElementById("mse-value").textContent = metrics.mse;
    document.getElementById("rmse-value").textContent = metrics.rmse;
    document.getElementById("mae-value").textContent = metrics.mae;
    document.getElementById("r2-value").textContent = metrics.r2;
}