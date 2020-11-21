/**
 * Returns the temperatures between two dates in a specified country
 * 
 * Needs ```temperatures.js```
 * 
 * @param {string} isoCode Country ISO-3 code
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @returns 
 */
function getTemperaturesByCountry(isoCode, dateFrom, dateTo) {
    return dataTemperatures.filter(d => d.dt >= dateFrom && d.dt <= dateTo).map(d => d.data[isoCode]);
}