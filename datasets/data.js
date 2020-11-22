/**
 * Returns the temperatures between two dates in a specified country
 * 
 * Needs ```temperatures.js```
 * 
 * @param {string} isoCode Country ISO-3 code
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @returns An array of objects ```[{ date: "1900-01-01", temp: 25.5 }]```
 */
function getTemperaturesByCountry(isoCode, dateFrom, dateTo) {
    return dataTemperatures.filter(d => d.dt >= dateFrom && d.dt <= dateTo).map(d => {
        return { date: d.dt, temp: d.data[isoCode] };
    });
}

/**
 * Returns the CO2 levels between two dates
 * 
 * Needs ```co2.js```
 * 
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @returns An array of objects ```[{ date: "1900-01-01", co2: 25.5 }]```
 */
function getCO2(dateFrom, dateTo) {
    return dataCO2.filter(d => d.dt >= dateFrom && d.dt <= dateTo).map(d => {
        return { date: d.dt, co2: d.value };
    });
}


/**
 * Returns the number of disasters between two dates in a specified country
 * 
 * Needs ```disasters.js```
 * 
 * @param {string} isoCode Country ISO-3 code
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @returns An array of objects ```[{ date: "1900-01-01", temp: 25.5 }]```
 */
// function getDisastersByCountry(isoCode, dateFrom, dateTo) {
//     return dataDisasters.filter(d => d.dt >= dateFrom && d.dt <= dateTo).map(d => {
//         return { date: d.dt, temp: d.data[isoCode] };
//     });
// }

/**
 * Returns the global world temperatures between two dates
 * 
 * Needs ```temperatures.js```
 * 
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @returns An array of float
 */
function getTemperatures(dateFrom, dateTo) {
    return dataTemperatures.filter(d => d.dt >= dateFrom && d.dt <= dateTo).map(d => {
        let sum = 0;
        let cnt = 0;
        for (let t in d.data) {
            sum += d.data[t];
            cnt++;
        }
        return sum / cnt;
    });
}