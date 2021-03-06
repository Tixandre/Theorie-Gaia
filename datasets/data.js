/* Utility functions */

function getMonth(dt) {
    let sp = dt.split("-");
    return sp[0] + "-" + sp[1].padStart(2, '0');
}
function getYear(dt) {
    return dt.split("-")[0];
}
function getFId(disa) {
    return disa.subgroup + '-' + disa.type + (disa.subtype == "-1" ? '' : ('-' + disa.subtype));
}
function mapDisasterTypes(d) {
    let nd = Object.assign({}, d);
    let sg = dataDisasterTypes.find(x => x.id == parseInt(d.subgroup)) || { name: "", types: [] };
    let t = sg.types.find(x => x.id == parseInt(d.type)) || { name: "", subtypes: [] };
    nd.subgroup = sg.name;
    nd.type = t.name;
    nd.subtype = (t.subtypes.find(x => x.id == parseInt(d.subtype)) || { name: "" }).name;
    return nd;
}

/**
 * Calculate the temperature trend on an annual basis
 * 
 * @param {array} temperatures An array of objects containing temperatures
 * @returns An array of objects ```[{ date: "1900-01-01", temp: 25.5 }]```
 */
function getTemperatureTrend(temperatures) {
    let last = 0;
    let data = temperatures.reduce(function(rv, x) {
        let y = getYear(x.date);
        if (parseInt(y) > last) {
            last = y;
        }
        let d = (rv[y] || { t: 0, n: 0});
        d.t += x.temp;
        d.n += 1;
        rv[y] = d;
        return rv;
      }, {});

    let res = [];
    for (const y in data) {
        if (data.hasOwnProperty(y)) {
            if (parseInt(y) == last) {
                let d = data[(parseInt(y)-1).toString()];
                if (d != undefined) {
                    res.push({ date: y, temp: (d.t/d.n) });
                }
            } else {
                let d = data[y];
                res.push({ date: y, temp: (d.t/d.n) });
            }
        }
    }
    return res;
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
 * Returns the global CO2 level at a specified month
 * 
 * Needs ```co2.js```
 * 
 * @param {string} date Date in the given month
 * @returns A float
 */
function getCO2ByMonth(date) {
    let m = getMonth(date);
    let y = getYear(date);
    let comp = (m < "1958-03" ? c => { return getYear(c.dt) == y} : c => { return getMonth(c.dt) == m});

    return dataCO2.find(comp).value;
}

/**
 * Returns the number of disasters in a specified country between two dates
 * 
 * Needs ```disasters.js```
 * 
 * @param {string} isoCode Country ISO-3 code
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @param {array} filters The selected filters, all if not given
 * @returns An array of objects ```[{ date: "1900", disa: 5 }, { date: "1901", disa: 1 }]```
 */
function getDisastersByCountry(isoCode, dateFrom, dateTo, filters = undefined) {
    let data = dataDisasters.filter(d => d.dt >= dateFrom && d.dt <= dateTo && d.ISO == isoCode && (filters == undefined || filters.includes(getFId(d)))).reduce(function(rv, x) {
        let m = getYear(x.dt);
        rv[m] = (rv[m] || 0) + 1;
        return rv;
      }, {});

      let res = [];
      for (const date in data) {
          if (data.hasOwnProperty(date)) {
              res.push({date: date, disa: data[date]});
          }
      }
      return res;
}

/**
 * Returns the disasters in a specified country during a specified month
 * 
 * Needs ```disasters.js``` and ```disasters_types.js```
 * 
 * @param {string} date Date in the given month
 * @param {string} isoCode Country ISO-3 code. If not given, return the disasters for all countries.
 * @param {array} filters The selected filters, all if not given
 * @returns An array of objects ```[{ dt: "1900-01-01", subgroup: "0", ... }]``` if isoCode specified, else an object ```{ "CHE": [{ dt: "1900-01-01", subgroup: "0", ... }], "IND": ... }```
 */
function getDisastersByMonth(date, isoCode = undefined, filters = undefined) {
    let m = getMonth(date);
    let data = dataDisasters.filter(d => getMonth(d.dt) == m && (isoCode == undefined || d.ISO == isoCode) && (filters == undefined || filters.includes(getFId(d)))).map(mapDisasterTypes).reduce(function(rv, x) {
        (rv[x.ISO] = rv[x.ISO] || []).push(x);
        return rv;
      }, {});

    return (isoCode == undefined ? data : data[isoCode]);
}

/**
 * Returns the temperatures at a specified month
 * 
 * Needs ```temperatures.js```
 * 
 * @param {string} date Date in the given month
 * @returns An object ```{ "CHE": 12.6, "IND": 35.1, ... }]```
 */
function getTemperaturesByMonth(date) {
    let m = getMonth(date);
    return dataTemperatures.find(t => getMonth(t.dt) == m).data;
}

/**
 * Returns the number of disasters in the world between two dates
 * 
 * Needs ```disasters.js```
 * 
 * @param {string} dateFrom Date range start, included
 * @param {string} dateTo Date range stop, included
 * @param {array} filters The selected filters, all if not given
 * @returns An array of objects ```[{ date: "1900-01", disa: 5 }, { date: "1900-04", disa: 1 }]```
 */
function getDisasters(dateFrom, dateTo, filters = undefined) {
    let data = dataDisasters.filter(d => d.dt >= dateFrom && d.dt <= dateTo && (filters == undefined || filters.includes(getFId(d)))).reduce(function(rv, x) {
        let m = getYear(x.dt);
        rv[m] = (rv[m] || 0) + 1;
        return rv;
      }, {});

      let res = [];
      for (const date in data) {
          if (data.hasOwnProperty(date)) {
              res.push({date: date, disa: data[date]});
          }
      }
      return res;
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
    return dataTemperatures.filter(d => getMonth(d.dt) >= getMonth(dateFrom) && getMonth(d.dt) <= getMonth(dateTo)).map(d => {
        let sum = 0;
        let cnt = 0;
        for (let t in d.data) {
            sum += d.data[t];
            cnt++;
        }
        return { date: d.dt, temp: (sum / cnt) };
    });
}