// js/gradientDescent.js
/**
 * Implements gradient descent for linear regression
 */

/**
 * Run gradient descent to find optimal parameters
 * @param {Array} data - Array of data points {x,y}
 * @param {number} initialSlope - Starting slope
 * @param {number} initialIntercept - Starting intercept
 * @param {function} updateCallback - Function to call on each iteration with new parameters
 * @param {function} completionCallback - Function to call when complete
 */
function runGradientDescent(data, initialSlope, initialIntercept, updateCallback, completionCallback) {
    if (!data || data.length < 2) {
        alert("Please add at least 2 data points to run gradient descent");
        if (completionCallback) completionCallback();
        return;
    }
    
    // Parameters
    let slope = initialSlope;
    let intercept = initialIntercept;
    const learningRate = 0.01;
    const iterations = 100;
    const delay = 50; // ms between iterations for animation
    
    let i = 0;
    const interval = setInterval(() => {
        if (i >= iterations) {
            clearInterval(interval);
            if (completionCallback) completionCallback();
            return;
        }
        
        // Calculate gradients
        let mGradient = 0;
        let bGradient = 0;
        
        data.forEach(point => {
            const x = point.x;
            const y = point.y;
            const predicted = slope * x + intercept;
            const error = predicted - y;
            
            mGradient += error * x;
            bGradient += error;
        });
        
        mGradient = (2 / data.length) * mGradient;
        bGradient = (2 / data.length) * bGradient;
        
        // Update parameters
        slope = slope - learningRate * mGradient;
        intercept = intercept - learningRate * bGradient;
        
        // Clamp values to reasonable ranges
        slope = clamp(slope, -2, 2);
        intercept = clamp(intercept, -2, 2);
        
        // Call update callback with new parameters
        if (updateCallback) updateCallback(slope, intercept);
        
        i++;
    }, delay);
}