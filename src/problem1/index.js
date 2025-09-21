/**
 * Calculates the sum of all positive integers from 1 to n using an iterative approach.
 * Time complexity: O(n), Space complexity: O(1)
 * 
 * @param {number} n - The upper limit (inclusive) for the sum calculation
 * @returns {number} The sum of integers from 1 to n
 */
const sum_to_n_a = function(n) {
    // Handle edge cases
    if (n < 1 || !Number.isInteger(n)) {
        return 0;
    }
    
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

/**
 * Calculates the sum of all positive integers from 1 to n using the arithmetic series formula.
 * This is the most efficient approach with constant time complexity.
 * Formula: n * (n + 1) / 2
 * Time complexity: O(1), Space complexity: O(1)
 * 
 * @param {number} n - The upper limit (inclusive) for the sum calculation
 * @returns {number} The sum of integers from 1 to n
 */
const sum_to_n_b = function(n) {
    // Handle edge cases
    if (n < 1 || !Number.isInteger(n)) {
        return 0;
    }
    
    return (n * (n + 1)) / 2;
};

/**
 * Calculates the sum of all positive integers from 1 to n using recursion.
 * Note: This approach is less efficient for large values of n due to call stack overhead.
 * Time complexity: O(n), Space complexity: O(n) due to call stack
 * 
 * @param {number} n - The upper limit (inclusive) for the sum calculation
 * @returns {number} The sum of integers from 1 to n
 */
const sum_to_n_c = function(n) {
    // Handle edge cases
    if (n < 1 || !Number.isInteger(n)) {
        return 0;
    }
    
    // Base cases
    if (n === 1) return 1;
    
    return n + sum_to_n_c(n - 1);
};