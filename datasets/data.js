/* Utility functions */

function getMonth(dt) {
    let sp = dt.split("-");
    return sp[0] + "-" + sp[1].padStart(2, '0');
}


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
 * Returns the number of disasters in a specified country between two dates
 * 
 * Needs ```disasters.js```
 * 
 * @param {string} isoCode Country ISO-3 code
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @returns An object ```{"1900-01": 5, "1900-04": 1, ... }```
 */
function getDisastersByCountry(isoCode, dateFrom, dateTo) {
    return dataDisasters.filter(d => d.dt >= dateFrom && d.dt <= dateTo && d.ISO == isoCode).reduce(function(rv, x) {
        let m = getMonth(x.dt);
        rv[m] = (rv[m] || 0) + 1;
        return rv;
      }, {});
}

/**
 * Returns the disasters in a specified country during a specified month
 * 
 * Needs ```disasters.js```
 * 
 * @param {string} date Date in the given month
 * @returns An array of objects ```[{ date: "1900-01-01", temp: 25.5 }]```
 */
function getDisastersByMonth(date) {
    return dataDisasters.filter(d => getMonth(d.dt) == getMonth(date)).reduce(function(rv, x) {
        (rv[x.ISO] = rv[x.ISO] || []).push(x);
        return rv;
      }, {});
}

/**
 * Returns the number of disasters in the world between two dates
 * 
 * Needs ```disasters.js```
 * 
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @returns An object ```{"1900-01": 7, "1900-03": 10, ... }```
 */
function getDisasters(dateFrom, dateTo) {
    return dataDisasters.filter(d => d.dt >= dateFrom && d.dt <= dateTo).reduce(function(rv, x) {
        let m = getMonth(x.dt);
        rv[m] = (rv[m] || 0) + 1;
        return rv;
      }, {});
}

/**
 * Returns the global world temperatures between two dates
 * 
 * Needs ```temperatures.js```
 * 
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @returns An array of objects ```[{ date: "1900-01-01", temp: 25.5 }]```
 */
function getTemperatures(dateFrom, dateTo) {
    return dataTemperatures.filter(d => d.dt >= dateFrom && d.dt <= dateTo).map(d => {
        let sum = 0;
        let cnt = 0;
        for (let t in d.data) {
            sum += d.data[t];
            cnt++;
        }
        return { date: d.dt, temp: (sum / cnt) };
    });
}